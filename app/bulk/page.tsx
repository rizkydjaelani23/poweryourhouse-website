"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

type GenType  = "STANDARD" | "HD";
type Status   = "idle" | "queued" | "processing" | "done" | "error";

interface ImageSlot {
  file:    File;
  preview: string;
}
interface Result {
  url:    string | null;
  status: Status;
  error:  string | null;
}

const MAX_IMAGES = 5;

const BULK_FEATURES = [
  { icon: "⚡", title: "5 images at once", desc: "Upload up to 5 photos and recolour them all in one click — no waiting between each." },
  { icon: "🎨", title: "One colour, all images", desc: "Set a single target colour and apply it consistently across your entire batch." },
  { icon: "📦", title: "Download as ZIP", desc: "All recoloured images packaged into a single ZIP file — ready to upload." },
  { icon: "🕐", title: "Saves hours", desc: "What takes 30 minutes manually takes 60 seconds with Bulk. Do more, spend less." },
];

export default function BulkPage() {
  const [slots,      setSlots]      = useState<ImageSlot[]>([]);
  const [colourHex,  setColourHex]  = useState("#5b3a8b");
  const [colourName, setColourName] = useState("");
  const [genType,    setGenType]    = useState<GenType>("STANDARD");
  const [results,    setResults]    = useState<Result[]>([]);
  const [generating, setGenerating] = useState(false);
  const [credits,    setCredits]    = useState<{ standard: number; hd: number } | null>(null);
  const [zipping,    setZipping]    = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Credits ────────────────────────────────────────────────────────────────
  async function fetchCredits() {
    const r = await fetch("/api/credits");
    if (r.ok) { const d = await r.json(); setCredits(d); }
  }
  useEffect(() => { fetchCredits(); }, []);

  // ── Image management ───────────────────────────────────────────────────────
  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setSlots((prev) => {
      const available = MAX_IMAGES - prev.length;
      const toAdd = arr.slice(0, available).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...toAdd];
    });
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, []);

  function removeSlot(i: number) {
    setSlots((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function resetAll() {
    slots.forEach((s) => URL.revokeObjectURL(s.preview));
    setSlots([]);
    setResults([]);
  }

  // ── Generate ───────────────────────────────────────────────────────────────
  async function generate() {
    if (slots.length === 0 || generating) return;
    setGenerating(true);

    const init: Result[] = slots.map(() => ({ url: null, status: "queued", error: null }));
    setResults(init);

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);

    for (let i = 0; i < slots.length; i++) {
      setResults((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: "processing" } : r))
      );

      const form = new FormData();
      form.append("imageFile",  slots[i].file);
      form.append("type",       genType);
      form.append("colourHex",  colourHex);
      form.append("colourName", colourName);

      try {
        const res  = await fetch("/api/generate", { method: "POST", body: form });
        const data = await res.json();

        if (!res.ok) {
          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i ? { url: null, status: "error", error: data.error || "Failed" } : r
            )
          );
          if (data.insufficientCredits) {
            setResults((prev) =>
              prev.map((r, idx) =>
                idx > i ? { url: null, status: "error", error: "Out of credits" } : r
              )
            );
            break;
          }
        } else {
          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i ? { url: data.outputUrl, status: "done", error: null } : r
            )
          );
        }
      } catch {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { url: null, status: "error", error: "Network error" } : r
          )
        );
      }
    }

    setGenerating(false);
    fetchCredits();
  }

  // ── Download ZIP ───────────────────────────────────────────────────────────
  async function downloadZip() {
    const doneUrls = results.filter((r) => r.status === "done" && r.url).map((r) => r.url!);
    if (doneUrls.length === 0) return;
    setZipping(true);
    try {
      const label = colourName || colourHex.replace("#", "");
      const res = await fetch("/api/download-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: doneUrls, filename: `recoloured-${label}` }),
      });
      if (!res.ok) throw new Error("ZIP failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `recoloured-${label}.zip`;
      link.click();
    } finally {
      setZipping(false);
    }
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const creditAvail   = genType === "HD" ? (credits?.hd ?? 0) : (credits?.standard ?? 0);
  const creditNeeded  = slots.length;
  const creditShort   = credits !== null && creditNeeded > creditAvail;
  const willGenerate  = Math.min(creditNeeded, creditAvail);
  const doneResults   = results.filter((r) => r.status === "done");
  const anyDone       = doneResults.length > 0;
  const allSettled    = results.length > 0 && results.every((r) => r.status === "done" || r.status === "error");

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "920px" }}>

        {/* ── Hero header ── */}
        <div style={{
          marginBottom: "28px",
          padding: "28px 32px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(79,70,229,0.06) 100%)",
          border: "1px solid rgba(59,130,246,0.18)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Background orb */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", flexWrap: "wrap", position: "relative" }}>
            <div>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                marginBottom: "12px",
                padding: "4px 12px", borderRadius: "999px",
                background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                fontSize: "11px", fontWeight: 800, color: "#60a5fa", letterSpacing: "0.06em",
              }}>
                ⚡ BULK GENERATOR
              </div>

              <h1 style={{ fontSize: "clamp(22px,3.5vw,30px)", fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.15 }}>
                Recolour up to 5 images<br />
                <span style={{ background: "linear-gradient(135deg, #60a5fa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  in one click
                </span>
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px", lineHeight: 1.6, maxWidth: "480px" }}>
                Upload your images, choose a colour, and generate all recolours at once. Each one costs 1 credit. Download everything as a ZIP.
              </p>

              {/* Feature pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["5 images at once", "ZIP download", "1 credit per image", "Standard & HD"].map((f) => (
                  <span key={f} style={{
                    padding: "4px 12px", borderRadius: "999px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "12px", color: "#94a3b8", fontWeight: 600,
                  }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Credits pill */}
            {credits !== null && (
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "12px 16px", borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                border: credits.standard === 0 ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.08)",
                flexShrink: 0,
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: credits.standard === 0 ? "#ef4444" : "#60a5fa", lineHeight: 1 }}>{credits.standard}</div>
                  <div style={{ fontSize: "10px", color: "#475569", marginTop: "3px" }}>⚡ Standard</div>
                </div>
                <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ textAlign: "center" }}>
                  {credits.hd > 0 ? (
                    <>
                      <div style={{ fontSize: "20px", fontWeight: 800, color: "#a78bfa", lineHeight: 1 }}>{credits.hd}</div>
                      <div style={{ fontSize: "10px", color: "#475569", marginTop: "3px" }}>✨ HD</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#334155", lineHeight: 1 }}>✨ HD</div>
                      <Link href="/pricing" style={{ fontSize: "10px", color: "#60a5fa", marginTop: "3px", display: "block", fontWeight: 700 }}>Get HD →</Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px" }} className="feat-grid">
          {BULK_FEATURES.map((f) => (
            <div key={f.title} style={{
              padding: "14px 16px", borderRadius: "12px",
              background: "#0d1424", border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{f.icon}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#e2e8f0", marginBottom: "4px" }}>{f.title}</div>
              <div style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* ── Step 1: Upload images ── */}
          <Card title={`1. Upload images — ${slots.length} / ${MAX_IMAGES} selected`}>

            {slots.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "12px" }} className="thumb-grid">
                {slots.map((s, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "1", background: "#060c19" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.preview} alt={`Image ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", top: "5px", left: "5px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(59,130,246,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "#fff" }}>
                      {i + 1}
                    </div>
                    {!generating && (
                      <button onClick={() => removeSlot(i)} style={{ position: "absolute", top: "5px", right: "5px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {slots.length < MAX_IMAGES && (
                  <label style={{ aspectRatio: "1", borderRadius: "10px", border: "2px dashed #1e293b", background: "#0d1424", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "22px", color: "#334155", gap: "4px" }}>
                    <span>＋</span>
                    <span style={{ fontSize: "10px", color: "#334155" }}>Add</span>
                    <input type="file" accept="image/*" multiple style={{ display: "none" }}
                      onChange={(e) => { if (e.target.files) addFiles(e.target.files); }} />
                  </label>
                )}
              </div>
            )}

            {slots.length === 0 && (
              <label onDrop={onDrop} onDragOver={(e) => e.preventDefault()}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #1e293b", borderRadius: "12px", padding: "48px 24px", cursor: "pointer", background: "#0d1424", minHeight: "180px", textAlign: "center" }}>
                <div style={{ fontSize: "44px", marginBottom: "12px" }}>🖼️</div>
                <div style={{ color: "#64748b", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Drop up to {MAX_IMAGES} images here</div>
                <div style={{ color: "#334155", fontSize: "13px" }}>or click to browse — JPG, PNG, WebP, max 10 MB each</div>
                <input type="file" accept="image/*" multiple style={{ display: "none" }}
                  onChange={(e) => { if (e.target.files) addFiles(e.target.files); }} />
              </label>
            )}

            {slots.length > 0 && slots.length < MAX_IMAGES && (
              <p style={{ fontSize: "12px", color: "#334155", marginTop: "4px" }}>
                You can add {MAX_IMAGES - slots.length} more image{MAX_IMAGES - slots.length > 1 ? "s" : ""}.
              </p>
            )}
          </Card>

          {/* ── Steps 2 & 3: Colour + Quality ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="ctrl-grid">

            <Card title="2. Target colour — applied to all images">
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input type="color" value={colourHex} onChange={(e) => setColourHex(e.target.value)}
                  style={{ width: "52px", height: "52px", borderRadius: "10px", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <input type="text" value={colourHex}
                    onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColourHex(e.target.value); }}
                    style={{ ...inputStyle, marginBottom: "6px" }} placeholder="#5b3a8b" />
                  <input type="text" value={colourName} onChange={(e) => setColourName(e.target.value)}
                    style={inputStyle} placeholder="Colour name (optional)" />
                </div>
              </div>
            </Card>

            <Card title="3. Quality">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {([
                  { type: "STANDARD" as GenType, icon: "⚡", label: "Standard", desc: "1 credit per image", colour: "#3b82f6" },
                  { type: "HD"       as GenType, icon: "✨", label: "HD Realistic", desc: "1 HD credit per image", colour: "#8b5cf6" },
                ] as const).map(({ type, icon, label, desc, colour }) => (
                  <button key={type} onClick={() => setGenType(type)} style={{ padding: "12px", borderRadius: "10px", textAlign: "left", cursor: "pointer", border: genType === type ? `1.5px solid ${colour}` : "1.5px solid #1e293b", background: genType === type ? `${colour}14` : "#0d1424" }}>
                    <span style={{ fontWeight: 700, color: genType === type ? colour : "#94a3b8", fontSize: "14px" }}>{icon} {label}</span>
                    <span style={{ fontSize: "12px", color: "#475569", marginLeft: "8px" }}>{desc}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Credit warning ── */}
          {credits !== null && slots.length > 0 && creditShort && (
            <div style={{ padding: "14px 16px", borderRadius: "12px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>
                  You have {creditAvail} {genType === "HD" ? "HD" : "standard"} credit{creditAvail !== 1 ? "s" : ""} — only {willGenerate} of {slots.length} images will be generated
                </div>
                <div style={{ color: "#78716c", fontSize: "12px" }}>Top up to generate all {slots.length} images.</div>
              </div>
              <Link href="/pricing" style={{ flexShrink: 0, padding: "9px 16px", borderRadius: "9px", fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", whiteSpace: "nowrap" }}>
                Top up →
              </Link>
            </div>
          )}

          {/* ── Generate button ── */}
          <button onClick={generate} disabled={generating || slots.length === 0 || creditAvail === 0}
            style={{
              padding: "18px", borderRadius: "12px", fontWeight: 800, fontSize: "17px", border: "none",
              cursor: (generating || slots.length === 0 || creditAvail === 0) ? "not-allowed" : "pointer",
              background: generating || slots.length === 0 || creditAvail === 0
                ? "#1e293b"
                : genType === "HD"
                  ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                  : "linear-gradient(135deg, #3b82f6, #0ea5e9)",
              color: (generating || slots.length === 0 || creditAvail === 0) ? "#475569" : "#fff",
              boxShadow: (!generating && slots.length > 0 && creditAvail > 0)
                ? (genType === "HD" ? "0 4px 24px rgba(124,58,237,0.35)" : "0 4px 24px rgba(59,130,246,0.35)")
                : "none",
            }}>
            {generating
              ? `⏳ Generating ${results.filter((r) => r.status === "done").length + 1} of ${slots.length}…`
              : slots.length === 0
                ? "Upload images to start"
                : `${genType === "HD" ? "✨ HD Render" : "⚡ Generate"} ${willGenerate} image${willGenerate !== 1 ? "s" : ""} →`}
          </button>

          {/* ── Results ── */}
          {results.length > 0 && (
            <div ref={resultsRef}>
              <Card title="Results">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {results.map((r, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 32px 1fr auto", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", background: "#060c19", border: `1px solid ${r.status === "done" ? "rgba(16,185,129,0.15)" : r.status === "error" ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)"}` }} className="result-row">

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slots[i]?.preview} alt={`Original ${i + 1}`} style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px", display: "block" }} />

                      <div style={{ textAlign: "center", color: "#334155", fontSize: "16px" }}>→</div>

                      <div>
                        {r.status === "queued"     && <span style={{ fontSize: "13px", color: "#475569" }}>Queued…</span>}
                        {r.status === "processing" && (
                          <span style={{ fontSize: "13px", color: "#60a5fa" }}>
                            <span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginRight: "6px" }}>⏳</span>
                            Generating…
                          </span>
                        )}
                        {r.status === "done" && r.url && (
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={r.url} alt={`Result ${i + 1}`} style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "6px", display: "block" }} />
                            <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>✓ Done</span>
                          </div>
                        )}
                        {r.status === "error" && (
                          <span style={{ fontSize: "12px", color: "#f87171" }}>
                            ✗ {r.error}
                            {r.error === "Out of credits" && (
                              <Link href="/pricing" style={{ marginLeft: "8px", color: "#60a5fa", fontWeight: 700 }}>Top up →</Link>
                            )}
                          </span>
                        )}
                      </div>

                      {r.status === "done" && r.url && (
                        <a href={r.url} download={`recoloured-${i + 1}.jpg`} target="_blank" rel="noopener noreferrer"
                          style={{ flexShrink: 0, padding: "7px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", whiteSpace: "nowrap" }}>
                          ⬇ Save
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {anyDone && allSettled && (
                  <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={downloadZip} disabled={zipping}
                      style={{ flex: 1, padding: "14px", borderRadius: "10px", fontWeight: 800, fontSize: "15px", border: "none", cursor: zipping ? "not-allowed" : "pointer", background: zipping ? "#1e293b" : "linear-gradient(135deg, #10b981, #059669)", color: zipping ? "#475569" : "#fff", boxShadow: zipping ? "none" : "0 4px 20px rgba(16,185,129,0.3)" }}>
                      {zipping ? "⏳ Preparing ZIP…" : `⬇ Download all ${doneResults.length} image${doneResults.length !== 1 ? "s" : ""} as ZIP`}
                    </button>
                    <button onClick={resetAll}
                      style={{ padding: "14px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", border: "1px solid #1e293b", background: "transparent", color: "#64748b", cursor: "pointer" }}>
                      Start over
                    </button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ── Low credits CTA ── */}
          {credits !== null && credits.standard < 3 && results.length === 0 && (
            <div style={{ padding: "20px 24px", borderRadius: "14px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: "14px", marginBottom: "3px" }}>
                  Running low? Get more credits
                </div>
                <div style={{ color: "#475569", fontSize: "13px" }}>
                  Bulk generation uses 1 credit per image. Top up to keep going.
                </div>
              </div>
              <Link href="/pricing" style={{ flexShrink: 0, padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "#fff", whiteSpace: "nowrap" }}>
                View plans →
              </Link>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 860px) {
          .feat-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 680px) {
          .feat-grid   { grid-template-columns: 1fr 1fr !important; }
          .ctrl-grid   { grid-template-columns: 1fr !important; }
          .thumb-grid  { grid-template-columns: repeat(3, 1fr) !important; }
          .result-row  { grid-template-columns: 64px 24px 1fr auto !important; }
        }
        @media (max-width: 420px) {
          .feat-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(139,92,246,0.12)", padding: "20px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "8px",
  background: "#111827", border: "1px solid #1e293b",
  color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box",
};
