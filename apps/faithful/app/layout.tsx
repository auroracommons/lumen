import type { Metadata, Viewport } from "next";
import { serif, sans, display, fontVariables } from "@lumen/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumen — Faithful",
  description: "Light of the nations. Find Mass, pray, give, learn.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Lumen", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1a2c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
