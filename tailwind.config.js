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
      spacing: {
        '4.5': '1.125rem',
      },
      colors: {
        orange: {
          500: '#f97316',
          600: '#ea580c',
          DEFAULT: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        accent: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
      },
      fontWeight: {
        '100': '100',
        '200': '200',
        '300': '300',
        '400': '400',
        '450': '450',
        '500': '500',
        '550': '550',
        '600': '600',
        '650': '650',
        '700': '700',
        '750': '750',
        '800': '800',
        '850': '850',
        '900': '900',
      },
      letterSpacing: {
        'tightest': '-0.06em',
        'tighter': '-0.045em',
        'tight': '-0.03em',
        'snug': '-0.015em',
        'normal': '0',
        'relaxed': '0.015em',
        'wide': '0.03em',
        'wider': '0.06em',
        'widest': '0.12em',
        'widest-xl': '0.15em',
      },
      lineHeight: {
        'tighter': '1.1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
      },
    },
  },
  plugins: [],
}
