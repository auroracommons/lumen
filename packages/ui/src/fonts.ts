// Font loaders for Next.js consumers. Re-export via `import { fonts } from "@lumen/ui/fonts"`.
// next/font handles subsetting + self-hosting + zero CLS.

import { Inter, Source_Serif_4, Cinzel } from "next/font/google";

export const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-serif",
});

export const sans = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-display",
});

export const fontVariables = `${serif.variable} ${sans.variable} ${display.variable}`;
