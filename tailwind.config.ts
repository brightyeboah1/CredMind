import type { Config } from "tailwindcss";

// ─── DESIGN SYSTEM ────────────────────────────────────────────────────────
// Direction: Dark "Wealthsimple-style" — minimal, huge whitespace, restrained
// UI, confident typography, ONE accent color used sparingly and purposefully.
// Background is near-black/navy, not pure black (easier on the eyes, feels
// premium rather than harsh). Electric blue accent used ONLY for primary
// actions, links, and key highlights — never decoratively.

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        canvas: "#0A0E14",      // main app background — near-black navy
        surface: "#12161F",      // cards, panels — one step up from canvas
        surfaceRaised: "#1A1F2B", // hover states, modals, elevated elements
        border: "#232937",       // hairline borders — subtle, not decorative

        // Text
        ink: "#F5F6F8",          // primary text — near-white, not pure white
        inkMuted: "#8B92A3",     // secondary text, labels
        inkFaint: "#4E5566",     // tertiary/disabled text

        // The ONE accent — electric blue, used sparingly
        accent: "#3B82F6",
        accentHover: "#5B93F7",
        accentMuted: "#1E3A66",  // accent at low-emphasis (backgrounds, badges)

        // Semantic (used rarely — status only, never decoration)
        positive: "#22C55E",
        negative: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        // Clean geometric sans — Inter is the closest freely-licensed
        // equivalent to Wealthsimple's actual typeface family.
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        // Confident, spacious type scale — fewer sizes, used consistently
        "display": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" }],
        "h1": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h2": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h3": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        "small": ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        "micro": ["0.6875rem", { lineHeight: "1.4", fontWeight: "600", letterSpacing: "0.04em" }],
      },
      spacing: {
        // Generous spacing scale — Wealthsimple's UI "breathes"
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        // Barely-there shadows — never heavy/glowy
        "soft": "0 1px 2px rgba(0,0,0,0.3)",
        "raised": "0 4px 16px rgba(0,0,0,0.4)",
      },
      transitionDuration: {
        "250": "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
