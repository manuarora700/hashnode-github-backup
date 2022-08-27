/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  important: "html",
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
