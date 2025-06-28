/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)"],
        inter: ["var(--font-inter)"],
        geist: ["var(--font-geist-sans)"],
        "geist-mono": ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};
