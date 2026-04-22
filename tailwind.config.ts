import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#13131A",
        "surface-hover": "#1A1A24",
        border: "#1E1E2E",
        primary: "#E8D5A3",
        "primary-dim": "#C9B684",
        secondary: "#4A9EBF",
        "text-primary": "#F2F0EB",
        "text-muted": "#6B6880",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      boxShadow: {
        lift: "0 20px 40px -20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(232, 213, 163, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
