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
        khqr: {
          DEFAULT: "#E1251B",
          red: "#E1251B",
          darkred: "#B31A12",
          light: "#FEF2F2",
          surface: "#F9FAFB",
        },
      },
    },
  },
  plugins: [],
};
export default config;
