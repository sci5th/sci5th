import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { assetUrl } from "@/config/asset-manifest";
import { BRAND } from "@/config/brand";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  // Title template lets child pages set just their own segment
  // (e.g. metadata.title = "Knowledge Gallery") and Next will resolve it
  // to "Knowledge Gallery | sci5th". `default` is used by pages that
  // don't override `metadata.title`.
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [...BRAND.keywords],
  authors: [{ name: BRAND.name }],
  icons: {
    icon: [
      { url: assetUrl(BRAND.icons.favicon), sizes: "any" },
      {
        url: assetUrl(BRAND.icons.faviconPng32),
        sizes: "32x32",
        type: "image/png",
      },
      { url: assetUrl(BRAND.icons.faviconSvg), type: "image/svg+xml" },
    ],
    apple: {
      url: assetUrl(BRAND.icons.appleTouch),
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetBrainsMono.variable}`}>
      <body className="bg-ink-700 font-sans text-text-100 antialiased">
        {children}
      </body>
    </html>
  );
}
