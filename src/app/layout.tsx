import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
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
  title: "sci5th",
  description:
    "sci5th — exploring the structure of human knowledge, with a focus on science and technology",
  keywords: [
    "sci5th",
    "science",
    "technology",
    "human knowledge",
    "artificial intelligence",
    "computer science",
    "data science",
    "md files",
  ],
  authors: [{ name: "sci5th" }],
  icons: {
    icon: "/sci5th_Logo_Pink.svg",
    apple: "/sci5th_Logo_Pink.svg",
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
