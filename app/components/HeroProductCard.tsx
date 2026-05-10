"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  { src: "/general__coniston-grey.jpg",                    colour: "Coniston Grey",        dot: "#9ca3af" },
  { src: "/general__pinkplush.jpg",                        colour: "Plush Pink",           dot: "#f9a8d4" },
  { src: "/general__skyblueplush.jpg",                     colour: "Plush Sky Blue",       dot: "#93c5fd" },
  { src: "/general__mustardplush.jpg",                     colour: "Plush Mustard",        dot: "#fbbf24" },
  { src: "/general__maroonplush.jpg",                      colour: "Plush Maroon",         dot: "#be123c" },
  { src: "/general__minkplush.jpg",                        colour: "Plush Mink",           dot: "#d4a090" },
  { src: "/general__glitz-crushed-velvet-black.jpg",       colour: "Velvet Black",         dot: "#1f2937" },
  { src: "/general__glitz-crushed-velvet-pink.jpg",        colour: "Velvet Pink",          dot: "#ec4899" },
  { src: "/general__glitz-crushed-velvet-silver-grey.jpg", colour: "Velvet Silver",        dot: "#94a3b8" },
  { src: "/general__coniston-emerald-green.jpg",           colour: "Emerald Green",        dot: "#22c55e" },
  { src: "/general__coniston-emerald-pink.jpg",            colour: "Emerald Pink",         dot: "#f472b6" },
  { src: "/general__wool-black.jpg",                       colour: "Wool Black",           dot: "#374151" },
];

export default function HeroProductCard() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 2600);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <div
      className="float"
      style={{
        background: "rgba(10,15,30,0.92)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "20px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}
    >
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{
          fontSize: "12px", fontWeight: 700, color: "#94a3b8",
          background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "8px",
        }}>
          🛋️ Colour Preview
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e",
          }} />
          Live
        </span>
      </div>

      {/* Image area — crossfade between slides */}
      <div style={{
        position: "relative",
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "14px",
        aspectRatio: "4/3",
        background: "#0d1424",
        cursor: "pointer",
      }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.colour}
            fill
            sizes="420px"
            style={{
              objectFit: "cover",
              opacity: i === current ? 1 : 0,
              transition: "opacity 0.7s ease",
              position: "absolute",
              inset: 0,
            }}
            priority={i === 0}
          />
        ))}

        {/* Colour name pill */}
        <div style={{
          position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
          color: "#fff", fontSize: "11px", fontWeight: 700,
          padding: "5px 14px", borderRadius: "999px", whiteSpace: "nowrap",
          zIndex: 2,
        }}>
          {slide.colour}
        </div>
      </div>

      {/* Swatch label */}
      <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "10px" }}>
        Select fabric colour
      </p>

      {/* Swatch dots — scrollable row */}
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "14px" }}>
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => { setCurrent(i); setPaused(true); setTimeout(() => setPaused(false), 5000); }}
            title={s.colour}
            style={{
              width: "22px", height: "22px", borderRadius: "50%",
              background: s.dot,
              border: i === current ? "2px solid #fff" : "2px solid transparent",
              outline: i === current ? "2px solid rgba(255,255,255,0.3)" : "none",
              cursor: "pointer",
              transition: "transform 0.15s, border 0.15s",
              transform: i === current ? "scale(1.2)" : "scale(1)",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Status bar */}
      <div style={{
        background: "rgba(79,70,229,0.12)",
        border: "1px solid rgba(79,70,229,0.25)",
        borderRadius: "10px",
        padding: "9px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#818cf8" }}>
          ✓ {slide.colour} — preview ready
        </span>
        <span style={{ fontSize: "11px", color: "#4f46e5", fontWeight: 600 }}>
          {current + 1}/{slides.length}
        </span>
      </div>
    </div>
  );
}
