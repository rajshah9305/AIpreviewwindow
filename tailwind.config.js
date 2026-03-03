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
          DEFAULT: '#f97316',
        },
        brand: {
          primary: '#f97316',
          dark: '#000000',
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
        'widest-xl': '0.18em',
      },
      lineHeight: {
        'tighter': '1.1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
      },
      boxShadow: {
        'premium': '0 4px 12px rgba(0,0,0,0.08)',
        'premium-lg': '0 8px 32px rgba(0,0,0,0.06)',
        'premium-xl': '0 16px 64px rgba(0,0,0,0.08)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 0 20px 0 rgba(249, 115, 22, 0.05)',
      },
      animation: {
        'slide-up': 'slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'text-reveal-up': 'text-reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'float-subtle': 'float-subtle 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'loading-bar': 'loading-bar 2s infinite ease-in-out',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'text-reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(249, 115, 22, 0.2)' },
          '50%': { 'box-shadow': '0 0 40px rgba(249, 115, 22, 0.4)' },
        },
        'loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
