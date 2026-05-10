import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact – Power Your House",
  description: "Get in touch with the Power Your House team. We reply within 24 hours.",
  alternates: { canonical: "https://poweryourhouse.io/contact" },
  openGraph: {
    title: "Contact – Power Your House",
    description: "Get in touch with the Power Your House team. We reply within 24 hours.",
    url: "https://poweryourhouse.io/contact",
    type: "website",
  },
};

const SUPPORT_EMAIL = "hello@poweryourhouse.io";

const mailtoSubject = encodeURIComponent("Enquiry – Power Your House");
const mailtoBody = encodeURIComponent(
  "Hi Power Your House team,\n\nI'd like to know more about:\n\n[Please describe your question here]\n\nThanks"
);

const topics = [
  { icon: "🛠️", title: "Technical Support", desc: "Having trouble with the app? We'll help you get unstuck fast.", color: "#3b82f6" },
  { icon: "💼", title: "Partnerships", desc: "Looking to collaborate or integrate? We're always open to good ideas.", color: "#8b5cf6" },
  { icon: "💬", title: "General Enquiry", desc: "Anything else — pricing questions, feedback, or just saying hi.", color: "#10b981" },
];

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section style={{
        padding: "72px 0 56px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0d1424 0%, #080d1a 100%)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container">
          <div className="badge section-eyebrow">✉️ Contact</div>
          <h1 className="section-title" style={{ margin: "14px auto 0", maxWidth: "480px" }}>
            We'd love to hear from you
          </h1>
          <p className="section-sub" style={{ margin: "14px auto 0" }}>
            Whether you need help, have a feature idea, or just want to say hi — we're a small team and we actually read every message.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="section">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: "48px",
            alignItems: "start",
          }}>
            {/* Left — info */}
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
                Get in touch
              </h2>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, marginBottom: "32px" }}>
                We're based in Australia and respond to all messages within 24 hours during business days.
              </p>

              {/* Direct email card */}
              <div style={{
                background: "#111827",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                  Email us directly
                </div>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    fontSize: "15px", fontWeight: 700, color: "#60a5fa",
                  }}
                >
                  <span style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "rgba(59,130,246,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", flexShrink: 0,
                  }}>✉️</span>
                  {SUPPORT_EMAIL}
                </a>
              </div>

              {/* Response time */}
              <div style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "28px" }}>⏱️</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Typical response time</div>
                    <div style={{ fontSize: "13px", color: "#94a3b8" }}>Under 24 hours on business days</div>
                  </div>
                </div>
              </div>

              {/* Topics */}
              {topics.map((t) => (
                <div key={t.title} style={{
                  display: "flex", alignItems: "flex-start", gap: "14px",
                  marginBottom: "18px",
                }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "12px",
                    background: `${t.color}18`,
                    border: `1px solid ${t.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", flexShrink: 0,
                  }}>
                    {t.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{t.title}</div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — email composer */}
            <div style={{
              background: "#111827",
              border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: "22px",
              padding: "36px",
              boxShadow: "0 0 60px rgba(59,130,246,0.06)",
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
                Send us a message
              </h3>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "28px" }}>
                Fill this in and it'll open your email client, pre-filled and ready to send.
              </p>

              {/* Fake form that builds a mailto link — no server needed */}
              <div>
                {[
                  { label: "Your name", placeholder: "Jane Smith", id: "name" },
                  { label: "Your email", placeholder: "jane@yourstore.com", id: "email" },
                ].map((field) => (
                  <div key={field.id} style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "8px" }}>
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      disabled
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#475569",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "default",
                      }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "8px" }}>
                    Your message
                  </label>
                  <textarea
                    disabled
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#475569",
                      fontSize: "14px",
                      resize: "none",
                      cursor: "default",
                    }}
                  />
                </div>

                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "15px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "15px",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
                    textDecoration: "none",
                  }}
                >
                  ✉️ Open in Email Client
                </a>

                <p style={{ marginTop: "14px", textAlign: "center", fontSize: "12px", color: "#475569" }}>
                  Opens your default email app with the subject and body pre-filled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1.4fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
