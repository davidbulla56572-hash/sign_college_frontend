import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          600: "#0891b2",
          700: "#0e7490"
        },
        ink: "#1f2937"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(31, 41, 55, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
