import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sci5th",
  description:
    "sci5th is a platform dedicated to exploring and sharing knowledge in science, technology, and related fields. We provide resources, articles, and interactive content to help users learn and stay updated on the latest developments in these areas.",
  keywords: [
    "science",
    "technology",
    "sci5th",
    "games",
    "unity",
    "ai",
    "ai agents",
    "algorithms",
    "ontology",
  ],
  authors: [{ name: "sci5th" }],
  icons: {
    icon: "/sci5th_Logo_Blue.svg",
    apple: "/sci5th_Logo_Blue.svg",
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
