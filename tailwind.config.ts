import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        mist: "#F5F7FB",
        accent: "#D97941",
        accentDark: "#B85E2D",
        pine: "#1E5B4F",
        sky: "#DCEEFF"
      },
      boxShadow: {
        card: "0 18px 50px rgba(16, 32, 51, 0.10)"
      },
      fontFamily: {
        sans: ["Aptos", "Trebuchet MS", "Gill Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
