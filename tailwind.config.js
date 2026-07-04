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
        // Static accent colors (opacity variants needed so keep as hex)
        primary: {
          DEFAULT: '#7C6CF3',
          dark: '#5B4FD4',
          light: '#A89CF5',
        },
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        // Semantic tokens — driven by CSS variables in index.css
        background: { DEFAULT: 'var(--color-bg)' },
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          hover: 'var(--color-surface-hover)',
        },
        border: { DEFAULT: 'var(--color-border)' },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 40px rgba(0,0,0,0.12)',
        'premium-hover': '0 12px 60px rgba(0,0,0,0.2)',
        'glow': '0 0 30px rgba(124,108,243,0.25)',
        'glow-strong': '0 0 50px rgba(124,108,243,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
