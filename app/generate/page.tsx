"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

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

  // Canvas / outline tool
  const [maskMode,      setMaskMode]      = useState(false);
  const [brushSize,     setBrushSize]     = useState(24);
  const [hasMask,       setHasMask]       = useState(false);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const paintingRef = useRef(false);
  const dropRef     = useRef<HTMLLabelElement>(null);

  // ── image upload ──────────────────────────────────────────────
  function handleImageFile(file: File) {
    setImageFile(file);
    setResult(null);
    setError(null);
    setHasMask(false);
    setMaskMode(false);
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

  // ── canvas mask ───────────────────────────────────────────────
  useEffect(() => {
    if (!maskMode || !imagePreview || !canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    canvas.width  = img.naturalWidth  || img.clientWidth;
    canvas.height = img.naturalHeight || img.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasMask(false);
  }, [maskMode, imagePreview]);

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  function paint(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!paintingRef.current) return;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(139,92,246,0.55)";
    ctx.fill();
    setHasMask(true);
  }

  function clearMask() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasMask(false);
  }

  function getMaskBlob(): Promise<Blob | null> {
    const canvas = canvasRef.current;
    if (!canvas || !hasMask) return Promise.resolve(null);
    // Convert painted overlay to a B&W mask
    const offscreen = document.createElement("canvas");
    offscreen.width  = canvas.width;
    offscreen.height = canvas.height;
    const ctx = offscreen.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    // Draw painted areas as white
    const data = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < data.data.length; i += 4) {
      if (data.data[i] > 0) {
        const x = Math.floor((i / 4) % canvas.width);
        const y = Math.floor((i / 4) / canvas.width);
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return new Promise((res) => offscreen.toBlob((b) => res(b), "image/png"));
  }

  // ── generate ──────────────────────────────────────────────────
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

    // Attach mask if painted
    const maskBlob = await getMaskBlob();
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
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "1060px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
            ✨ AI Colour Remaker
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Upload any product or room photo and see it in a new colour instantly.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "24px", alignItems: "start" }} className="gen-grid">

          {/* ── Left panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Image upload */}
            <Card title="1. Upload your image">
              <label
                ref={dropRef}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  border: imageFile ? "2px solid #8b5cf6" : "2px dashed #1e293b",
                  borderRadius: "12px", padding: "24px", cursor: "pointer",
                  background: imageFile ? "rgba(139,92,246,0.05)" : "#0d1424",
                  minHeight: "140px", textAlign: "center", transition: "all 0.15s",
                  position: "relative",
                }}
              >
                {imagePreview ? (
                  <>
                    {/* The actual image (used for canvas sizing) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={imgRef}
                      src={imagePreview}
                      alt="preview"
                      style={{ maxHeight: "220px", borderRadius: "8px", objectFit: "contain", display: "block", width: "100%" }}
                    />
                    {/* Canvas overlay for mask painting */}
                    {maskMode && (
                      <canvas
                        ref={canvasRef}
                        style={{
                          position: "absolute", inset: 0, width: "100%", height: "100%",
                          borderRadius: "12px", cursor: "crosshair", touchAction: "none",
                        }}
                        onMouseDown={(e) => { paintingRef.current = true; paint(e); }}
                        onMouseMove={paint}
                        onMouseUp={() => { paintingRef.current = false; }}
                        onMouseLeave={() => { paintingRef.current = false; }}
                        onTouchStart={(e) => { e.preventDefault(); paintingRef.current = true; paint(e); }}
                        onTouchMove={(e) => { e.preventDefault(); paint(e); }}
                        onTouchEnd={() => { paintingRef.current = false; }}
                      />
                    )}
                  </>
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

              {/* Outline / mask tools */}
              {imagePreview && (
                <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={() => setMaskMode((v) => !v)}
                    style={{
                      padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
                      border: maskMode ? "1px solid #8b5cf6" : "1px solid #1e293b",
                      background: maskMode ? "rgba(139,92,246,0.15)" : "#111827",
                      color: maskMode ? "#a78bfa" : "#64748b", cursor: "pointer",
                    }}
                  >
                    🖌️ {maskMode ? "Painting selection ON" : "Paint selection area"}
                  </button>
                  {maskMode && (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "#475569" }}>Brush:</span>
                        <input
                          type="range" min={6} max={60} value={brushSize}
                          onChange={(e) => setBrushSize(Number(e.target.value))}
                          style={{ width: "70px" }}
                        />
                        <span style={{ fontSize: "11px", color: "#475569" }}>{brushSize}px</span>
                      </div>
                      {hasMask && (
                        <button onClick={clearMask} style={{ padding: "7px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "1px solid #1e293b", background: "#111827", color: "#ef4444", cursor: "pointer" }}>
                          ✕ Clear
                        </button>
                      )}
                    </>
                  )}
                  {hasMask && !maskMode && (
                    <span style={{ fontSize: "12px", color: "#a78bfa", fontWeight: 600 }}>✓ Selection active</span>
                  )}
                </div>
              )}
              {maskMode && (
                <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px" }}>
                  Paint over the area you want recoloured. Leave blank to recolour the whole image.
                </p>
              )}
            </Card>

            {/* Colour selection */}
            <Card title="2. Choose target colour">
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                {(["picker", "swatch"] as const).map((mode) => (
                  <button key={mode} onClick={() => setColourMode(mode)} style={{
                    flex: 1, padding: "9px", borderRadius: "9px", fontSize: "13px", fontWeight: 700,
                    border: colourMode === mode ? "1px solid #8b5cf6" : "1px solid #1e293b",
                    background: colourMode === mode ? "rgba(139,92,246,0.12)" : "#0d1424",
                    color: colourMode === mode ? "#a78bfa" : "#475569", cursor: "pointer",
                  }}>
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
                    : <div style={{ width: "60px", height: "60px", borderRadius: "8px", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>🧵</div>}
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

            {/* Quality */}
            <Card title="3. Quality">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {([
                  { type: "STANDARD" as GenType, icon: "⚡", label: "Standard", desc: "Fast colour shift · 1 credit", colour: "#3b82f6" },
                  { type: "HD" as GenType,       icon: "✨", label: "HD Realistic", desc: "AI photorealistic · 1 HD credit", colour: "#8b5cf6" },
                ] as const).map(({ type, icon, label, desc, colour }) => (
                  <button key={type} onClick={() => setGenType(type)} style={{
                    padding: "14px", borderRadius: "12px", textAlign: "left", cursor: "pointer",
                    border: genType === type ? `1.5px solid ${colour}` : "1.5px solid #1e293b",
                    background: genType === type ? `${colour}14` : "#0d1424",
                  }}>
                    <div style={{ fontSize: "22px", marginBottom: "4px" }}>{icon}</div>
                    <div style={{ fontWeight: 700, color: genType === type ? colour : "#94a3b8", fontSize: "14px" }}>{label}</div>
                    <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>{desc}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Prompt — HD only */}
            {genType === "HD" && (
              <Card title="4. Describe the result (optional)">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`e.g. "Dusty rose velvet with a soft matte finish" or "Deep forest green, glossy lacquer paint"`}
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: "72px",
                    lineHeight: "1.6",
                    fontFamily: "inherit",
                  }}
                />
                <p style={{ fontSize: "11px", color: "#334155", marginTop: "6px" }}>
                  The AI uses this alongside the hex colour. Leave blank to use the colour alone.
                </p>
              </Card>
            )}

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result} alt="Generated result" style={{ width: "100%", borderRadius: "10px", display: "block" }} />
                  <a
                    href={result} download="recoloured.jpg" target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", marginTop: "12px", padding: "12px", borderRadius: "10px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontWeight: 700, fontSize: "14px", textAlign: "center" }}
                  >
                    ⬇ Download image
                  </a>
                  <button
                    onClick={() => { setResult(null); setError(null); }}
                    style={{ marginTop: "8px", width: "100%", padding: "10px", borderRadius: "10px", background: "transparent", border: "1px solid #1e293b", color: "#64748b", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
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

            {/* Tips */}
            <div style={{ marginTop: "14px", padding: "14px 16px", borderRadius: "12px", background: "#0d1424", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>💡 Tips</p>
              <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: "12px", color: "#334155", lineHeight: 1.8 }}>
                <li>Use <strong style={{ color: "#64748b" }}>Paint selection</strong> to recolour only part of the image</li>
                <li>HD mode works best with a descriptive prompt</li>
                <li>Upload a fabric swatch for exact colour matching</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 680px) {
          .gen-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: "14px", background: "#0d1424", border: "1px solid rgba(139,92,246,0.12)", padding: "18px" }}>
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
