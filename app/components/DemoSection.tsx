"use client";
import { useState, useTransition } from "react";

const COLOURS = [
  {
    name: "Stone Grey",
    family: "Classic Fabrics",
    swatch: "#8c8c8c",
    photo: "KEGGJPKxcSc",
  },
  {
    name: "Forest Green",
    family: "Classic Fabrics",
    swatch: "#4a7c59",
    photo: "fZuleEfeA1Q",
  },
  {
    name: "Ocean Blue",
    family: "Classic Fabrics",
    swatch: "#2c5f8a",
    photo: "nL2CbhdingE",
  },
  {
    name: "Warm Beige",
    family: "Classic Fabrics",
    swatch: "#c4a882",
    photo: "tk4Mfc0dzic",
  },
  {
    name: "Mustard",
    family: "Classic Fabrics",
    swatch: "#c89a1a",
    photo: "m7V-MeCBgm0",
  },
];

function unsplashUrl(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=900&q=80&fit=crop&auto=format`;
}

export default function DemoSection() {
  const [selected, setSelected] = useState(COLOURS[0]);
  const [fading, setFading] = useState(false);
  const [, startTransition] = useTransition();

  function pick(colour: typeof COLOURS[0]) {
    if (colour.name === selected.name) return;
    setFading(true);
    setTimeout(() => {
      startTransition(() => setSelected(colour));
      setFading(false);
    }, 180);
  }

  return (
    <section
      style={{
        padding: "96px 0",
        background: "linear-gradient(180deg, #080d1a 0%, #0d1424 100%)",
      }}
    >
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="badge section-eyebrow">✨ Live demo</div>
          <h2 className="section-title" style={{ marginTop: "14px" }}>
            See it in action
          </h2>
          <p className="section-sub" style={{ margin: "14px auto 0" }}>
            This is exactly what your customers experience on your product page.
            Tap a colour to see the sofa change instantly.
          </p>
        </div>

        {/* Demo card — styled like a storefront product page */}
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
          }}
        >
          {/* Fake browser chrome */}
          <div
            style={{
              background: "#f1f5f9",
              borderBottom: "1px solid #e2e8f0",
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <div
                  key={c}
                  style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }}
                />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: "6px",
                padding: "5px 12px",
                fontSize: "12px",
                color: "#94a3b8",
                maxWidth: "320px",
                margin: "0 auto",
                border: "1px solid #e2e8f0",
              }}
            >
              yourstore.myshopify.com/products/sofa
            </div>
          </div>

          {/* Product page layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              minHeight: "520px",
            }}
          >
            {/* Left — product image */}
            <div style={{ background: "#f8fafc", position: "relative", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={selected.photo}
                src={unsplashUrl(selected.photo)}
                alt={selected.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: fading ? 0 : 1,
                  transition: "opacity 0.18s ease",
                }}
              />
              {/* Colour label overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(6px)",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: selected.swatch,
                    border: "1px solid rgba(255,255,255,0.4)",
                    flexShrink: 0,
                  }}
                />
                {selected.name}
              </div>
            </div>

            {/* Right — product info + gallery widget */}
            <div style={{ padding: "32px 28px", background: "#fff" }}>
              {/* Fake product info */}
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                }}
              >
                Premium Furniture
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: "6px",
                  lineHeight: 1.2,
                }}
              >
                The Oslo 3-Seater Sofa
              </h3>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "18px" }}>
                $1,299.00
              </div>
              <div
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  background: "#111827",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: "24px",
                }}
              >
                Add to Cart
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: "18px" }} />

              {/* ── The actual gallery widget ── */}
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "14px",
                }}
              >
                {/* Toggle row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: selected ? "14px" : "0",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                      See more colours
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                      Browse approved colour options
                    </div>
                  </div>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "1px solid #d1d5db",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#111827",
                      flexShrink: 0,
                    }}
                  >
                    −
                  </div>
                </div>

                {/* Family tab */}
                <div style={{ marginBottom: "12px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      background: "#111827",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    Classic Fabrics
                  </span>
                </div>

                {/* Colour swatches grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "8px",
                  }}
                >
                  {COLOURS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => pick(c)}
                      title={c.name}
                      style={{
                        border: selected.name === c.name ? "2px solid #111827" : "1px solid #d1d5db",
                        borderRadius: "10px",
                        background: "#fff",
                        padding: "6px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "border-color 0.15s",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={unsplashUrl(c.photo)}
                        alt={c.name}
                        style={{
                          width: "100%",
                          aspectRatio: "1/1",
                          objectFit: "cover",
                          borderRadius: "7px",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "#111827",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.name}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected label */}
                {selected && (
                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#22c55e",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#15803d" }}>
                      Viewing: {selected.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          ☝️ Click any colour swatch above — this is exactly what your customers see.
          Photos by{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#60a5fa" }}
          >
            Unsplash
          </a>
          .
        </p>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(5, 1fr)"] {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
