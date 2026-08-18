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
        canvas: "#FAF9F6",
        surface: "#FFFFFF",
        surface2: "#F2F0E9",
        ink: {
          DEFAULT: "#14151F",
          soft: "#5C5E6B",
          faint: "#9A9CAA",
        },
        line: "#E7E4DC",
        signal: {
          DEFAULT: "#5546E0",
          light: "#7A6FF0",
          soft: "#EEEBFC",
        },
        ember: {
          DEFAULT: "#EF8B3C",
          soft: "#FCEBDA",
        },
        growth: {
          DEFAULT: "#1E9E6B",
          soft: "#E3F5EC",
        },
        rose: {
          DEFAULT: "#D9555C",
          soft: "#FBEAEA",
        },
      },
      fontFamily: {
        grotesk: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
