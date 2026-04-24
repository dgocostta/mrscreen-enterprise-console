import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        card: "#121214",
        "card-hover": "#18181b",
        border: "rgba(255,255,255,0.05)",
        accent: "#FF6B00",
        "accent-dim": "rgba(255,107,0,0.10)",
        muted: "#71717a",
        "muted-fg": "#a1a1aa",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      width: {
        sidebar: "260px",
      },
      boxShadow: {
        "accent-glow": "0 0 24px 4px rgba(255,107,0,0.35)",
        "accent-glow-lg": "0 0 40px 8px rgba(255,107,0,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
