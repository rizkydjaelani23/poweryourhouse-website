"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

type FormData = {
  businessName: string;
  facebookPage: string;
  instagramHandle: string;
  products: string;
  email: string;
  phone: string;
};

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, type = "text", error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", display: "block", marginBottom: "8px" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: "10px",
          background: "rgba(255,255,255,0.04)",
          border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
          color: "#e2e8f0", fontSize: "14px", outline: "none",
          fontFamily: "inherit", boxSizing: "border-box",
        }}
      />
      {error && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ConsultationForm() {
  const [step, setStep] = useState<"form" | "schedule">("form");
  const [form, setForm] = useState<FormData>({
    businessName: "", facebookPage: "", instagramHandle: "",
    products: "", email: "", phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  // Load Calendly widget script when moving to step 2
  useEffect(() => {
    if (step !== "schedule") return;
    if (document.querySelector('script[src*="assets.calendly.com"]')) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, [step]);

  function validate() {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "A valid email is required";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);

    // Save lead via API (fire and forget — we still proceed even if it fails)
    try {
      await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* silent — calendar booking is the priority */ }

    setSubmitting(false);
    setStep("schedule");
  }

  // Build Calendly URL with pre-filled name + email + custom answers
  function getCalendlyUrl() {
    if (!CALENDLY_URL) return "";
    const params = new URLSearchParams({
      name: form.businessName,
      email: form.email,
      hide_gdpr_banner: "1",
    });
    if (form.phone)           params.set("a1", form.phone);
    if (form.facebookPage)    params.set("a2", form.facebookPage);
    if (form.instagramHandle) params.set("a3", form.instagramHandle);
    if (form.products)        params.set("a4", form.products);
    return `${CALENDLY_URL}?${params.toString()}`;
  }

  // ── Step 2: Calendar embed ──────────────────────────────────────────────────
  if (step === "schedule") {
    return (
      <div style={{ background: "#080d1a", minHeight: "100vh", padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: "900px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", color: "#10b981",
              textTransform: "uppercase", background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)", borderRadius: "999px", padding: "4px 14px", marginBottom: "20px",
            }}>
              ✓ Details saved — Step 2 of 2
            </div>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              Pick a time that works for you
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Booking for <strong style={{ color: "#e2e8f0" }}>{form.businessName}</strong> · Google Meet link sent to <strong style={{ color: "#e2e8f0" }}>{form.email}</strong>
            </p>
          </div>

          {/* Calendly widget or fallback */}
          {CALENDLY_URL ? (
            <div style={{ background: "#0d1424", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", overflow: "hidden" }}>
              <div
                className="calendly-inline-widget"
                data-url={getCalendlyUrl()}
                style={{ minWidth: "320px", height: "700px" }}
              />
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "60px 32px",
              background: "#0d1424", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#e2e8f0", marginBottom: "10px" }}>Calendar coming soon</h2>
              <p style={{ fontSize: "14px", color: "#475569", marginBottom: "24px" }}>
                We&apos;ll reach out to <strong style={{ color: "#e2e8f0" }}>{form.email}</strong> within 24 hours to confirm a time.
              </p>
              <a href={`mailto:hello@poweryourhouse.io?subject=${encodeURIComponent(form.businessName + " x PowerYourHouse Social Automation Consultation")}&body=${encodeURIComponent("Hi,\n\nI just filled in the consultation form. Looking forward to chatting!\n\nBusiness: " + form.businessName + "\nEmail: " + form.email + "\nPhone: " + form.phone)}`}
                style={{ display: "inline-block", padding: "12px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "#fff", fontWeight: 700, fontSize: "14px" }}>
                Email us directly →
              </a>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={() => setStep("form")} style={{ background: "none", border: "none", color: "#475569", fontSize: "13px", cursor: "pointer" }}>
              ← Edit my details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 1: Form ────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#080d1a", minHeight: "100vh", padding: "48px 0 80px" }}>
      <div className="container" style={{ maxWidth: "580px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            display: "inline-block", fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em",
            color: "#60a5fa", textTransform: "uppercase", background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.25)", borderRadius: "999px", padding: "4px 14px", marginBottom: "18px",
          }}>
            Free Consultation — No commitment
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Let&apos;s talk about your<br />social media
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, lineHeight: 1.7, maxWidth: "440px", marginLeft: "auto", marginRight: "auto" }}>
            Tell us about your business, then pick a time for a free 30-minute Google Meet. We&apos;ll come prepared with ideas.
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} style={{
          background: "linear-gradient(160deg, #0d1424, #111827)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "36px",
        }}>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>1</div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0" }}>Your business details</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "#334155", flexShrink: 0 }}>2</div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>Book your slot</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <Field
              label="Business Name *"
              value={form.businessName}
              error={errors.businessName}
              onChange={(v) => { setForm((f) => ({ ...f, businessName: v })); setErrors((e) => ({ ...e, businessName: "" })); }}
              placeholder="e.g. Cosy Curtains & Blinds"
            />
            <Field
              label="Contact Email *"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(v) => { setForm((f) => ({ ...f, email: v })); setErrors((e) => ({ ...e, email: "" })); }}
              placeholder="you@yourbusiness.com"
            />
            <Field
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              placeholder="+1 555 000 0000"
            />
            <Field
              label="Facebook Page Name"
              value={form.facebookPage}
              onChange={(v) => setForm((f) => ({ ...f, facebookPage: v }))}
              placeholder="e.g. Cosy Curtains"
            />
            <Field
              label="Instagram Handle"
              value={form.instagramHandle}
              onChange={(v) => setForm((f) => ({ ...f, instagramHandle: v }))}
              placeholder="@cosycurtains"
            />
            <div>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1", display: "block", marginBottom: "8px" }}>
                What products do you sell?
              </label>
              <textarea
                value={form.products}
                onChange={(e) => setForm((f) => ({ ...f, products: e.target.value }))}
                placeholder="e.g. Curtains, blinds, rugs — any home decor or furniture"
                rows={3}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0", fontSize: "14px", resize: "vertical", outline: "none",
                  fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "28px", width: "100%", padding: "16px", borderRadius: "12px",
              background: submitting ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #4f46e5)",
              color: "#fff", fontSize: "15px", fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer",
              border: "none", boxShadow: "0 4px 20px rgba(59,130,246,0.4)", transition: "opacity 0.15s",
            }}
          >
            {submitting ? "Saving…" : "Next — Pick your time →"}
          </button>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#334155", marginTop: "14px", marginBottom: 0 }}>
            Free · No obligation · 30 min Google Meet · We come prepared with ideas for your business
          </p>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/services" style={{ fontSize: "13px", color: "#475569" }}>← Back to services</Link>
        </div>
      </div>
    </div>
  );
}
