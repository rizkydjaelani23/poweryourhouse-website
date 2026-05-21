"use client";
import { useState } from "react";

const colours = [
  { label: "Original", src: "/sofa-original.jpg", hex: "#c8a882" },
  { label: "Teal",     src: "/sofa-teal.jpg",     hex: "#0d9488" },
  { label: "Blue",     src: "/sofa-blue.jpg",      hex: "#2563eb" },
  { label: "Pink",     src: "/sofa-pink.jpg",      hex: "#ec4899" },
  { label: "Red",      src: "/sofa-red.jpg",       hex: "#dc2626" },
];

export default function HeroDemo() {
  const [active, setActive] = useState(0);

  return (
    <div style={{ position: "relative" }}>
      {/* Image frame */}
      <div style={{
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(59,130,246,0.2)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        background: "#0d1424",
        position: "relative",
      }}>
        {/* Badge */}
        <div style={{
          position: "absolute", top: "14px", left: "14px", zIndex: 10,
          background: "rgba(8,13,26,0.85)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "999px", padding: "5px 12px",
          fontSize: "11px", fontWeight: 700, color: "#94a3b8",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          Live demo
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={active}
          src={colours[active].src}
          alt={`Sofa in ${colours[active].label}`}
          style={{
            width: "100%",
            display: "block",
            aspectRatio: "4/3",
            objectFit: "cover",
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Bottom overlay with colour name */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(8,13,26,0.9))",
          padding: "32px 16px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 700 }}>
            {active === 0 ? "Original photo" : `Recoloured → ${colours[active].label}`}
          </div>
          {active > 0 && (
            <div style={{
              fontSize: "11px", fontWeight: 700,
              background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)",
              color: "#a78bfa", padding: "3px 10px", borderRadius: "999px",
            }}>
              ✨ AI generated
            </div>
          )}
        </div>
      </div>

      {/* Colour swatches */}
      <div style={{
        display: "flex", gap: "10px", marginTop: "16px",
        justifyContent: "center", flexWrap: "wrap",
      }}>
        {colours.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setActive(i)}
            title={c.label}
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: c.hex,
              border: active === i ? "3px solid #fff" : "3px solid transparent",
              boxShadow: active === i ? `0 0 0 2px ${c.hex}` : "0 2px 8px rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              transform: active === i ? "scale(1.15)" : "scale(1)",
              position: "relative",
            }}
          >
            {i === 0 && (
              <span style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px",
              }}>📷</span>
            )}
          </button>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: "12px", color: "#334155", marginTop: "8px" }}>
        Click a colour to see the AI result
      </p>
    </div>
  );
}
