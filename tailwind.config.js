/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b', // Dark Slate Blue (Professional/Sober)
        secondary: '#475569', // Slate Gray
        accent: '#3b82f6', // Blue (for actions, not too vibrant)
        background: '#f8fafc', // Very Light Gray/White
        surface: '#ffffff', // White
      }
    },
  },
  plugins: [],
}
