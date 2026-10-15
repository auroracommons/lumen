// LUMEN design tokens — TS exports for runtime needs (charts, motion).
// CSS source of truth lives in ./globals.css via @theme. Keep these two in sync.
//
// Palette rationale (PRINCIPLES.md §8):
//   • parchment — warm white; the color of an old missal page, not pure white
//   • sanctuary — deep stained-glass blue; the dominant brand color
//   • brass    — warm metallic gold accent; sparingly, for moments of weight
//   • oxblood  — liturgical red, deep; martyrdom and Pentecost
// Plus the canonical liturgical colors (violet, rose, green, white, red, black, gold).

export const colors = {
  parchment: {
    50: "#fbf8f1",  // page background, daylight
    100: "#f5efe1",
    200: "#ebe1c8",
    300: "#dac9a3",
    400: "#c4ad7c",
    500: "#9c855a", // body text on dark
  },
  sanctuary: {
    400: "#5b7fa8",
    500: "#3f628f",
    600: "#2c4d76",
    700: "#1f3a5d", // primary
    800: "#162a44",
    900: "#0d1a2c", // deep night
  },
  brass: {
    300: "#e4cf8b",
    500: "#c8a651",
    700: "#9a7d34",
  },
  oxblood: {
    500: "#8b2c2c",
    700: "#5e1a1a",
    800: "#3f0f0f",
  },
  liturgical: {
    violet: "#5d3a85",
    rose: "#d49bb1",
    green: "#4f7d3c",
    white: "#fbf8f1", // == parchment-50
    red: "#8b2c2c",   // == oxblood-500
    black: "#0d1a2c", // == sanctuary-900
    gold: "#c8a651",  // == brass-500
  },
} as const;

export const fonts = {
  serif: '"Source Serif 4", "Source Serif Pro", "Cormorant Garamond", Georgia, serif',
  sans: 'Inter, "IBM Plex Sans", system-ui, -apple-system, sans-serif',
  display: 'Cinzel, "Cormorant SC", Trajan, serif',
} as const;

// Bell-decay easing — borrowed from physical decay curves, not iOS rubber-band.
// Quick attack, long tail. Read at top of strike; settles slow.
export const easing = {
  bell: "cubic-bezier(0.18, 0.9, 0.32, 1)",
  bellSoft: "cubic-bezier(0.2, 0.7, 0.4, 1)",
  vespers: "cubic-bezier(0.4, 0, 0.2, 1)", // for chrome transitions
} as const;

export const durations = {
  bellShort: "320ms",
  bellLong: "640ms",
  vigil: "1200ms",
} as const;
