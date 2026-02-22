/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      colors: {
        orange: {
          500: '#f97316',
          DEFAULT: '#f97316',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.045em',
        tight: '-0.025em',
        wide: '0.025em',
        'widest-xl': '0.15em',
      },
    },
  },
  plugins: [],
}
