/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#E8DFD0',
          300: '#D4C5A9',
          400: '#C4A35A',
          500: '#B8944F',
          600: '#A67C4A',
          700: '#8B6538',
          800: '#6B4E2D',
          900: '#3D2B1F',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
