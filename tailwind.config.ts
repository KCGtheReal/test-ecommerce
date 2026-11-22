import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#080B11",
          elevated: "#0E1420",
          surface: "#151D2C",
          stroke: "#1E293B",
        },
        cyber: {
          blue: "#3B82F6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        chamfer: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 10px 30px -10px rgba(0, 0, 0, 0.6)",
        "chamfer-hover": "inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 14px 40px -10px rgba(59, 130, 246, 0.2)",
        "glow-blue": "0 0 20px -3px rgba(59, 130, 246, 0.4)",
        "glow-emerald": "0 0 20px -3px rgba(16, 185, 129, 0.4)",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spring-bounce": "bounce 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
