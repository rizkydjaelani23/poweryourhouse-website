"use client";
import { useLemonSqueezy } from "../components/LemonSqueezyButton";

interface BuyButtonProps {
  variantId: string;
  label: string;
  fallbackHref: string;
  style?: React.CSSProperties;
}

/**
 * If a LS variantId is set → opens the Lemon Squeezy overlay checkout.
 * If not (env var missing) → falls back to a mailto link so the page still works.
 */
export default function BuyButton({ variantId, label, fallbackHref, style }: BuyButtonProps) {
  const { openCheckout } = useLemonSqueezy();

  if (!variantId) {
    return (
      <a href={fallbackHref} style={style}>
        {label}
      </a>
    );
  }

  return (
    <button
      onClick={() => openCheckout(variantId)}
      style={{ cursor: "pointer", fontFamily: "inherit", outline: "none", ...style }}
    >
      {label}
    </button>
  );
}
