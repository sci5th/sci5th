import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sci5th",
  description:
    "sci5th — exploring the structure of human knowledge, with a focus on science and technology",
  keywords: [
    "sci5th",
    "science",
    "technology",
    "human knowledge",
    "artificial intelligence",
    "data science",
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
