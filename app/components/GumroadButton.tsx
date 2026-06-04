"use client";
/**
 * Gumroad checkout integration.
 *
 * Usage:
 *   import { useGumroad } from "./GumroadButton";
 *   const { openCheckout } = useGumroad();
 *   openCheckout("pyh-pro");          // Gumroad product permalink
 *
 * How it works:
 *   Loads Gumroad's overlay script once. When a button is clicked it opens
 *   the Gumroad checkout as a popup overlay (they call it a "wanted" overlay).
 *   The customer pays on Gumroad, we receive a webhook → grant credits.
 *
 * Env vars (set in Railway + .env.local):
 *   NEXT_PUBLIC_GUMROAD_PRODUCT_* — product permalinks (the slug after /l/)
 */

import { useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";

/* ── Script loader (once per page) ───────────────────────────────────── */
let grScriptLoaded = false;

function loadGumroadScript(): void {
  if (typeof document === "undefined" || grScriptLoaded) return;
  if (document.getElementById("gumroad-js")) { grScriptLoaded = true; return; }
  const s     = document.createElement("script");
  s.id        = "gumroad-js";
  s.src       = "https://gumroad.com/js/gumroad.js";
  s.async     = true;
  s.onload    = () => { grScriptLoaded = true; };
  document.head.appendChild(s);
}

/* ── Hook ─────────────────────────────────────────────────────────────── */
export function useGumroad() {
  const emailRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    loadGumroadScript();
    // Fetch current user email so we can pass it in the URL for matching
    createClient()
      .auth.getUser()
      .then(({ data }) => { emailRef.current = data.user?.email; })
      .catch(() => {});
  }, []);

  function openCheckout(permalink: string) {
    if (!permalink) {
      console.error("[Gumroad] permalink is empty — check your env vars");
      return;
    }

    // Build the Gumroad product URL
    // ?wanted=true triggers their overlay widget
    // &email= pre-fills the email field (helps match the webhook to the account)
    let url = `https://gumroad.com/l/${permalink}?wanted=true`;
    if (emailRef.current) {
      url += `&email=${encodeURIComponent(emailRef.current)}`;
    }

    // Open as a centred popup window — Gumroad renders their checkout inside it
    const w = 700, h = 800;
    const left = Math.max(0, (window.screen.width  - w) / 2);
    const top  = Math.max(0, (window.screen.height - h) / 2);
    window.open(
      url,
      "gumroad-checkout",
      `width=${w},height=${h},left=${left},top=${top},toolbar=0,menubar=0,location=0`
    );
  }

  return { openCheckout };
}

/* ── Drop-in button component ─────────────────────────────────────────── */
interface GumroadButtonProps {
  permalink:  string;
  label:      string;
  style?:     React.CSSProperties;
  className?: string;
}

export default function GumroadButton({ permalink, label, style, className }: GumroadButtonProps) {
  const { openCheckout } = useGumroad();
  return (
    <button
      onClick={() => openCheckout(permalink)}
      style={{ cursor: "pointer", ...style }}
      className={className}
    >
      {label}
    </button>
  );
}
