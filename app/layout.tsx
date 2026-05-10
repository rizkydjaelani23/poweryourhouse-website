import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Power Your House – Smart Software for E-Commerce",
  description: "Power Your House builds powerful tools for Shopify merchants. Visualise product colours, track marketing performance, and serve customers better.",
  metadataBase: new URL("https://poweryourhouse.io"),
  openGraph: {
    title: "Power Your House",
    description: "Smart software tools built for modern e-commerce merchants.",
    url: "https://poweryourhouse.io",
    siteName: "Power Your House",
    type: "website",
  },
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
        <Nav />
        <main style={{ flex: 1, paddingTop: "68px" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
