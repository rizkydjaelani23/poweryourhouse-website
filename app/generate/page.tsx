"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import SelectionEditor, { SelectionEditorHandle } from "../components/SelectionEditor";

type GenType = "STANDARD" | "HD";

const GUEST_LIMIT = 2;

export default function GeneratePage() {
  // ── Image / colour state ──────────────────────────────────────────────────
  const [imageFile,     setImageFile]     = useState<File | null>(null);
  const [imagePreview,  setImagePreview]  = useState<string | null>(null);
  const [swatchFile,    setSwatchFile]    = useState<File | null>(null);
  const [swatchPreview, setSwatchPreview] = useState<string | null>(null);
  const [colourHex,     setColourHex]     = useState("#5b3a8b");
  const [colourName,    setColourName]    = useState("");
  const [colourMode,    setColourMode]    = useState<"picker" | "swatch">("picker");
  const [genType,       setGenType]       = useState<GenType>("STANDARD");
  const [prompt,        setPrompt]        = useState("");

  // ── Generation state ──────────────────────────────────────────────────────
  const [loading,             setLoading]             = useState(false);
  const [result,              setResult]              = useState<string | null>(null);
  const [error,               setError]               = useState<string | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [hasMask,             setHasMask]             = useState(false);

  // ── Auth / credits (logged-in users) ─────────────────────────────────────
  const [credits,        setCredits]        = useState<{ standard: number; hd: number } | null>(null);
  const [lastCreditUsed, setLastCreditUsed] = useState(false);

  // ── Guest state (not logged in) ───────────────────────────────────────────
  const [isGuest,          setIsGuest]          = useState(false);
  const [guestToken,       setGuestToken]       = useState<string | null>(null);
  const [guestUsed,        setGuestUsed]        = useState(0);
  const [guestLimitReached, setGuestLimitReached] = useState(false);

  const selectionRef = useRef<SelectionEditorHandle | null>(null);
  const resultRef    = useRef<HTMLDivElement>(null);

  // ── On mount: detect auth + init guest if needed ──────────────────────────
  useEffect(() => {
    fetch("/api/credits").then(async (res) => {
      if (res.ok) {
        const d = await res.json();
        setCredits(d);
      } else if (res.status === 401) {
        // Not logged in — set up guest mode
        setIsGuest(true);
        let token = localStorage.getItem("pyh_guest_token");
        if (!token) {
          token =
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          localStorage.setItem("pyh_guest_token", token);
        }
        setGuestToken(token);
        const used = parseInt(localStorage.getItem("pyh_guest_used") ?? "0", 10);
        setGuestUsed(used);
        if (used >= GUEST_LIMIT) setGuestLimitReached(true);
      }
    }).catch(() => {});
  }, []);

  async function fetchCredits() {
    const res = await fetch("/api/credits");
    if (res.ok) {
      const d = await res.json();
      setCredits(d);
    }
  }

  // ── Image upload ──────────────────────────────────────────────────────────
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

  // ── Generate ──────────────────────────────────────────────────────────────
  async function generate() {
    if (!imageFile) { setError("Upload an image first."); return; }
    if (isGuest && guestLimitReached) {
      setError("You've used your 2 free generations. Sign up free to get 5 more!");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);
    setInsufficientCredits(false);
    setLastCreditUsed(false);

    // Detect last-use scenarios before spending
    const isLastAuthCredit =
      !isGuest && (
        (genType === "STANDARD" && (credits?.standard ?? 2) === 1) ||
        (genType === "HD"       && (credits?.hd       ?? 2) === 1)
      );

    const form = new FormData();
    form.append("imageFile",  imageFile);
    form.append("type",       genType);
    form.append("colourHex",  colourHex);
    form.append("colourName", colourName);
    if (colourMode === "swatch" && swatchFile) form.append("swatchFile", swatchFile);
    if (genType === "HD" && prompt) form.append("prompt", prompt);

    const maskBlob = selectionRef.current ? await selectionRef.current.getMask() : null;
    if (maskBlob) form.append("maskFile", maskBlob, "mask.png");

    // Add guest token header when not logged in
    const headers: Record<string, string> = {};
    if (isGuest && guestToken) headers["x-guest-token"] = guestToken;

    try {
      const res  = await fetch("/api/generate", { method: "POST", body: form, headers });
      const data = await res.json();

      if (!res.ok) {
        if (data.insufficientCredits) setInsufficientCredits(true);
        if (data.guestLimitReached)   setGuestLimitReached(true);
        setError(data.error || "Generation failed");
        return;
      }

      setResult(data.outputUrl);

      // Update guest counter from server response
      if (isGuest && data.guestUsed !== undefined) {
        setGuestUsed(data.guestUsed);
        localStorage.setItem("pyh_guest_used", String(data.guestUsed));
        if (data.guestUsed >= GUEST_LIMIT) setGuestLimitReached(true);
      }

      if (isLastAuthCredit) setLastCreditUsed(true);
      if (!isGuest) fetchCredits();

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const creditsLow = !isGuest && credits !== null && (
    (genType === "STANDARD" && credits.standard <= 2) ||
    (genType === "HD" && credits.hd === 0)
  );

  const canGenerate = !loading && !!imageFile && (!isGuest || !guestLimitReached);
  const freeLeft    = Math.max(0, GUEST_LIMIT - guestUsed);

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: "920px" }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>
              ✨ AI Colour Remaker
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              Upload any product or room photo and recolour it instantly.
            </p>
          </div>

          {/* Auth user: credits pill */}
          {!isGuest && credits !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "8px 14px", borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: credits.standard === 0
                  ? "1px solid rgba(239,68,68,0.2)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, lineHeight: 1, color: credits.standard === 0 ? "#ef4444" : "#60a5fa" }}>
                    {credits.standard}
                  </div>
                  <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>⚡ Standard</div>
                </div>
                <div style={{ width: "1px", height: "28px", background: "#1e293b" }} />
                <div style={{ textAlign: "center" }}>
                  {credits.hd > 0 ? (
                    <>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#a78bfa", lineHeight: 1 }}>{credits.hd}</div>
                      <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>✨ HD</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", lineHeight: 1 }}>✨ HD</div>
                      <div style={{ fontSize: "10px", color: "#334155", marginTop: "3px" }}>not purchased</div>
                    </>
                  )}
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

          {/* Guest: free generation counter */}
          {isGuest && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div style={{
                padding: "8px 14px", borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: guestLimitReached
                  ? "1px solid rgba(239,68,68,0.25)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                  ⚡{" "}
                  <strong style={{ color: guestLimitReached ? "#ef4444" : "#60a5fa" }}>
                    {freeLeft}
                  </strong>
                  {" "}free {freeLeft === 1 ? "generation" : "generations"} left
                </span>
              </div>
              <Link href="/signup" style={{
                padding: "9px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 700,
                background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "#fff",
                whiteSpace: "nowrap",
              }}>
                Sign up free →
              </Link>
            </div>
          )}
        </div>

        {/* ── Guest welcome banner ── */}
        {isGuest && (
          <div style={{
            marginBottom: "20px", padding: "16px 20px", borderRadius: "12px",
            background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.18)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
          }}>
            <div>
              <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: "14px", marginBottom: "3px" }}>
                👋 Try it free — no account needed
              </div>
              <div style={{ color: "#475569", fontSize: "13px" }}>
                You get{" "}
                <strong style={{ color: "#94a3b8" }}>2 free standard colour changes</strong>.{" "}
                Sign up free for{" "}
                <strong style={{ color: "#94a3b8" }}>5 standard + 1 HD</strong> generation.
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <Link href="/signup" style={{
                padding: "9px 18px", borderRadius: "9px", fontSize: "13px", fontWeight: 700,
                background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "#fff",
              }}>
                Sign up free
              </Link>
              <Link href="/login" style={{
                padding: "9px 14px", borderRadius: "9px", fontSize: "13px", fontWeight: 600,
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b",
              }}>
                Sign in
              </Link>
            </div>
          </div>
        )}

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

          {/* ── Step 2: Selection editor ── */}
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

          {/* ── Steps 3 & 4: Colour + Quality ── */}
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
                {/* Standard — always available */}
                <button onClick={() => setGenType("STANDARD")} style={{
                  padding: "14px", borderRadius: "12px", textAlign: "left", cursor: "pointer",
                  border: genType === "STANDARD" ? "1.5px solid #3b82f6" : "1.5px solid #1e293b",
                  background: genType === "STANDARD" ? "rgba(59,130,246,0.1)" : "#0d1424",
                }}>
                  <div style={{ fontSize: "20px", marginBottom: "2px" }}>⚡</div>
                  <div style={{ fontWeight: 700, color: genType === "STANDARD" ? "#3b82f6" : "#94a3b8", fontSize: "14px" }}>Standard</div>
                  <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>Fast colour shift · 1 credit</div>
                </button>

                {/* HD — disabled for guests */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => { if (!isGuest) setGenType("HD"); }}
                    style={{
                      width: "100%", padding: "14px", borderRadius: "12px", textAlign: "left",
                      cursor: isGuest ? "default" : "pointer",
                      border: !isGuest && genType === "HD" ? "1.5px solid #8b5cf6" : "1.5px solid #1e293b",
                      background: !isGuest && genType === "HD" ? "rgba(139,92,246,0.1)" : "#0d1424",
                      opacity: isGuest ? 0.5 : 1,
                    }}
                  >
                    <div style={{ fontSize: "20px", marginBottom: "2px" }}>✨</div>
                    <div style={{ fontWeight: 700, color: !isGuest && genType === "HD" ? "#8b5cf6" : "#94a3b8", fontSize: "14px" }}>HD Realistic</div>
                    <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>AI photorealistic · 1 HD credit</div>
                  </button>
                  {isGuest && (
                    <Link href="/signup" style={{
                      position: "absolute", top: "10px", right: "10px",
                      padding: "3px 10px", borderRadius: "999px",
                      background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.35)",
                      fontSize: "10px", fontWeight: 700, color: "#a78bfa", whiteSpace: "nowrap",
                    }}>
                      Sign up free →
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* ── Step 5: Prompt (HD only, auth users) ── */}
          {genType === "HD" && !isGuest && (
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

          {/* ── Zero-credits warning (auth users out of credits) ── */}
          {!isGuest && credits !== null && !loading && (() => {
            const outOfStandard = genType === "STANDARD" && credits.standard === 0;
            const outOfHd      = genType === "HD"       && credits.hd === 0;
            if (!outOfStandard && !outOfHd) return null;
            return (
              <div style={{
                padding: "14px 16px", borderRadius: "12px",
                background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
              }}>
                <div>
                  <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>
                    {outOfHd ? "No HD credits" : "No standard credits left"}
                  </div>
                  <div style={{ color: "#78716c", fontSize: "12px" }}>
                    {outOfHd
                      ? "HD credits are purchased separately — standard credits won't be used for HD."
                      : "Top up to keep generating. Your work is still here when you come back."}
                  </div>
                </div>
                <Link href="/pricing" style={{
                  flexShrink: 0, padding: "9px 16px", borderRadius: "9px", fontSize: "13px",
                  fontWeight: 700, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", whiteSpace: "nowrap",
                }}>
                  Top up →
                </Link>
              </div>
            );
          })()}

          {/* ── Guest limit reached banner ── */}
          {isGuest && guestLimitReached && (
            <div style={{
              padding: "20px 22px", borderRadius: "12px",
              background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.22)",
            }}>
              <div style={{ color: "#60a5fa", fontWeight: 800, fontSize: "16px", marginBottom: "6px" }}>
                🎉 You&apos;ve used your 2 free generations!
              </div>
              <div style={{ color: "#475569", fontSize: "14px", marginBottom: "16px" }}>
                Create a free account in 10 seconds and get{" "}
                <strong style={{ color: "#94a3b8" }}>5 standard generations + 1 HD realistic image</strong> — no card required.
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link href="/signup" style={{
                  padding: "12px 24px", borderRadius: "10px", fontWeight: 700, fontSize: "14px",
                  background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "#fff",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                }}>
                  Create free account →
                </Link>
                <Link href="/login" style={{
                  padding: "12px 20px", borderRadius: "10px", fontWeight: 600, fontSize: "14px",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b",
                }}>
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          )}

          {/* ── Generate button ── */}
          <button
            onClick={generate}
            disabled={!canGenerate}
            style={{
              padding: "18px", borderRadius: "12px", fontWeight: 800, fontSize: "17px",
              border: "none", cursor: !canGenerate ? "not-allowed" : "pointer",
              background: !canGenerate
                ? "#1e293b"
                : genType === "HD"
                  ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                  : "linear-gradient(135deg, #3b82f6, #0ea5e9)",
              color: !canGenerate ? "#475569" : "#fff",
              transition: "all 0.15s",
              boxShadow: canGenerate
                ? (genType === "HD" ? "0 4px 24px rgba(124,58,237,0.35)" : "0 4px 24px rgba(59,130,246,0.35)")
                : "none",
            }}
          >
            {loading
              ? (genType === "HD" ? "⏳ Generating HD — 30 to 60 seconds…" : "⏳ Applying colour…")
              : isGuest
                ? `⚡ Try it free (${guestUsed}/${GUEST_LIMIT} used) →`
                : `${genType === "HD" ? "✨ HD Render" : "⚡ Generate"} →`}
          </button>

          {/* ── Error ── */}
          {error && !insufficientCredits && (
            <div style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "14px" }}>
              {error}
            </div>
          )}

          {/* ── Result ── */}
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
                  {!guestLimitReached && (
                    <button
                      onClick={() => { setResult(null); setError(null); setLastCreditUsed(false); }}
                      style={{ padding: "13px 20px", borderRadius: "10px", background: "transparent", border: "1px solid #1e293b", color: "#64748b", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                    >
                      Generate another
                    </button>
                  )}
                </div>

                {/* Auth user: last credit nudge */}
                {lastCreditUsed && (
                  <div style={{
                    marginTop: "12px", padding: "14px 16px", borderRadius: "10px",
                    background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                  }}>
                    <div>
                      <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "13px", marginBottom: "2px" }}>
                        That was your last credit 🎉
                      </div>
                      <div style={{ color: "#78716c", fontSize: "12px" }}>
                        Top up to keep going — your image is safe to download above.
                      </div>
                    </div>
                    <Link href="/pricing" style={{
                      flexShrink: 0, padding: "8px 14px", borderRadius: "8px", fontSize: "12px",
                      fontWeight: 700, background: "rgba(245,158,11,0.15)",
                      border: "1px solid rgba(245,158,11,0.3)", color: "#fbbf24",
                    }}>
                      Get more →
                    </Link>
                  </div>
                )}

                {/* Guest: sign-up prompt when limit hit */}
                {isGuest && guestLimitReached && (
                  <div style={{
                    marginTop: "12px", padding: "16px 18px", borderRadius: "10px",
                    background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)",
                  }}>
                    <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
                      🎉 That was your last free generation!
                    </div>
                    <div style={{ color: "#475569", fontSize: "13px", marginBottom: "12px" }}>
                      Sign up free — takes 10 seconds — and unlock{" "}
                      <strong style={{ color: "#94a3b8" }}>5 standard + 1 HD</strong> generation instantly.
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link href="/signup" style={{
                        padding: "10px 20px", borderRadius: "9px", fontWeight: 700, fontSize: "13px",
                        background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "#fff",
                      }}>
                        Create free account →
                      </Link>
                      <Link href="/login" style={{
                        padding: "10px 14px", borderRadius: "9px", fontWeight: 600, fontSize: "13px",
                        background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b",
                      }}>
                        Sign in
                      </Link>
                    </div>
                  </div>
                )}
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
