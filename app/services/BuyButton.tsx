"use client";
import { useFastSpring } from "../components/FastSpringButton";

interface BuyButtonProps {
  productPath: string;
  label: string;
  fallbackHref: string;
  style?: React.CSSProperties;
}

/**
 * If a FastSpring productPath is set → opens the FastSpring popup checkout.
 * If not (env var missing AND no default) → falls back to a mailto link so the
 * page still works.
 */
export default function BuyButton({ productPath, label, fallbackHref, style }: BuyButtonProps) {
  const { openCheckout } = useFastSpring();

  if (!productPath) {
    return (
      <a href={fallbackHref} style={style}>
        {label}
      </a>
    );
  }

  return (
    <button
      onClick={() => openCheckout(productPath)}
      style={{ cursor: "pointer", fontFamily: "inherit", outline: "none", ...style }}
    >
      {label}
    </button>
  );
}
