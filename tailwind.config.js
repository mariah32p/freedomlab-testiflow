/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a5b8ff',
          400: '#8191ff',
          500: '#5d6aff',
          600: '#4c51f7',
          700: '#3d3ee3',
          800: '#3133b8',
          900: '#2d2f92',
          950: '#01004d',
        },
        secondary: {
          50: '#f0fdfc',
          100: '#ccfbf6',
          200: '#99f6ed',
          300: '#5eebe1',
          400: '#2dd4cc',
          500: '#01b79e',
          600: '#059688',
          700: '#0a786e',
          800: '#0d5f58',
          900: '#0f4f4a',
        },
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        }
      }
    },
  },
  plugins: [],
}