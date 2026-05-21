"use client";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Minimal Paddle v2 type shim                                          */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    Paddle?: {
      Setup: (opts: {
        token: string;
        eventCallback?: (event: { name: string; data: Record<string, unknown> }) => void;
      }) => void;
      Checkout: {
        open: (opts: {
          items: Array<{ priceId: string; quantity?: number }>;
          customer?: { email: string };
          settings?: { displayMode?: string; theme?: string; locale?: string };
        }) => void;
      };
    };
  }
}

let paddleLoaded = false;
let paddleInitialized = false;

function loadPaddle(): Promise<void> {
  return new Promise((resolve) => {
    if (paddleLoaded) { resolve(); return; }
    const script = document.createElement("script");
    script.src   = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => { paddleLoaded = true; resolve(); };
    document.head.appendChild(script);
  });
}

function initPaddle() {
  if (paddleInitialized || !window.Paddle) return;
  window.Paddle.Setup({
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
  });
  paddleInitialized = true;
}

/* ------------------------------------------------------------------ */
/* Hook                                                                  */
/* ------------------------------------------------------------------ */
export function usePaddle() {
  const ready = useRef(false);

  useEffect(() => {
    if (ready.current) return;
    loadPaddle().then(() => { initPaddle(); ready.current = true; });
  }, []);

  function openCheckout(priceId: string, customerEmail?: string) {
    if (!window.Paddle) { console.warn("Paddle not loaded yet"); return; }
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      ...(customerEmail ? { customer: { email: customerEmail } } : {}),
      settings: { theme: "dark" },
    });
  }

  return { openCheckout };
}

/* ------------------------------------------------------------------ */
/* Ready-made button                                                     */
/* ------------------------------------------------------------------ */
interface PaddleButtonProps {
  priceId:       string;
  label:         string;
  customerEmail?: string;
  style?:        React.CSSProperties;
  className?:    string;
}

export default function PaddleButton({ priceId, label, customerEmail, style, className }: PaddleButtonProps) {
  const { openCheckout } = usePaddle();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadPaddle().then(() => { initPaddle(); setReady(true); });
  }, []);

  return (
    <button
      disabled={!ready}
      onClick={() => openCheckout(priceId, customerEmail)}
      style={{
        opacity: ready ? 1 : 0.6,
        cursor:  ready ? "pointer" : "not-allowed",
        ...style,
      }}
      className={className}
    >
      {label}
    </button>
  );
}
