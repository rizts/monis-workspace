import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#fdfaf4",
          100: "#faf3e0",
          200: "#f5e6c0",
          300: "#edd49a",
        },
        sand: {
          100: "#f0e8d5",
          200: "#e2d0a8",
          300: "#c8b07a",
          400: "#a8895a",
        },
        terra: {
          100: "#f5e0d0",
          200: "#e8bfa0",
          300: "#d4855a",
          400: "#b85c2a",
          500: "#8f3e12",
        },
        forest: {
          100: "#e0ede0",
          200: "#b8d4b8",
          300: "#6fa86f",
          400: "#3d7a3d",
          500: "#1e5c1e",
        },
        charcoal: {
          100: "#e8e4de",
          200: "#c4bdb0",
          300: "#8a7f72",
          400: "#5a5048",
          500: "#2a2520",
          600: "#1a1710",
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pop": "pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "warm": "0 4px 24px -4px rgba(168, 137, 90, 0.25)",
        "warm-lg": "0 8px 40px -8px rgba(168, 137, 90, 0.35)",
        "terra": "0 4px 24px -4px rgba(184, 92, 42, 0.3)",
        "float": "0 20px 60px -12px rgba(42, 37, 32, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
