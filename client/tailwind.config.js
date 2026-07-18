/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bottle: "#2B3A2C",
        "bottle-dark": "#1D2820",
        putty: "#E8E3D3",
        "putty-light": "#F2EFE4",
        mustard: "#D9A441",
        ink: "#211F1B",
        rose: "#B97A6B",
        "cream-paper": "#F6F1E4",
        line: "rgba(33,31,27,0.15)",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Work Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
