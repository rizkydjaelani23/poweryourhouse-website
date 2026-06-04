"use client";
import { useGumroad } from "../components/GumroadButton";

interface BuyButtonProps {
  permalink:    string;
  label:        string;
  fallbackHref: string;
  style?:       React.CSSProperties;
}

/**
 * If a Gumroad permalink is set → opens the Gumroad overlay checkout.
 * If not → falls back to a mailto link so the page still works.
 */
export default function BuyButton({ permalink, label, fallbackHref, style }: BuyButtonProps) {
  const { openCheckout } = useGumroad();

  if (!permalink) {
    return <a href={fallbackHref} style={style}>{label}</a>;
  }

  return (
    <button
      onClick={() => openCheckout(permalink)}
      style={{ cursor: "pointer", fontFamily: "inherit", outline: "none", ...style }}
    >
      {label}
    </button>
  );
}
