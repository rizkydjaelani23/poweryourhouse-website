"use client";
import { useRef, useEffect, useState, useCallback, MutableRefObject } from "react";

type Tool = "outline" | "brush" | "pan";
interface Pt { x: number; y: number }

interface Snap {
  maskData: ImageData | null;
  pts:      Pt[];
  closed:   boolean;
  hasMask:  boolean;
}

export interface SelectionEditorHandle {
  getMask(): Promise<Blob | null>;
  hasMask(): boolean;
  clear(): void;
}

interface Props {
  imageSrc:     string;
  handleRef:    MutableRefObject<SelectionEditorHandle | null>;
  onMaskChange: (has: boolean) => void;
}

const CANVAS_W   = 860;
const CANVAS_H   = 520;
const MAX_HISTORY = 30;

export default function SelectionEditor({ imageSrc, handleRef, onMaskChange }: Props) {
  const displayRef = useRef<HTMLCanvasElement>(null);
  const maskRef    = useRef<HTMLCanvasElement>(null);
  const imgRef     = useRef<HTMLImageElement | null>(null);

  // View transform: canvas_xy = image_xy * scale + (tx, ty)
  const vt = useRef({ scale: 1, tx: 0, ty: 0 });

  // Outline state in refs — no stale closures in event handlers
  const pointsRef  = useRef<Pt[]>([]);
  const cursorRef  = useRef<Pt | null>(null);
  const closedRef  = useRef(false);
  const hasMaskRef = useRef(false);

  // Interaction flags
  const isPainting    = useRef(false);
  const isPanning     = useRef(false);
  const isSpaceDown   = useRef(false);
  const lastMouse     = useRef<Pt>({ x: 0, y: 0 });
  const rafId         = useRef(0);
  // Prevents snap-to-close from activating immediately after an undo when the
  // cursor is already sitting near the first point.  Cleared once the cursor
  // moves far enough away from the origin so a deliberate approach still snaps.
  const snapSuppressed = useRef(false);

  // History for undo
  const historyRef = useRef<Snap[]>([]);

  // React state — only for UI labels / button enables
  const [tool,         setTool]        = useState<Tool>("outline");
  const toolRef                        = useRef<Tool>("outline");
  const [brushSz,      setBrushSz]     = useState(24);
  const brushSzRef                     = useRef(24);
  const [zoomPct,      setZoomPct]     = useState(100);
  const [ptCount,      setPtCount]     = useState(0);
  const [_closed,      _setClosed]     = useState(false);
  const [_hasMask,     _setHasMask]    = useState(false);
  const [historyLen,   setHistoryLen]  = useState(0);
  const [regionCount,  setRegionCount] = useState(0);
  const [expanded,     setExpanded]    = useState(false);

  function changeTool(t: Tool) { toolRef.current = t; setTool(t); updateCursor(); }
  function changeBrush(n: number) { brushSzRef.current = n; setBrushSz(n); }

  // ── cursor helper ─────────────────────────────────────────────────────────
  function updateCursor(panning = false) {
    const el = displayRef.current;
    if (!el) return;
    if (panning || isPanning.current)      { el.style.cursor = "grabbing"; return; }
    if (isSpaceDown.current || toolRef.current === "pan") { el.style.cursor = "grab"; return; }
    el.style.cursor = "crosshair";
  }

  // ── transform helpers ─────────────────────────────────────────────────────
  const i2c = (ix: number, iy: number) => ({
    x: ix * vt.current.scale + vt.current.tx,
    y: iy * vt.current.scale + vt.current.ty,
  });
  const c2i = (cx: number, cy: number) => ({
    x: (cx - vt.current.tx) / vt.current.scale,
    y: (cy - vt.current.ty) / vt.current.scale,
  });

  // ── fit image to canvas ───────────────────────────────────────────────────
  function fitTransform() {
    const canvas = displayRef.current!;
    const img    = imgRef.current!;
    const s = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    vt.current = {
      scale: s,
      tx:    (canvas.width  - img.naturalWidth  * s) / 2,
      ty:    (canvas.height - img.naturalHeight * s) / 2,
    };
    return s;
  }

  // ── render ────────────────────────────────────────────────────────────────
  const render = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const canvas = displayRef.current;
      const mask   = maskRef.current;
      const img    = imgRef.current;
      if (!canvas || !mask || !img) return;

      const ctx = canvas.getContext("2d")!;
      const { scale, tx, ty } = vt.current;

      // cssScale: how many CSS pixels each canvas pixel occupies.
      // Accounts for the canvas being displayed larger when expanded —
      // without this, dots and lines look oversized in expanded mode.
      const rect     = canvas.getBoundingClientRect();
      const cssScale = rect.width > 0 ? rect.width / canvas.width : 1;
      // Combined scale for sizing overlay elements to a consistent physical size
      const dispScale = scale * cssScale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.setTransform(scale, 0, 0, scale, tx, ty);

      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

      if (hasMaskRef.current) {
        ctx.globalAlpha = 0.45;
        ctx.drawImage(mask, 0, 0, img.naturalWidth, img.naturalHeight);
        ctx.globalAlpha = 1;
      }

      const pts = pointsRef.current;
      if (pts.length > 0) {
        const lw = 2 / dispScale;
        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth   = lw;
        ctx.setLineDash([6 / dispScale, 4 / dispScale]);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        // Snap preview: only show closing line when cursor is near the first point,
        // at least 15 points have been placed, and snap hasn't been suppressed by
        // a recent undo (cleared once cursor moves 32+ canvas-px from origin).
        const snapRadius = 16 / dispScale;
        const isNearOrigin = !closedRef.current &&
          !snapSuppressed.current &&
          pts.length >= 15 &&
          cursorRef.current != null &&
          Math.hypot(cursorRef.current.x - pts[0].x, cursorRef.current.y - pts[0].y) < snapRadius;

        if (closedRef.current) {
          ctx.closePath();
        } else if (isNearOrigin) {
          // Draw snap preview back to first point
          ctx.lineTo(pts[0].x, pts[0].y);
        }
        // else: open path only — no rubber-band line to cursor
        ctx.stroke();
        ctx.setLineDash([]);

        pts.forEach((p, i) => {
          // Dot radius is a fixed physical size regardless of zoom or expand state
          const baseR = (i === 0 ? 5 : 3);
          const r     = baseR / Math.max(dispScale, 0.4);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          // First dot turns green when snap is active
          const snapActive = i === 0 && isNearOrigin;
          ctx.fillStyle   = snapActive ? "#22c55e" : (i === 0 ? "#a78bfa" : "#fff");
          ctx.strokeStyle = snapActive ? "#22c55e" : "#a78bfa";
          ctx.lineWidth   = 1 / dispScale;
          ctx.fill();
          ctx.stroke();
        });
      }

      ctx.restore();
    });
  }, []);

  // ── history helpers ───────────────────────────────────────────────────────
  function saveSnap() {
    const mask = maskRef.current;
    let maskData: ImageData | null = null;
    if (mask && mask.width > 0 && mask.height > 0 && hasMaskRef.current) {
      maskData = mask.getContext("2d")!.getImageData(0, 0, mask.width, mask.height);
    }
    const snap: Snap = {
      maskData,
      pts:     [...pointsRef.current],
      closed:  closedRef.current,
      hasMask: hasMaskRef.current,
    };
    const next = [...historyRef.current.slice(-(MAX_HISTORY - 1)), snap];
    historyRef.current = next;
    setHistoryLen(next.length);
  }

  function undo() {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    const next = historyRef.current.slice(0, -1);
    historyRef.current = next;
    setHistoryLen(next.length);

    const mask = maskRef.current;
    if (mask && mask.width > 0) {
      const ctx = mask.getContext("2d")!;
      ctx.clearRect(0, 0, mask.width, mask.height);
      if (prev.maskData) ctx.putImageData(prev.maskData, 0, 0);
    }

    pointsRef.current = prev.pts;
    closedRef.current = prev.closed;
    cursorRef.current = null;
    snapSuppressed.current = true; // don't snap until cursor moves away from origin

    hasMaskRef.current = prev.hasMask;
    _setHasMask(prev.hasMask);
    onMaskChange(prev.hasMask);
    setPtCount(prev.pts.length);
    _setClosed(prev.closed);

    render();
  }

  const undoRef = useRef(undo);
  useEffect(() => { undoRef.current = undo; });

  // ── keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      // Never intercept keyboard shortcuts when the user is typing in an input field
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;

      // Ctrl/Cmd+Z → undo (canvas only)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !isTyping) {
        e.preventDefault();
        undoRef.current();
        return;
      }
      // Escape → collapse expanded
      if (e.key === "Escape") {
        setExpanded(false);
        return;
      }
      // Spacebar → temporary pan (canvas only — don't steal space from text inputs)
      if (e.code === "Space" && !e.repeat && !isTyping) {
        e.preventDefault();
        isSpaceDown.current = true;
        const el = displayRef.current;
        if (el && !isPanning.current) el.style.cursor = "grab";
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpaceDown.current = false;
        isPanning.current   = false;
        updateCursor();
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, []); // eslint-disable-line

  // ── load image ────────────────────────────────────────────────────────────
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      const mask = maskRef.current!;
      mask.width  = img.naturalWidth;
      mask.height = img.naturalHeight;
      mask.getContext("2d")!.clearRect(0, 0, mask.width, mask.height);
      fitTransform();
      setZoomPct(100);
      pointsRef.current  = [];
      cursorRef.current  = null;
      closedRef.current  = false;
      hasMaskRef.current = false;
      historyRef.current = [];
      setPtCount(0); _setClosed(false); _setHasMask(false);
      setHistoryLen(0); setRegionCount(0);
      onMaskChange(false);
      render();
    };
    img.src = imageSrc;
  }, [imageSrc, render, onMaskChange]);

  // ── wheel zoom ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = displayRef.current;
    if (!canvas) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const img = imgRef.current;
      if (!img) return;
      const rect   = canvas.getBoundingClientRect();
      const cx = (e.clientX - rect.left) * (canvas.width  / rect.width);
      const cy = (e.clientY - rect.top)  * (canvas.height / rect.height);
      const factor   = e.deltaY < 0 ? 1.14 : 1 / 1.14;
      const fitS     = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const newScale = Math.max(fitS * 0.95, Math.min(fitS * 12, vt.current.scale * factor));
      const ix = (cx - vt.current.tx) / vt.current.scale;
      const iy = (cy - vt.current.ty) / vt.current.scale;
      vt.current = { scale: newScale, tx: cx - ix * newScale, ty: cy - iy * newScale };
      setZoomPct(Math.round(newScale / fitS * 100));
      render();
    };
    canvas.addEventListener("wheel", handler, { passive: false });
    return () => canvas.removeEventListener("wheel", handler);
  }, [render]);

  // re-attach wheel listener when expanded changes (new canvas mount)
  useEffect(() => { /* wheel handler re-runs automatically via the deps above */ }, [expanded]);

  // ── zoom buttons ──────────────────────────────────────────────────────────
  function applyZoom(factor: number) {
    const canvas = displayRef.current!;
    const img    = imgRef.current;
    if (!img) return;
    const fitS     = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const cx       = canvas.width  / 2;
    const cy       = canvas.height / 2;
    const newScale = Math.max(fitS * 0.95, Math.min(fitS * 12, vt.current.scale * factor));
    const ix = (cx - vt.current.tx) / vt.current.scale;
    const iy = (cy - vt.current.ty) / vt.current.scale;
    vt.current = { scale: newScale, tx: cx - ix * newScale, ty: cy - iy * newScale };
    setZoomPct(Math.round(newScale / fitS * 100));
    render();
  }
  function resetZoom() {
    const img = imgRef.current;
    if (!img) return;
    const s    = fitTransform();
    const fitS = Math.min(displayRef.current!.width / img.naturalWidth, displayRef.current!.height / img.naturalHeight);
    setZoomPct(Math.round(s / fitS * 100));
    render();
  }

  // ── canvas coords from event ──────────────────────────────────────────────
  function canvasPos(e: React.MouseEvent | MouseEvent): Pt {
    const canvas = displayRef.current!;
    const rect   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    };
  }

  // ── paint brush on mask canvas ────────────────────────────────────────────
  function paintBrush(cp: Pt) {
    const mask = maskRef.current;
    if (!mask) return;
    const ip  = c2i(cp.x, cp.y);
    const ctx = mask.getContext("2d")!;
    const r   = brushSzRef.current / vt.current.scale;
    ctx.beginPath();
    ctx.arc(ip.x, ip.y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    if (!hasMaskRef.current) {
      hasMaskRef.current = true;
      _setHasMask(true);
      onMaskChange(true);
    }
    render();
  }

  // ── close outline polygon ─────────────────────────────────────────────────
  function closeOutline() {
    const pts  = pointsRef.current;
    const mask = maskRef.current;
    if (pts.length < 3 || !mask) return;
    saveSnap();

    const ctx = mask.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();

    hasMaskRef.current = true;
    _setHasMask(true);
    onMaskChange(true);

    // Reset so the next outline can start immediately
    pointsRef.current = [];
    cursorRef.current = null;
    closedRef.current = false;
    _setClosed(false);
    setPtCount(0);
    setRegionCount(prev => prev + 1);
    render();
  }

  // ── clear all ─────────────────────────────────────────────────────────────
  function clearAll() {
    const mask = maskRef.current;
    if (mask) mask.getContext("2d")!.clearRect(0, 0, mask.width, mask.height);
    pointsRef.current  = [];
    cursorRef.current  = null;
    closedRef.current  = false;
    hasMaskRef.current = false;
    historyRef.current = [];
    setPtCount(0); _setClosed(false); _setHasMask(false);
    setHistoryLen(0); setRegionCount(0);
    onMaskChange(false);
    render();
  }

  // ── mouse handlers ────────────────────────────────────────────────────────
  function startPan(cp: Pt) {
    isPanning.current  = true;
    lastMouse.current  = cp;
    updateCursor(true);
  }

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    const cp = canvasPos(e);
    lastMouse.current = cp;

    // Right-click, middle-click, spacebar held, or Pan tool → pan
    if (e.button === 1 || e.button === 2 || e.altKey || isSpaceDown.current || toolRef.current === "pan") {
      startPan(cp);
      return;
    }

    if (toolRef.current === "brush") {
      saveSnap();
      isPainting.current = true;
      paintBrush(cp);
      return;
    }

    // Outline tool
    if (closedRef.current) return;
    const ip = c2i(cp.x, cp.y);
    if (pointsRef.current.length >= 15) {
      const fp = i2c(pointsRef.current[0].x, pointsRef.current[0].y);
      if (Math.hypot(cp.x - fp.x, cp.y - fp.y) < 16) {
        closeOutline();
        return;
      }
    }
    saveSnap();
    pointsRef.current  = [...pointsRef.current, ip];
    snapSuppressed.current = false; // adding a point re-enables snap normally
    setPtCount(pointsRef.current.length);
    render();
  }

  function onMouseMove(e: React.MouseEvent) {
    const cp = canvasPos(e);

    if (isPanning.current) {
      const dx = cp.x - lastMouse.current.x;
      const dy = cp.y - lastMouse.current.y;
      vt.current = { ...vt.current, tx: vt.current.tx + dx, ty: vt.current.ty + dy };
      lastMouse.current = cp;
      render();
      return;
    }

    if (toolRef.current === "brush" && isPainting.current) { paintBrush(cp); }

    if (toolRef.current === "outline" && !closedRef.current) {
      cursorRef.current = c2i(cp.x, cp.y);

      // Lift snap suppression once cursor has moved well clear of the first dot
      if (snapSuppressed.current && pointsRef.current.length > 0) {
        const fp = i2c(pointsRef.current[0].x, pointsRef.current[0].y);
        if (Math.hypot(cp.x - fp.x, cp.y - fp.y) > 32) {
          snapSuppressed.current = false;
        }
      }

      render();
    }

    lastMouse.current = cp;
  }

  function onMouseUp() {
    isPainting.current = false;
    isPanning.current  = false;
    updateCursor();
  }
  function onMouseLeave() {
    isPainting.current = false;
    isPanning.current  = false;
    updateCursor();
  }

  function onDoubleClick() {
    if (toolRef.current === "outline" && pointsRef.current.length >= 3 && !closedRef.current) {
      closeOutline();
    }
  }

  // ── expose handle ─────────────────────────────────────────────────────────
  useEffect(() => {
    handleRef.current = {
      getMask: () => new Promise((res) => {
        const mask = maskRef.current;
        if (!mask || !hasMaskRef.current) { res(null); return; }
        mask.toBlob((b) => res(b), "image/png");
      }),
      hasMask: () => hasMaskRef.current,
      clear:   clearAll,
    };
  });

  // ── shared toolbar + canvas (used in both normal and expanded view) ────────
  const toolbar = (
    <div style={{ display: "flex", gap: "6px", marginBottom: "10px", alignItems: "center", flexWrap: "wrap" }}>

      {/* Tool tabs */}
      {(["outline", "brush", "pan"] as Tool[]).map((t) => (
        <button key={t} onClick={() => changeTool(t)} title={t === "pan" ? "Pan / drag canvas (or hold Space)" : undefined} style={{
          padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
          border: tool === t ? "1px solid #8b5cf6" : "1px solid #1e293b",
          background: tool === t ? "rgba(139,92,246,0.15)" : "#111827",
          color: tool === t ? "#a78bfa" : "#64748b", cursor: "pointer",
        }}>
          {t === "outline" ? "Outline" : t === "brush" ? "Brush" : "Pan"}
        </button>
      ))}

      {/* Brush size */}
      {tool === "brush" && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: "#475569" }}>Size</span>
          <input type="range" min={4} max={80} value={brushSz}
            onChange={(e) => changeBrush(Number(e.target.value))}
            style={{ width: "64px" }} />
          <span style={{ fontSize: "11px", color: "#475569" }}>{brushSz}px</span>
        </div>
      )}

      {/* Outline status hint */}
      {tool === "outline" && (
        <span style={{ fontSize: "11px", color: "#64748b" }}>
          {ptCount === 0 && regionCount === 0 && "Click to start outline"}
          {ptCount === 0 && regionCount  >  0 && "Region added — draw another outline"}
          {ptCount === 1 && "Click to add more points"}
          {ptCount === 2 && "Keep adding points…"}
          {ptCount >= 3  && ptCount < 15 && "Keep adding points · click Finish when done"}
          {ptCount >= 15 && "Move near ● start to snap-close · or click Finish"}
        </span>
      )}

      {/* Finish Outline button — shown once 3+ points placed */}
      {tool === "outline" && ptCount >= 3 && (
        <button
          onClick={closeOutline}
          style={{
            padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
            border: "1px solid rgba(139,92,246,0.5)",
            background: "rgba(139,92,246,0.18)",
            color: "#a78bfa", cursor: "pointer",
          }}
        >
          ✓ Finish Outline
        </button>
      )}
      {tool === "pan" && (
        <span style={{ fontSize: "11px", color: "#64748b" }}>Click and drag to move around the image</span>
      )}

      {/* Region counter */}
      {regionCount > 0 && ptCount === 0 && (
        <span style={{
          fontSize: "11px", fontWeight: 700, color: "#22c55e",
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "6px", padding: "2px 8px",
        }}>
          {regionCount} region{regionCount > 1 ? "s" : ""} selected
        </span>
      )}

      {/* Right-side controls */}
      <div style={{ marginLeft: "auto", display: "flex", gap: "4px", alignItems: "center" }}>

        {/* Undo */}
        <button onClick={undo} disabled={historyLen === 0} title="Undo (Ctrl+Z)" style={{
          ...zBtn, fontSize: "13px",
          opacity: historyLen === 0 ? 0.3 : 1,
          cursor: historyLen === 0 ? "not-allowed" : "pointer",
          padding: "0 8px", width: "auto",
        }}>
          ↩ Undo
        </button>

        <div style={{ width: "1px", height: "18px", background: "#1e293b", margin: "0 2px" }} />

        {/* Zoom */}
        <button onClick={() => applyZoom(1.25)} style={zBtn} title="Zoom in">＋</button>
        <span style={{ fontSize: "11px", color: "#475569", minWidth: "38px", textAlign: "center" }}>{zoomPct}%</span>
        <button onClick={() => applyZoom(1 / 1.25)} style={zBtn} title="Zoom out">－</button>
        {zoomPct !== 100 && (
          <button onClick={resetZoom} style={{ ...zBtn, padding: "5px 14px", fontSize: "12px", fontWeight: 700, width: "auto", background: "#1e3a5f", color: "#60a5fa", borderRadius: "7px", border: "1px solid rgba(96,165,250,0.25)" }}>↺ Reset Image</button>
        )}

        <div style={{ width: "1px", height: "18px", background: "#1e293b", margin: "0 2px" }} />

        {/* Expand / collapse */}
        <button
          onClick={() => setExpanded(v => !v)}
          title={expanded ? "Collapse (Esc)" : "Expand to full screen"}
          style={{ ...zBtn, width: "auto", padding: "0 10px", fontSize: "12px", fontWeight: 700 }}
        >
          {expanded ? "⤡ Collapse" : "⤢ Expand"}
        </button>

        {/* Clear */}
        {_hasMask && (
          <>
            <div style={{ width: "1px", height: "18px", background: "#1e293b", margin: "0 2px" }} />
            <button onClick={clearAll} style={{
              padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
              border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)",
              color: "#ef4444", cursor: "pointer", height: "26px",
            }}>
              ✕ Clear
            </button>
          </>
        )}
      </div>
    </div>
  );

  const canvasEl = (
    <canvas
      ref={displayRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        display: "block",
        width:   "100%",
        height:  expanded ? "100%" : undefined,
        userSelect: "none",
        touchAction: "none",
        cursor: "crosshair",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
      onContextMenu={(e) => e.preventDefault()} // right-click → pan, not menu
    />
  );

  const hint = (
    <p style={{ fontSize: "11px", color: "#334155", marginTop: "6px", lineHeight: 1.6 }}>
      {tool === "outline"
        ? "Click to place points · click Finish Outline or snap to ● start (15+ pts) to close · draw another outline to add more regions"
        : tool === "brush"
        ? "Click & drag to paint the area"
        : "Click & drag to move the image"}
      {" "}· Scroll to zoom · Right-click or Space+drag to pan · Ctrl+Z to undo
    </p>
  );

  // ── Expanded (fullscreen overlay) ─────────────────────────────────────────
  if (expanded) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "#040912",
        display: "flex", flexDirection: "column",
        padding: "16px", gap: "10px",
      }}>
        {toolbar}
        <div style={{
          flex: 1, borderRadius: "12px", overflow: "hidden",
          background: "#060c19", border: "1px solid rgba(139,92,246,0.15)",
          display: "flex", alignItems: "stretch",
        }}>
          {canvasEl}
          <canvas ref={maskRef} style={{ display: "none" }} />
        </div>
        {hint}
      </div>
    );
  }

  // ── Normal (inline) ───────────────────────────────────────────────────────
  return (
    <div>
      {toolbar}
      <div style={{
        position: "relative", borderRadius: "12px", overflow: "hidden",
        background: "#060c19", border: "1px solid rgba(139,92,246,0.15)",
      }}>
        {canvasEl}
        <canvas ref={maskRef} style={{ display: "none" }} />
      </div>
      {hint}
    </div>
  );
}

const zBtn: React.CSSProperties = {
  width: "26px", height: "26px", borderRadius: "6px",
  border: "1px solid #1e293b", background: "#111827",
  color: "#94a3b8", cursor: "pointer", fontSize: "15px",
  fontWeight: 700, padding: 0, lineHeight: "26px", textAlign: "center",
};
