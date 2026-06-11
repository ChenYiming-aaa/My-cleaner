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
        success: {
          50: '#F0F9F4',
          100: '#D4EDDA',
          200: '#A8D5B8',
          300: '#7CBD96',
          400: '#4A7C59',
          500: '#3D6B4A',
          600: '#2D5A3A',
          700: '#1E492A',
          800: '#0F381A',
          900: '#00270A',
        },
        warning: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFD966',
          400: '#D4A017',
          500: '#B8860B',
          600: '#9A7209',
          700: '#7C5E07',
          800: '#5E4A05',
          900: '#403603',
        },
        danger: {
          50: '#FDF2EC',
          100: '#F8D9C4',
          200: '#F0B899',
          300: '#E8976E',
          400: '#8B4513',
          500: '#7A3B10',
          600: '#69310D',
          700: '#58270A',
          800: '#471D07',
          900: '#361304',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
