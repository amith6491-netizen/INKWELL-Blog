/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f4f1eb',
          100: '#e8e2d5',
          200: '#d0c5aa',
          300: '#b3a07a',
          400: '#967c54',
          500: '#7a6040',
          600: '#604a30',
          700: '#473522',
          800: '#2e2115',
          900: '#1a130c',
        },
        cream: '#faf8f3',
        parchment: '#f0ebe0',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: '"DM Sans", sans-serif',
          },
        },
      },
    },
  },
  plugins: [],
}
