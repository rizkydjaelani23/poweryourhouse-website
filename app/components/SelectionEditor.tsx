"use client";
import { useRef, useEffect, useState, useCallback, MutableRefObject } from "react";

type Tool = "outline" | "brush";
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

const CANVAS_W = 860;
const CANVAS_H = 520;
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
  const isPainting = useRef(false);
  const isPanning  = useRef(false);
  const lastMouse  = useRef<Pt>({ x: 0, y: 0 });
  const rafId      = useRef(0);

  // History for undo
  const historyRef = useRef<Snap[]>([]);

  // React state — only for UI labels / button enables
  const [tool,        setTool]       = useState<Tool>("outline");
  const toolRef                      = useRef<Tool>("outline");
  const [brushSz,     setBrushSz]    = useState(24);
  const brushSzRef                   = useRef(24);
  const [zoomPct,     setZoomPct]    = useState(100);
  const [ptCount,     setPtCount]    = useState(0);
  const [_closed,     _setClosed]    = useState(false);
  const [_hasMask,    _setHasMask]   = useState(false);
  const [historyLen,  setHistoryLen] = useState(0);
  const [regionCount, setRegionCount] = useState(0); // how many outlines have been committed

  function changeTool(t: Tool) { toolRef.current = t; setTool(t); }
  function changeBrush(n: number) { brushSzRef.current = n; setBrushSz(n); }

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.setTransform(scale, 0, 0, scale, tx, ty);

      // Image
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

      // Mask overlay (purple tint)
      if (hasMaskRef.current) {
        ctx.globalAlpha = 0.45;
        ctx.drawImage(mask, 0, 0, img.naturalWidth, img.naturalHeight);
        ctx.globalAlpha = 1;
      }

      // Outline preview
      const pts = pointsRef.current;
      if (pts.length > 0) {
        const lw = 2 / scale;
        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth   = lw;
        ctx.setLineDash([6 / scale, 4 / scale]);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        if (!closedRef.current && cursorRef.current) {
          ctx.lineTo(cursorRef.current.x, cursorRef.current.y);
        }
        if (closedRef.current) ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);

        // Control points
        pts.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, (i === 0 ? 7 : 4) / scale, 0, Math.PI * 2);
          ctx.fillStyle   = i === 0 ? "#a78bfa" : "#fff";
          ctx.strokeStyle = "#a78bfa";
          ctx.lineWidth   = 1.5 / scale;
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

    // Restore mask canvas
    const mask = maskRef.current;
    if (mask && mask.width > 0) {
      const ctx = mask.getContext("2d")!;
      ctx.clearRect(0, 0, mask.width, mask.height);
      if (prev.maskData) ctx.putImageData(prev.maskData, 0, 0);
    }

    // Restore outline state
    pointsRef.current = prev.pts;
    closedRef.current = prev.closed;
    cursorRef.current = null;

    // Sync reactive state
    hasMaskRef.current = prev.hasMask;
    _setHasMask(prev.hasMask);
    onMaskChange(prev.hasMask);
    setPtCount(prev.pts.length);
    _setClosed(prev.closed);

    render();
  }

  // Stable ref so the keydown effect never goes stale
  const undoRef = useRef(undo);
  useEffect(() => { undoRef.current = undo; });

  // Ctrl/Cmd + Z global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undoRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
      // Reset all state
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
    saveSnap(); // save state before filling

    // Fill this polygon into the mask canvas
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

    // ── KEY CHANGE: reset outline so a new one can be drawn immediately ──
    // The filled region stays on the mask; we just clear the in-progress points.
    pointsRef.current = [];
    cursorRef.current = null;
    closedRef.current = false;   // allow new outline clicks
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
  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    const cp = canvasPos(e);
    lastMouse.current = cp;

    if (e.altKey || e.button === 1) { isPanning.current = true; return; }

    if (toolRef.current === "brush") {
      saveSnap(); // one undo step per stroke
      isPainting.current = true;
      paintBrush(cp);
      return;
    }

    // Outline tool
    if (closedRef.current) return;
    const ip = c2i(cp.x, cp.y);
    // Click near first point → close
    if (pointsRef.current.length >= 3) {
      const fp = i2c(pointsRef.current[0].x, pointsRef.current[0].y);
      if (Math.hypot(cp.x - fp.x, cp.y - fp.y) < 16) {
        closeOutline();
        return;
      }
    }
    saveSnap(); // one undo step per point added
    pointsRef.current = [...pointsRef.current, ip];
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
      render(); return;
    }
    if (toolRef.current === "brush" && isPainting.current) { paintBrush(cp); }
    if (toolRef.current === "outline" && !closedRef.current) {
      cursorRef.current = c2i(cp.x, cp.y);
      render();
    }
    lastMouse.current = cp;
  }

  function onMouseUp()    { isPainting.current = false; isPanning.current = false; }
  function onMouseLeave() { isPainting.current = false; isPanning.current = false; }

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

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", alignItems: "center", flexWrap: "wrap" }}>

        {/* Tool tabs */}
        {(["outline", "brush"] as Tool[]).map((t) => (
          <button key={t} onClick={() => changeTool(t)} style={{
            padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
            border: tool === t ? "1px solid #8b5cf6" : "1px solid #1e293b",
            background: tool === t ? "rgba(139,92,246,0.15)" : "#111827",
            color: tool === t ? "#a78bfa" : "#64748b", cursor: "pointer",
          }}>
            {t === "outline" ? "⬡ Outline" : "🖌️ Brush"}
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
            {ptCount === 0 && regionCount  >  0 && "Region added — draw another outline or switch to brush"}
            {ptCount === 1 && "Click to add more points"}
            {ptCount === 2 && "Keep adding points…"}
            {ptCount >= 3  && "Click ● first point or double-click to close"}
          </span>
        )}
        {/* Region counter badge */}
        {regionCount > 0 && ptCount === 0 && (
          <span style={{
            fontSize: "11px", fontWeight: 700, color: "#22c55e",
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "6px", padding: "2px 8px",
          }}>
            {regionCount} region{regionCount > 1 ? "s" : ""} selected
          </span>
        )}

        {/* Zoom + Undo on the right */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "4px", alignItems: "center" }}>
          {/* Undo */}
          <button
            onClick={undo}
            disabled={historyLen === 0}
            title="Undo (Ctrl+Z)"
            style={{
              ...zBtn,
              fontSize: "13px",
              opacity: historyLen === 0 ? 0.3 : 1,
              cursor: historyLen === 0 ? "not-allowed" : "pointer",
              padding: "0 8px", width: "auto",
            }}
          >
            ↩ Undo
          </button>

          <div style={{ width: "1px", height: "18px", background: "#1e293b", margin: "0 2px" }} />

          {/* Zoom controls */}
          <button onClick={() => applyZoom(1.25)} style={zBtn} title="Zoom in">＋</button>
          <span style={{ fontSize: "11px", color: "#475569", minWidth: "38px", textAlign: "center" }}>
            {zoomPct}%
          </span>
          <button onClick={() => applyZoom(1 / 1.25)} style={zBtn} title="Zoom out">－</button>
          {zoomPct !== 100 && (
            <button onClick={resetZoom} style={{ ...zBtn, padding: "3px 8px", fontSize: "10px", width: "auto" }}>Fit</button>
          )}

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

      {/* ── Canvas ── */}
      <div style={{
        position: "relative", borderRadius: "12px", overflow: "hidden",
        background: "#060c19", border: "1px solid rgba(139,92,246,0.15)",
      }}>
        <canvas
          ref={displayRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", width: "100%", cursor: isPanning.current ? "grabbing" : "crosshair", userSelect: "none", touchAction: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onDoubleClick={onDoubleClick}
        />
        <canvas ref={maskRef} style={{ display: "none" }} />
      </div>

      <p style={{ fontSize: "11px", color: "#334155", marginTop: "6px", lineHeight: 1.6 }}>
        {tool === "outline"
          ? "Click to place points · click ● first point or double-click to close · close one outline to start another"
          : "Click & drag to paint the area"}
        {" "}&middot; Scroll to zoom &middot; Alt+drag to pan &middot; Ctrl+Z to undo
      </p>
    </div>
  );
}

const zBtn: React.CSSProperties = {
  width: "26px", height: "26px", borderRadius: "6px",
  border: "1px solid #1e293b", background: "#111827",
  color: "#94a3b8", cursor: "pointer", fontSize: "15px",
  fontWeight: 700, padding: 0, lineHeight: "26px", textAlign: "center",
};
