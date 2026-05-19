import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Universidad de Caldas brand palette
        brand: {
          primary: "#7B1A4B",
          primaryDark: "#5C1238",
          primaryLight: "#9C2460",
          pale: "#EDD5E2",
          veryPale: "#F7EBF2",
          // legacy aliases
          50: "#F7EBF2",
          100: "#EDD5E2",
          600: "#7B1A4B",
          700: "#5C1238",
        },
        cream: "#F5F0E8",
        ink: {
          DEFAULT: "#2C1A24",
          mid: "#5A3A4A",
          light: "#8A6A7A",
        },
        border: {
          DEFAULT: "#D8C5CE",
        }
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        sans: ["Source Sans 3", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 35px rgba(44, 26, 36, 0.08)",
        circle: "0 28px 60px rgba(0, 0, 0, 0.18)",
      },
      borderRadius: {
        brand: "12px",
        "brand-sm": "8px",
      },
    },
  },
  plugins: []
} satisfies Config;
