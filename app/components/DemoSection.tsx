"use client";
import { useState, useTransition } from "react";

const ORIGINAL = "/sofa-original.jpg";

const COLOURS = [
  { name: "Sky Blue",     swatch: "#6baed6", photo: "/sofa-blue.jpg"  },
  { name: "Blush Pink",   swatch: "#f4a0b0", photo: "/sofa-pink.jpg"  },
  { name: "Burgundy",     swatch: "#7b1c34", photo: "/sofa-red.jpg"   },
  { name: "Forest Teal",  swatch: "#2e7d6b", photo: "/sofa-teal.jpg"  },
];

export default function DemoSection() {
  const [selected, setSelected] = useState<typeof COLOURS[0] | null>(null);
  const [fading,   setFading]   = useState(false);
  const [, startTransition]     = useTransition();

  const currentPhoto = selected ? selected.photo : ORIGINAL;

  function pick(colour: typeof COLOURS[0]) {
    const isDeselect = selected?.name === colour.name;
    setFading(true);
    setTimeout(() => {
      startTransition(() => setSelected(isDeselect ? null : colour));
      setFading(false);
    }, 160);
  }

  return (
    <section style={{ padding: "96px 0", background: "linear-gradient(180deg, #080d1a 0%, #0d1424 100%)" }}>
      <div className="container">

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="badge section-eyebrow">✨ Live demo</div>
          <h2 className="section-title" style={{ marginTop: "14px" }}>See it in action</h2>
          <p className="section-sub" style={{ margin: "14px auto 0" }}>
            This is exactly what your customers see on your product page.
            Click a colour swatch to preview it — click again to go back.
          </p>
        </div>

        {/* Browser mockup */}
        <div style={{
          maxWidth: "980px", margin: "0 auto",
          background: "#fff", borderRadius: "24px",
          overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}>

          {/* Browser chrome */}
          <div style={{
            background: "#f1f5f9", borderBottom: "1px solid #e2e8f0",
            padding: "11px 18px", display: "flex", alignItems: "center", gap: "8px",
          }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c) => (
                <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, background: "#fff", borderRadius: "6px",
              padding: "5px 12px", fontSize: "12px", color: "#94a3b8",
              maxWidth: "340px", margin: "0 auto", border: "1px solid #e2e8f0",
            }}>
              yourstore.myshopify.com/products/corner-sofa
            </div>
          </div>

          {/* Product page */}
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr" }} className="demo-grid">

            {/* ── Left: product image ── */}
            <div style={{ background: "#f0f2f5", position: "relative", overflow: "hidden", minHeight: "480px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPhoto}
                alt={selected ? selected.name : "Original colour"}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                  position: "absolute", inset: 0,
                  opacity: fading ? 0 : 1,
                  transition: "opacity 0.16s ease",
                }}
              />

              {/* Status pill */}
              <div style={{
                position: "absolute", bottom: "16px", left: "16px",
                background: selected ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)",
                backdropFilter: "blur(8px)",
                color: "#fff", padding: "6px 14px", borderRadius: "999px",
                fontSize: "13px", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "8px",
                transition: "background 0.2s",
              }}>
                {selected ? (
                  <>
                    <div style={{
                      width: "10px", height: "10px", borderRadius: "50%",
                      background: selected.swatch,
                      border: "1px solid rgba(255,255,255,0.5)", flexShrink: 0,
                    }} />
                    {selected.name}
                  </>
                ) : (
                  <> Original colour</>
                )}
              </div>
            </div>

            {/* ── Right: product info + gallery widget ── */}
            <div style={{ padding: "30px 24px", background: "#fff", display: "flex", flexDirection: "column" }}>

              {/* Product info */}
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>
                Premium Furniture Co.
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: 800, color: "#111827", marginBottom: "4px", lineHeight: 1.2 }}>
                Oslo Corner Sofa
              </h3>
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "14px" }}>
                Fabric: <strong style={{ color: "#111827" }}>
                  {selected ? selected.name : "Original"}
                </strong>
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#111827", marginBottom: "16px" }}>
                $1,299.00
              </div>
              <div style={{
                padding: "12px", borderRadius: "10px", background: "#111827",
                color: "#fff", fontSize: "14px", fontWeight: 700,
                textAlign: "center", marginBottom: "18px",
              }}>
                Add to Cart
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: "14px" }} />

              {/* ── Gallery widget ── */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "16px", padding: "14px", flex: 1 }}>

                {/* Widget header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>See more colours</div>
                    <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>Browse approved colour options</div>
                  </div>
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    border: "1px solid #d1d5db", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "15px", fontWeight: 700, color: "#111827", flexShrink: 0,
                  }}>−</div>
                </div>

                {/* Family tab */}
                <div style={{ marginBottom: "10px" }}>
                  <span style={{
                    display: "inline-block", padding: "5px 12px",
                    borderRadius: "999px", background: "#111827",
                    color: "#fff", fontSize: "11px", fontWeight: 700,
                  }}>Classic Fabrics</span>
                </div>

                {/* Colour swatches — real product photos */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "7px" }}>
                  {COLOURS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => pick(c)}
                      title={c.name}
                      style={{
                        border: selected?.name === c.name ? "2.5px solid #111827" : "1px solid #e5e7eb",
                        borderRadius: "10px", background: "#fff",
                        padding: "4px", cursor: "pointer",
                        transition: "border-color 0.15s, transform 0.12s",
                        transform: selected?.name === c.name ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.photo}
                        alt={c.name}
                        style={{
                          width: "100%", aspectRatio: "1/1",
                          objectFit: "cover", borderRadius: "7px",
                          display: "block", marginBottom: "3px",
                        }}
                      />
                      <div style={{
                        fontSize: "9px", fontWeight: 700, color: "#111827",
                        lineHeight: 1.3, overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {c.name}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Status bar */}
                <div style={{
                  marginTop: "10px", padding: "7px 10px", borderRadius: "9px",
                  background: selected ? "#f0fdf4" : "#f8fafc",
                  border: `1px solid ${selected ? "#bbf7d0" : "#e5e7eb"}`,
                  display: "flex", alignItems: "center", gap: "7px",
                  transition: "background 0.2s, border-color 0.2s",
                }}>
                  {selected ? (
                    <>
                      <span style={{
                        width: "15px", height: "15px", borderRadius: "50%",
                        background: "#22c55e", color: "#fff", fontSize: "9px",
                        fontWeight: 800, display: "inline-flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>✓</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#15803d" }}>
                        Viewing: {selected.name}
                      </span>
                      <span style={{ fontSize: "10px", color: "#6b7280", marginLeft: "auto" }}>
                        Click to deselect
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                      👆 Select a colour to preview
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#475569" }}>
          ☝️ These are real generated images — same product, different fabric colour.
        </p>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .demo-grid { grid-template-columns: 1fr !important; }
          .demo-grid > div:first-child { min-height: 300px !important; aspect-ratio: 4/3; }
          .demo-grid > div:first-child img { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; }
        }
      `}</style>
    </section>
  );
}
