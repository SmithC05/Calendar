import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        sand: "rgb(var(--sand) / <alpha-value>)",
        rust: "rgb(var(--rust) / <alpha-value>)",
        pine: "rgb(var(--pine) / <alpha-value>)",
        sage: "rgb(var(--sage) / <alpha-value>)",
        blush: "rgb(var(--blush) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        range: "rgb(var(--range) / <alpha-value>)",
        studio: "rgb(var(--studio) / <alpha-value>)"
      },
      boxShadow: {
        card: "0 26px 72px rgb(var(--shadow) / 0.14)",
        paper: "0 16px 42px rgb(var(--shadow) / 0.14)",
        inset: "inset 0 1px 0 rgb(255 255 255 / 0.28)",
        glow: "0 12px 28px rgb(var(--shadow) / 0.12)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-playfair)", "ui-serif", "Georgia"]
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 1px 1px, rgb(var(--ink) / 0.06) 1px, transparent 0)"
      },
      animation: {
        rise: "rise 500ms ease-out",
        fade: "fade 350ms ease-out"
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
