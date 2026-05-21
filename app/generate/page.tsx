"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type GenType = "STANDARD" | "HD";

export default function GeneratePage() {
  const [imageFile,   setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [swatchFile,  setSwatchFile]  = useState<File | null>(null);
  const [swatchPreview, setSwatchPreview] = useState<string | null>(null);
  const [colourHex,   setColourHex]   = useState("#5b3a8b");
  const [colourName,  setColourName]  = useState("");
  const [colourMode,  setColourMode]  = useState<"picker" | "swatch">("picker");
  const [genType,     setGenType]     = useState<GenType>("STANDARD");
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState<string | null>(null);
  const [error,       setError]       = useState<string | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const dropRef = useRef<HTMLLabelElement>(null);

  function handleImageFile(file: File) {
    setImageFile(file);
    setResult(null);
    setError(null);
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

    try {
      const res  = await fetch("/api/generate", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        if (data.insufficientCredits) setInsufficientCredits(true);
        setError(data.error || "Generation failed");
        return;
      }
      setResult(data.outputUrl);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
            ✨ AI Colour Remaker
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Upload any product or room photo and see it in a new colour instantly.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "24px", alignItems: "start" }}>

          {/* ── Left panel — inputs ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Image upload */}
            <Card title="1. Upload your image">
              <label
                ref={dropRef}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  border: imageFile ? "2px solid #3b82f6" : "2px dashed #1e293b",
                  borderRadius: "12px", padding: "24px", cursor: "pointer",
                  background: imageFile ? "rgba(59,130,246,0.05)" : "#0d1424",
                  minHeight: "140px", textAlign: "center", transition: "all 0.15s",
                }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ maxHeight: "200px", borderRadius: "8px", objectFit: "contain" }} />
                ) : (
                  <>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>🖼️</div>
                    <div style={{ color: "#64748b", fontSize: "14px" }}>Drop image here or click to browse</div>
                    <div style={{ color: "#334155", fontSize: "12px", marginTop: "4px" }}>JPG, PNG, WebP — max 10 MB</div>
                  </>
                )}
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
              </label>
            </Card>

            {/* Colour selection */}
            <Card title="2. Choose target colour">
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                {(["picker", "swatch"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setColourMode(mode)}
                    style={{
                      flex: 1, padding: "9px", borderRadius: "9px", fontSize: "13px", fontWeight: 700,
                      border: colourMode === mode ? "1px solid #3b82f6" : "1px solid #1e293b",
                      background: colourMode === mode ? "rgba(59,130,246,0.12)" : "#0d1424",
                      color: colourMode === mode ? "#60a5fa" : "#475569", cursor: "pointer",
                    }}
                  >
                    {mode === "picker" ? "🎨 Colour picker" : "🧵 Upload swatch"}
                  </button>
                ))}
              </div>

              {colourMode === "picker" ? (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" value={colourHex} onChange={(e) => setColourHex(e.target.value)}
                    style={{ width: "52px", height: "52px", borderRadius: "10px", border: "none", cursor: "pointer", background: "none", padding: 0 }} />
                  <div style={{ flex: 1 }}>
                    <input type="text" value={colourHex}
                      onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColourHex(e.target.value); }}
                      style={{ ...inputStyle, marginBottom: "6px" }} placeholder="#5b3a8b" />
                    <input type="text" value={colourName} onChange={(e) => setColourName(e.target.value)}
                      style={inputStyle} placeholder="Colour name (optional)" />
                  </div>
                </div>
              ) : (
                <label style={{ display: "flex", gap: "12px", alignItems: "center", cursor: "pointer", padding: "14px", borderRadius: "10px", border: "1px dashed #1e293b", background: "#0d1424" }}>
                  {swatchPreview
                    ? <img src={swatchPreview} alt="swatch" style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
                    : <div style={{ width: "60px", height: "60px", borderRadius: "8px", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>🧵</div>
                  }
                  <div>
                    <div style={{ color: swatchFile ? "#e2e8f0" : "#64748b", fontSize: "14px", fontWeight: 600 }}>
                      {swatchFile ? swatchFile.name : "Click to upload fabric swatch"}
                    </div>
                    <div style={{ color: "#334155", fontSize: "12px", marginTop: "2px" }}>Hex colour extracted automatically</div>
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSwatchFile(f); }} />
                </label>
              )}
            </Card>

            {/* Generation type */}
            <Card title="3. Quality">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {([
                  { type: "STANDARD" as GenType, icon: "⚡", label: "Standard", desc: "Fast colour shift · 1 credit", colour: "#3b82f6" },
                  { type: "HD" as GenType,       icon: "✨", label: "HD Realistic", desc: "AI photorealistic · 1 HD credit", colour: "#8b5cf6" },
                ] as const).map(({ type, icon, label, desc, colour }) => (
                  <button
                    key={type}
                    onClick={() => setGenType(type)}
                    style={{
                      padding: "14px", borderRadius: "12px", textAlign: "left", cursor: "pointer",
                      border: genType === type ? `1.5px solid ${colour}` : "1.5px solid #1e293b",
                      background: genType === type ? `${colour}14` : "#0d1424",
                    }}
                  >
                    <div style={{ fontSize: "22px", marginBottom: "4px" }}>{icon}</div>
                    <div style={{ fontWeight: 700, color: genType === type ? colour : "#94a3b8", fontSize: "14px" }}>{label}</div>
                    <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>{desc}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={loading || !imageFile}
              style={{
                padding: "16px", borderRadius: "12px", fontWeight: 700, fontSize: "16px",
                border: "none", cursor: (loading || !imageFile) ? "not-allowed" : "pointer",
                background: loading || !imageFile
                  ? "#1e293b"
                  : genType === "HD"
                    ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                    : "linear-gradient(135deg, #3b82f6, #0ea5e9)",
                color: (loading || !imageFile) ? "#475569" : "#fff",
                transition: "all 0.15s",
              }}
            >
              {loading
                ? (genType === "HD" ? "⏳ Generating HD (30–60s)…" : "⏳ Generating…")
                : `${genType === "HD" ? "✨ HD Render" : "⚡ Generate"} →`}
            </button>

            {/* Error */}
            {error && (
              <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "14px" }}>
                {error}
                {insufficientCredits && (
                  <div style={{ marginTop: "8px" }}>
                    <Link href="/pricing" style={{ color: "#60a5fa", fontWeight: 700 }}>→ Get more credits</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right panel — result ── */}
          <div style={{ position: "sticky", top: "100px" }}>
            <Card title="Result">
              {loading ? (
                <div style={{ aspectRatio: "4/3", borderRadius: "10px", background: "#0d1424", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <div style={{ fontSize: "36px", animation: "spin 1.5s linear infinite" }}>✨</div>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    {genType === "HD" ? "Running FLUX AI — 30–60 seconds…" : "Applying colour…"}
                  </div>
                </div>
              ) : result ? (
                <div>
                  <img src={result} alt="Generated result" style={{ width: "100%", borderRadius: "10px", display: "block" }} />
                  <a
                    href={result}
                    download="recoloured.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", marginTop: "12px", padding: "12px", borderRadius: "10px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontWeight: 700, fontSize: "14px", textAlign: "center" }}
                  >
                    ⬇ Download image
                  </a>
                  <button
                    onClick={() => { setResult(null); setError(null); }}
                    style={{ marginTop: "8px", width: "100%", padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid #1e293b", color: "#64748b", fontSize: "13px", fontWeight: 600 }}
                  >
                    Generate another
                  </button>
                </div>
              ) : (
                <div style={{ aspectRatio: "4/3", borderRadius: "10px", background: "#0d1424", border: "2px dashed #1e293b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <div style={{ fontSize: "36px" }}>🎨</div>
                  <div style={{ color: "#334155", fontSize: "14px" }}>Your result will appear here</div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .gen-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.12)", padding: "18px" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "14px" }}>
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
