import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Power Your House – Shopify Apps for Furniture & Home Goods Stores",
    template: "%s | Power Your House",
  },
  description:
    "Shopify apps built for furniture, bedding and upholstery stores worldwide. Show customers every fabric colour option with AI — no photoshoots needed. Trusted by furniture merchants across Australia, UK, USA and beyond.",
  metadataBase: new URL("https://poweryourhouse.io"),
  openGraph: {
    title: "Power Your House – Shopify Apps for Furniture & Home Goods Stores",
    description:
      "AI colour visualisation for Shopify furniture stores. Show beds, sofas and upholstered products in every fabric colour — no photoshoots needed. Used by merchants worldwide.",
    url: "https://poweryourhouse.io",
    siteName: "Power Your House",
    type: "website",
    locale: "en_AU",
    images: [
      {
        url: "/general__coniston-grey.jpg",
        width: 1200,
        height: 630,
        alt: "Power Your House – AI fabric colour visualisation for Shopify furniture stores",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Power Your House – Shopify Apps for Furniture Stores",
    description:
      "Show beds, sofas and upholstered products in every fabric colour on your Shopify store — no expensive photoshoots needed.",
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
    "Software studio building focused Shopify apps for furniture, bedding and upholstery merchants worldwide. Specialising in AI-powered fabric colour visualisation.",
  foundingDate: "2024",
  areaServed: ["Australia", "United Kingdom", "United States", "Canada", "New Zealand", "Europe"],
  knowsAbout: [
    "Shopify apps",
    "furniture ecommerce",
    "fabric colour visualisation",
    "AI image generation",
    "upholstery product photography",
    "bed and sofa online retail",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://poweryourhouse.io/contact",
    availableLanguage: "English",
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
