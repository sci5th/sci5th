import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sci5th",
  description:
    "sci5th — exploring science, technology, and the structure of knowledge. Home of the Map of Human Knowledge project.",
  keywords: [
    "sci5th",
    "science",
    "technology",
    "knowledge",
    "ontology",
    "map of human knowledge",
    "theories",
    "algorithms",
    "models",
    "systems",
    "data science",
    "artificial intelligence",
    "robots",
    "biotechnology",
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
