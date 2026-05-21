"use client";
import { useRef, useEffect, useState, useCallback, MutableRefObject } from "react";

type Tool = "outline" | "brush";
interface Pt { x: number; y: number }

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

export default function SelectionEditor({ imageSrc, handleRef, onMaskChange }: Props) {
  const displayRef = useRef<HTMLCanvasElement>(null);
  const maskRef    = useRef<HTMLCanvasElement>(null); // hidden, full image resolution
  const imgRef     = useRef<HTMLImageElement | null>(null);

  // View transform: canvas_xy = image_xy * scale + (tx, ty)
  const vt = useRef({ scale: 1, tx: 0, ty: 0 });

  // Outline state in refs so render() never sees stale values
  const pointsRef = useRef<Pt[]>([]);
  const cursorRef = useRef<Pt | null>(null);
  const closedRef = useRef(false);
  const hasMaskRef = useRef(false);

  // Interaction flags
  const isPainting = useRef(false);
  const isPanning  = useRef(false);
  const lastMouse  = useRef<Pt>({ x: 0, y: 0 });
  const rafId      = useRef(0);

  // React state — only for UI labels
  const [tool,       setTool]       = useState<Tool>("outline");
  const toolRef                     = useRef<Tool>("outline");
  const [brushSz,    setBrushSz]    = useState(24);
  const brushSzRef                  = useRef(24);
  const [zoomPct,    setZoomPct]    = useState(100);
  const [ptCount,    setPtCount]    = useState(0);
  const [_closed,    _setClosed]    = useState(false);
  const [_hasMask,   _setHasMask]   = useState(false);

  // keep refs in sync with state setters
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

  // ── load image ────────────────────────────────────────────────────────────
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      const mask = maskRef.current!;
      mask.width  = img.naturalWidth;
      mask.height = img.naturalHeight;
      mask.getContext("2d")!.clearRect(0, 0, mask.width, mask.height);
      const s = fitTransform();
      setZoomPct(100);
      // reset selection
      pointsRef.current = [];
      cursorRef.current = null;
      closedRef.current = false;
      hasMaskRef.current = false;
      setPtCount(0); _setClosed(false); _setHasMask(false);
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
      const rect    = canvas.getBoundingClientRect();
      const cx = (e.clientX - rect.left) * (canvas.width  / rect.width);
      const cy = (e.clientY - rect.top)  * (canvas.height / rect.height);
      const factor  = e.deltaY < 0 ? 1.14 : 1 / 1.14;
      const fitS    = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
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
    const s = fitTransform();
    const canvas = displayRef.current!;
    const fitS = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
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
    const ctx = mask.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
    closedRef.current = true;
    _setClosed(true);
    hasMaskRef.current = true;
    _setHasMask(true);
    onMaskChange(true);
    cursorRef.current = null;
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
    setPtCount(0); _setClosed(false); _setHasMask(false);
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
      isPainting.current = true;
      paintBrush(cp);
    } else {
      if (closedRef.current) return;
      const ip = c2i(cp.x, cp.y);
      // Close if clicking near first point
      if (pointsRef.current.length >= 3) {
        const fp = i2c(pointsRef.current[0].x, pointsRef.current[0].y);
        if (Math.hypot(cp.x - fp.x, cp.y - fp.y) < 16) { closeOutline(); return; }
      }
      pointsRef.current = [...pointsRef.current, ip];
      setPtCount(pointsRef.current.length);
      render();
    }
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

  function onDoubleClick(e: React.MouseEvent) {
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

  // ── cursor style ──────────────────────────────────────────────────────────
  const cursorCSS = isPanning.current ? "grabbing" : "crosshair";

  const SNAP_ZONE = 16; // px

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center", flexWrap: "wrap" }}>
        {/* Tool buttons */}
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

        {/* Outline hint */}
        {tool === "outline" && !_closed && (
          <span style={{ fontSize: "11px", color: "#64748b" }}>
            {ptCount === 0 && "Click to start outline"}
            {ptCount === 1 && "Click to add points"}
            {ptCount === 2 && "Keep adding points…"}
            {ptCount >= 3  && "Click first point ● or double-click to close"}
          </span>
        )}
        {tool === "outline" && _closed && (
          <span style={{ fontSize: "11px", color: "#a78bfa", fontWeight: 700 }}>
            ✓ Outline closed
          </span>
        )}

        {/* Zoom controls */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "4px", alignItems: "center" }}>
          <button onClick={() => applyZoom(1.25)} style={zBtn}>＋</button>
          <span style={{ fontSize: "11px", color: "#475569", minWidth: "38px", textAlign: "center" }}>
            {zoomPct}%
          </span>
          <button onClick={() => applyZoom(1 / 1.25)} style={zBtn}>－</button>
          {zoomPct !== 100 && (
            <button onClick={resetZoom} style={{ ...zBtn, padding: "3px 8px", fontSize: "10px" }}>Fit</button>
          )}
        </div>

        {/* Clear */}
        {_hasMask && (
          <button onClick={clearAll} style={{
            padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
            border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)",
            color: "#ef4444", cursor: "pointer",
          }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── Canvas ── */}
      <div style={{
        position: "relative", borderRadius: "12px", overflow: "hidden",
        background: "#060c19", border: "1px solid rgba(139,92,246,0.15)",
      }}>
        <canvas
          ref={displayRef}
          width={640}
          height={430}
          style={{ display: "block", width: "100%", cursor: cursorCSS, userSelect: "none", touchAction: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onDoubleClick={onDoubleClick}
        />
        {/* Hidden full-res mask canvas */}
        <canvas ref={maskRef} style={{ display: "none" }} />
      </div>

      <p style={{ fontSize: "11px", color: "#334155", marginTop: "6px", lineHeight: 1.6 }}>
        {tool === "outline"
          ? "⬡ Click to place outline points · click first point ● or double-click to close the selection"
          : "🖌️ Click & drag to paint the area you want recoloured"}
        {" "}&middot; Scroll to zoom &middot; Alt+drag to pan
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
