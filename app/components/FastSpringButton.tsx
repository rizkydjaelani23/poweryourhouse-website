"use client";
/**
 * FastSpring popup checkout integration.
 *
 * Usage:
 *   import { useFastSpring } from "./FastSpringButton";
 *   const { openCheckout } = useFastSpring();
 *   openCheckout("pyh-pro-monthly");
 *
 * Env vars required (set in Railway + .env.local):
 *   NEXT_PUBLIC_FS_STORE  — e.g. "poweryourhouse.onfastspring.com/popup"
 */

import { useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";

/* ── Global type shim ─────────────────────────────────────────────────── */
declare global {
  interface Window {
    fastspring?: {
      builder: {
        push:     (session: Record<string, unknown>) => void;
        checkout: () => void;
      };
    };
  }
}

/* ── Script loader (singleton — only ever appended once) ──────────────── */
const FS_STORE = process.env.NEXT_PUBLIC_FS_STORE || "";
let fsLoaded   = false;

function loadFastSpring(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") { resolve(); return; }
    if (fsLoaded) { resolve(); return; }
    if (document.getElementById("fsc-api")) { fsLoaded = true; resolve(); return; }

    const script = document.createElement("script");
    script.id    = "fsc-api";
    script.src   = "https://sbl.onfastspring.com/sbl/1.0.6/fastspring-builder.min.js";
    script.type  = "text/javascript";
    script.setAttribute("data-storefront", FS_STORE);
    script.onload = () => { fsLoaded = true; resolve(); };
    document.head.appendChild(script);
  });
}

/* ── Hook ─────────────────────────────────────────────────────────────── */
export function useFastSpring() {
  const fsReady   = useRef(false);
  const userIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Load the FastSpring Store Builder script
    if (!fsReady.current) {
      loadFastSpring().then(() => { fsReady.current = true; });
    }
    // Fetch current user so we can pass user_id as a tag in the session
    createClient()
      .auth.getUser()
      .then(({ data }) => { userIdRef.current = data.user?.id; })
      .catch(() => {});
  }, []);

  function openCheckout(productPath: string) {
    if (!FS_STORE) {
      console.error("[FastSpring] NEXT_PUBLIC_FS_STORE is not set");
      return;
    }
    if (!productPath) {
      console.error("[FastSpring] productPath is empty — check your env vars");
      return;
    }

    const session: Record<string, unknown> = {
      products: [{ path: productPath, quantity: 1 }],
    };

    // Attach user_id so the webhook can match the purchase to the account
    if (userIdRef.current) {
      session.tags = { user_id: userIdRef.current };
    }

    if (window.fastspring?.builder) {
      window.fastspring.builder.push(session);
      window.fastspring.builder.checkout();
    } else {
      // Fallback: open web checkout in new tab (builder not yet initialised)
      const baseUrl = FS_STORE.replace("/popup", "");
      window.open(`https://${baseUrl}/${productPath}`, "_blank");
    }
  }

  return { openCheckout };
}

/* ── Drop-in button component ─────────────────────────────────────────── */
interface FSButtonProps {
  productPath: string;
  label:       string;
  style?:      React.CSSProperties;
  className?:  string;
}

export default function FastSpringButton({ productPath, label, style, className }: FSButtonProps) {
  const { openCheckout } = useFastSpring();
  return (
    <button
      onClick={() => openCheckout(productPath)}
      style={{ cursor: "pointer", ...style }}
      className={className}
    >
      {label}
    </button>
  );
}
