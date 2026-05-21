"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import SelectionEditor, { SelectionEditorHandle } from "../components/SelectionEditor";

type GenType = "STANDARD" | "HD";

export default function GeneratePage() {
  const [imageFile,     setImageFile]     = useState<File | null>(null);
  const [imagePreview,  setImagePreview]  = useState<string | null>(null);
  const [swatchFile,    setSwatchFile]    = useState<File | null>(null);
  const [swatchPreview, setSwatchPreview] = useState<string | null>(null);
  const [colourHex,     setColourHex]     = useState("#5b3a8b");
  const [colourName,    setColourName]    = useState("");
  const [colourMode,    setColourMode]    = useState<"picker" | "swatch">("picker");
  const [genType,       setGenType]       = useState<GenType>("STANDARD");
  const [prompt,        setPrompt]        = useState("");
  const [loading,       setLoading]       = useState(false);
  const [result,        setResult]        = useState<string | null>(null);
  const [error,         setError]         = useState<string | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [hasMask,       setHasMask]       = useState(false);
  const [credits,       setCredits]       = useState<{ standard: number; hd: number } | null>(null);

  const selectionRef = useRef<SelectionEditorHandle | null>(null);
  const resultRef    = useRef<HTMLDivElement>(null);

  // ── credits ───────────────────────────────────────────────────────────────
  async function fetchCredits() {
    const res = await fetch("/api/credits");
    if (res.ok) { const d = await res.json(); setCredits(d); }
  }
  useEffect(() => { fetchCredits(); }, []);

  // ── image upload ──────────────────────────────────────────────────────────
  function handleImageFile(file: File) {
    setImageFile(file);
    setResult(null);
    setError(null);
    setHasMask(false);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSwatchFile(file: File) {
    setSwatchFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSwatchPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
  }, []);

  // ── generate ──────────────────────────────────────────────────────────────
  async function generate() {
    if (!imageFile) { setError("Upload an image first."); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    setInsufficientCredits(false);

    const form = new FormData();
    form.append("imageFile",  imageFile);
    form.append("type",       genType);
    form.append("colourHex",  colourHex);
    form.append("colourName", colourName);
    if (colourMode === "swatch" && swatchFile) form.append("swatchFile", swatchFile);
    if (genType === "HD" && prompt) form.append("prompt", prompt);

    const maskBlob = selectionRef.current ? await selectionRef.current.getMask() : null;
    if (maskBlob) form.append("maskFile", maskBlob, "mask.png");

    try {
      const res  = await fetch("/api/generate", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        if (data.insufficientCredits) setInsufficientCredits(true);
        setError(data.error || "Generation failed");
        return;
      }
      setResult(data.outputUrl);
      fetchCredits(); // refresh credits after spend
      // Scroll to result
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const creditsLow = credits !== null && (
    (genType === "STANDARD" && credits.standard <= 2) ||
    (genType === "HD" && credits.hd === 0)
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "920px" }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>
              ✨ AI Colour Remaker
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              Upload any product or room photo and recolour it instantly.
            </p>
          </div>

          {/* Credits pill */}
          {credits !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "8px 14px", borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#60a5fa", lineHeight: 1 }}>{credits.standard}</div>
                  <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>⚡ Standard</div>
                </div>
                <div style={{ width: "1px", height: "28px", background: "#1e293b" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#a78bfa", lineHeight: 1 }}>{credits.hd}</div>
                  <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>✨ HD</div>
                </div>
              </div>
              {creditsLow && (
                <Link href="/pricing" style={{
                  padding: "8px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: 700,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                  color: "#f87171",
                }}>
                  Low — Top up →
                </Link>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* ── Step 1: Upload ── */}
          <Card title="1. Upload your image">
            {imagePreview ? (
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", borderRadius: "10px", background: "#060c19", border: "1px solid rgba(139,92,246,0.2)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="preview"
                  style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#a78bfa", fontSize: "13px", fontWeight: 700, marginBottom: "3px" }}>✓ Image loaded</div>
                  <div style={{ color: "#475569", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {imageFile?.name}
                  </div>
                </div>
                <label style={{ flexShrink: 0, padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, border: "1px solid #1e293b", background: "#111827", color: "#64748b", cursor: "pointer" }}>
                  Change image
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
                </label>
              </div>
            ) : (
              <label
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  border: "2px dashed #1e293b", borderRadius: "12px", padding: "40px 24px",
                  cursor: "pointer", background: "#0d1424", minHeight: "160px", textAlign: "center",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🖼️</div>
                <div style={{ color: "#64748b", fontSize: "15px", fontWeight: 600 }}>Drop image here or click to browse</div>
                <div style={{ color: "#334155", fontSize: "12px", marginTop: "6px" }}>JPG, PNG, WebP — max 10 MB</div>
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
              </label>
            )}
          </Card>

          {/* ── Step 2: Selection editor (appears after upload) ── */}
          {imagePreview && (
            <Card title="2. Select the area to recolour (optional — leave blank for whole image)">
              <SelectionEditor
                imageSrc={imagePreview}
                handleRef={selectionRef}
                onMaskChange={setHasMask}
              />
              {hasMask && (
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "13px", color: "#a78bfa", fontWeight: 700 }}>✓ Selection active — only selected area will be recoloured</span>
                  <button
                    onClick={() => selectionRef.current?.clear()}
                    style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", cursor: "pointer" }}
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </Card>
          )}

          {/* ── Steps 3 & 4: Colour + Quality side-by-side ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="ctrl-grid">

            {/* Colour */}
            <Card title={`${imagePreview ? "3" : "2"}. Target colour`}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                {(["picker", "swatch"] as const).map((mode) => (
                  <button key={mode} onClick={() => setColourMode(mode)} style={{
                    flex: 1, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
                    border: colourMode === mode ? "1px solid #8b5cf6" : "1px solid #1e293b",
                    background: colourMode === mode ? "rgba(139,92,246,0.12)" : "#0d1424",
                    color: colourMode === mode ? "#a78bfa" : "#475569", cursor: "pointer",
                  }}>
                    {mode === "picker" ? "🎨 Picker" : "🧵 Swatch"}
                  </button>
                ))}
              </div>

              {colourMode === "picker" ? (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={colourHex} onChange={(e) => setColourHex(e.target.value)}
                    style={{ width: "52px", height: "52px", borderRadius: "10px", border: "none", cursor: "pointer", background: "none", padding: 0, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <input type="text" value={colourHex}
                      onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColourHex(e.target.value); }}
                      style={{ ...inputStyle, marginBottom: "6px" }} placeholder="#5b3a8b" />
                    <input type="text" value={colourName} onChange={(e) => setColourName(e.target.value)}
                      style={inputStyle} placeholder="Colour name (optional)" />
                  </div>
                </div>
              ) : (
                <label style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer", padding: "12px", borderRadius: "10px", border: "1px dashed #1e293b", background: "#0d1424" }}>
                  {swatchPreview
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={swatchPreview} alt="swatch" style={{ width: "52px", height: "52px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />
                    : <div style={{ width: "52px", height: "52px", borderRadius: "6px", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🧵</div>
                  }
                  <div>
                    <div style={{ color: swatchFile ? "#e2e8f0" : "#64748b", fontSize: "13px", fontWeight: 600 }}>
                      {swatchFile ? swatchFile.name : "Upload fabric swatch"}
                    </div>
                    <div style={{ color: "#334155", fontSize: "11px", marginTop: "2px" }}>Hex extracted automatically</div>
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSwatchFile(f); }} />
                </label>
              )}
            </Card>

            {/* Quality */}
            <Card title={`${imagePreview ? "4" : "3"}. Quality`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {([
                  { type: "STANDARD" as GenType, icon: "⚡", label: "Standard", desc: "Fast colour shift · 1 credit", colour: "#3b82f6" },
                  { type: "HD" as GenType,       icon: "✨", label: "HD Realistic", desc: "AI photorealistic · 1 HD credit", colour: "#8b5cf6" },
                ] as const).map(({ type, icon, label, desc, colour }) => (
                  <button key={type} onClick={() => setGenType(type)} style={{
                    padding: "14px", borderRadius: "12px", textAlign: "left", cursor: "pointer",
                    border: genType === type ? `1.5px solid ${colour}` : "1.5px solid #1e293b",
                    background: genType === type ? `${colour}14` : "#0d1424",
                  }}>
                    <div style={{ fontSize: "20px", marginBottom: "2px" }}>{icon}</div>
                    <div style={{ fontWeight: 700, color: genType === type ? colour : "#94a3b8", fontSize: "14px" }}>{label}</div>
                    <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>{desc}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Step 5: Prompt (HD only) ── */}
          {genType === "HD" && (
            <Card title={`${imagePreview ? "5" : "4"}. Describe the result (optional)`}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`e.g. "Dusty rose velvet with a soft matte finish" or "Deep forest green, glossy lacquer paint"`}
                rows={3}
                style={{ ...inputStyle, resize: "vertical", minHeight: "72px", lineHeight: "1.6", fontFamily: "inherit" }}
              />
              <p style={{ fontSize: "11px", color: "#334155", marginTop: "6px" }}>
                The AI uses this alongside the hex colour. Leave blank to use the colour alone.
              </p>
            </Card>
          )}

          {/* ── Generate button ── */}
          <button
            onClick={generate}
            disabled={loading || !imageFile}
            style={{
              padding: "18px", borderRadius: "12px", fontWeight: 800, fontSize: "17px",
              border: "none", cursor: (loading || !imageFile) ? "not-allowed" : "pointer",
              background: loading || !imageFile
                ? "#1e293b"
                : genType === "HD"
                  ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                  : "linear-gradient(135deg, #3b82f6, #0ea5e9)",
              color: (loading || !imageFile) ? "#475569" : "#fff",
              transition: "all 0.15s",
              boxShadow: (!loading && imageFile) ? (genType === "HD" ? "0 4px 24px rgba(124,58,237,0.35)" : "0 4px 24px rgba(59,130,246,0.35)") : "none",
            }}
          >
            {loading
              ? (genType === "HD" ? "⏳ Generating HD — 30 to 60 seconds…" : "⏳ Applying colour…")
              : `${genType === "HD" ? "✨ HD Render" : "⚡ Generate"} →`}
          </button>

          {/* ── Error ── */}
          {error && (
            <div style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "14px" }}>
              {error}
              {insufficientCredits && (
                <div style={{ marginTop: "8px" }}>
                  <Link href="/pricing" style={{ color: "#60a5fa", fontWeight: 700 }}>→ Top up credits</Link>
                </div>
              )}
            </div>
          )}

          {/* ── Result (appears below generate) ── */}
          <div ref={resultRef}>
            {loading && (
              <Card title="Result">
                <div style={{ aspectRatio: "16/9", borderRadius: "10px", background: "#060c19", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                  <div style={{ fontSize: "42px", animation: "spin 1.5s linear infinite" }}>✨</div>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    {genType === "HD" ? "Running FLUX AI — hang tight…" : "Applying your colour…"}
                  </div>
                  {genType === "HD" && (
                    <div style={{ color: "#334155", fontSize: "12px" }}>This usually takes 30–60 seconds</div>
                  )}
                </div>
              </Card>
            )}

            {result && !loading && (
              <Card title="Result">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result} alt="Generated result" style={{ width: "100%", borderRadius: "10px", display: "block" }} />
                <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                  <a
                    href={result} download="recoloured.jpg" target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, padding: "13px", borderRadius: "10px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontWeight: 700, fontSize: "14px", textAlign: "center", display: "block" }}
                  >
                    ⬇ Download image
                  </a>
                  <button
                    onClick={() => { setResult(null); setError(null); }}
                    style={{ padding: "13px 20px", borderRadius: "10px", background: "transparent", border: "1px solid #1e293b", color: "#64748b", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Generate another
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* ── Tips ── */}
          <div style={{ padding: "14px 18px", borderRadius: "12px", background: "#0d1424", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>💡 Tips</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", fontSize: "12px", color: "#334155", lineHeight: 1.8 }} className="tips-grid">
              <span>Use <strong style={{ color: "#64748b" }}>Outline</strong> to trace an exact shape</span>
              <span>Use <strong style={{ color: "#64748b" }}>Brush</strong> to paint freehand</span>
              <span>Leave selection blank to recolour the whole image</span>
              <span>Scroll to zoom · Alt+drag to pan · Ctrl+Z to undo</span>
              <span>HD mode works best with a descriptive prompt</span>
              <span>Upload a fabric swatch for exact colour matching</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 680px) {
          .ctrl-grid  { grid-template-columns: 1fr !important; }
          .tips-grid  { grid-template-columns: 1fr !important; }
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
