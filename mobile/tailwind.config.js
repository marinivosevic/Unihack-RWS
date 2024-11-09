/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme"); // Import the default theme

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...defaultTheme.colors, // Include default colors
        primary: {
          50: "#f1f7fd",
          100: "#deeefb",
          200: "#c5e2f8",
          300: "#9dd1f3",
          400: "#6fb6eb",
          500: "#4d99e4",
          600: "#387ed8",
          700: "#2f69c6",
          800: "#2c56a1",
          900: "#284a80",
          950: "#1c2d4c",
        },
        secondary: {
          0: "#00D0B4",
          50: "#00A58F",
          100: "#007D6B",
          200: "#00332A",
        },
        txt: {
          100: "#333333",
          200: "#555555",
        },
        neutral: {
          0: "#0A5EFE",
          50: "#262626",
          80: "#868686",
          90: "#CECECE",
          100: "#F5F5F7",
          200: "#FFFFFF",
        },
        danger: "#FF6B6B",
        success: "#4CAF50",
        accent: "#FFA500",
        black: "#000",
      },
    },
  },
  plugins: [],
};
