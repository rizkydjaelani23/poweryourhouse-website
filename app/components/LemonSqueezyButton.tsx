"use client";
import { useEffect, useRef } from "react";
import { createClient } from "../utils/supabase/client";

/* ------------------------------------------------------------------ */
/* LemonSqueezy overlay type shim                                       */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    LemonSqueezy?: {
      Url:   { Open: (url: string) => void };
      Setup: (opts: { eventHandler?: (event: unknown) => void }) => void;
    };
  }
}

let lsLoaded = false;

function loadLS(): Promise<void> {
  return new Promise((resolve) => {
    if (lsLoaded) { resolve(); return; }
    const script   = document.createElement("script");
    script.src     = "https://assets.lemonsqueezy.com/lemon.js";
    script.defer   = true;
    script.onload  = () => { lsLoaded = true; resolve(); };
    document.head.appendChild(script);
  });
}

/* ------------------------------------------------------------------ */
/* Hook — mirrors the old usePaddle API so callers stay simple         */
/* ------------------------------------------------------------------ */
export function useLemonSqueezy() {
  const lsReady  = useRef(false);
  const userIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Load the LS overlay script
    if (!lsReady.current) {
      loadLS().then(() => { lsReady.current = true; });
    }
    // Grab current user ID so we can pass it as custom_data
    createClient()
      .auth.getUser()
      .then(({ data }) => { userIdRef.current = data.user?.id; })
      .catch(() => {});
  }, []);

  function openCheckout(variantId: string) {
    const store = process.env.NEXT_PUBLIC_LS_STORE_SLUG;
    if (!store) {
      console.error("NEXT_PUBLIC_LS_STORE_SLUG is not set");
      return;
    }

    // Build checkout URL — custom_data.user_id lets the webhook skip email lookup
    let url = `https://${store}.lemonsqueezy.com/buy/${variantId}?embed=1&media=0&logo=0`;
    if (userIdRef.current) {
      url += `&checkout[custom][user_id]=${encodeURIComponent(userIdRef.current)}`;
    }

    if (window.LemonSqueezy?.Url?.Open) {
      window.LemonSqueezy.Url.Open(url);
    } else {
      // Fallback if overlay JS hasn't initialised yet
      window.open(url, "_blank");
    }
  }

  return { openCheckout };
}

/* ------------------------------------------------------------------ */
/* Ready-made button (drop-in for PaddleButton)                        */
/* ------------------------------------------------------------------ */
interface LSButtonProps {
  variantId:  string;
  label:      string;
  style?:     React.CSSProperties;
  className?: string;
}

export default function LemonSqueezyButton({ variantId, label, style, className }: LSButtonProps) {
  const { openCheckout } = useLemonSqueezy();
  return (
    <button
      onClick={() => openCheckout(variantId)}
      style={{ cursor: "pointer", ...style }}
      className={className}
    >
      {label}
    </button>
  );
}
