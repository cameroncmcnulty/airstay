import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#071840",
          50: "#E8ECF4",
          100: "#C5CEE0",
          200: "#8A9AB8",
          300: "#51648F",
          400: "#2A3E6A",
          500: "#071840",
          600: "#061433",
          700: "#04102C",
          800: "#030B1F",
          900: "#020714",
        },
        sky: {
          DEFAULT: "#4381C7",
          50: "#EEF5FB",
          100: "#D6E7F6",
          200: "#A9CDEC",
          300: "#7BB3E1",
          400: "#5B9BE0",
          500: "#4381C7",
          600: "#3269A8",
          700: "#275384",
          800: "#1C3C60",
          900: "#12263D",
        },
        sand: "#F6F3EE",
        mist: "#F3F6FB",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        bubble: "0 10px 30px -12px rgba(7, 24, 64, 0.28)",
        card: "0 18px 50px -24px rgba(7, 24, 64, 0.28)",
        lift: "0 22px 40px -18px rgba(67, 129, 199, 0.35)",
      },
      borderRadius: {
        bubble: "9999px",
        card: "1.4rem",
      },
    },
  },
  plugins: [],
};

export default config;
