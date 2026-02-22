/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'fluid-xs': ['clamp(0.75rem, 0.65rem + 0.4vw, 0.875rem)', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'fluid-sm': ['clamp(0.875rem, 0.75rem + 0.5vw, 1rem)', { lineHeight: '1.5', letterSpacing: '-0.015em' }],
        'fluid-base': ['clamp(1rem, 0.9rem + 0.4vw, 1.125rem)', { lineHeight: '1.5', letterSpacing: '-0.011em' }],
        'fluid-lg': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        'fluid-xl': ['clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        'fluid-2xl': ['clamp(2.25rem, 2rem + 2.5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        'fluid-3xl': ['clamp(3.5rem, 2.75rem + 3.75vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.05em' }],
        'fluid-4xl': ['clamp(4.5rem, 3.5rem + 5vw, 9rem)', { lineHeight: '0.95', letterSpacing: '-0.06em' }],
      },
      letterSpacing: {
        'tighter-2xl': '-0.075em',
        'tighter-extra': '-0.06em',
        tighter: '-0.045em',
        tight: '-0.025em',
        normal: '-0.011em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.08em',
        'widest-xl': '0.15em',
      },
      lineHeight: {
        'extra-tight': '1.1',
        'super-tight': '1',
        'heading': '1.2',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'text-reveal': 'text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
