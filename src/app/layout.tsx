import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sci5th",
  description: "Science and Technology through Games by sci5th",
  keywords: ["science", "technology", "sci5th", "games", "unity", "ai"],
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
