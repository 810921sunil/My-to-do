/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#090D16',
          card: '#111827',
          border: '#1F2937',
          accent: '#3B82F6',
        },
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.15)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.15)',
        'glow-purple': '0 0 15px rgba(139, 92, 246, 0.15)',
      }
    },
  },
  plugins: [],
}
