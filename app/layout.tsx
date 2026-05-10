import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Power Your House – Smart Software for Shopify Merchants",
    template: "%s | Power Your House",
  },
  description:
    "Power Your House builds powerful Shopify apps for furniture and home goods merchants. Visualise product fabric colours with AI, track marketing ROI, and serve customers better.",
  metadataBase: new URL("https://poweryourhouse.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Power Your House – Smart Software for Shopify Merchants",
    description:
      "AI-powered Shopify apps for furniture and home goods merchants. Show customers every fabric colour option without expensive photoshoots.",
    url: "https://poweryourhouse.io",
    siteName: "Power Your House",
    type: "website",
    locale: "en_AU",
    images: [
      {
        url: "/general__coniston-grey.jpg",
        width: 1200,
        height: 630,
        alt: "Power Your House – Shopify colour visualisation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Power Your House – Smart Software for Shopify Merchants",
    description:
      "AI-powered colour visualisation and marketing tools for Shopify furniture merchants.",
    images: ["/general__coniston-grey.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Power Your House",
  url: "https://poweryourhouse.io",
  logo: "https://poweryourhouse.io/general__coniston-grey.jpg",
  description:
    "Australian software studio building focused Shopify apps for furniture and home goods merchants.",
  foundingDate: "2024",
  areaServed: "Worldwide",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://poweryourhouse.io/contact",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Script
          defer
          src="https://umami-production-f0c7.up.railway.app/script.js"
          data-website-id="a8c80c33-9976-4eb9-b613-bf4524583e6e"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <main style={{ flex: 1, paddingTop: "68px" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
