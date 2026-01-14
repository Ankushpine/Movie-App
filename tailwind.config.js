/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}","./Components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4caf1eff",
        light: {
          100: "#f1f1f1ff",
          200: "#e1e1e1ff",
          300: "#d1d1d1ff",

        },
        dark: {
          100: "#2a2a2aff",
          200: "#1a1a1aff",
          300: "#0a0a0aff",
        },
      },
    },
  },
  plugins: [],
}