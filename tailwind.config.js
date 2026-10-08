/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      fontFamily: { sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'] },
      colors: {
        bg: '#F7F8F5',
        surface: '#FFFFFF',
        brand: { DEFAULT: '#294C3A', 600: '#52735D', 100: '#DDE8DE', 50: '#EEF3EE' },
        ink: { DEFAULT: '#18221C', muted: '#68736C', subtle: '#9AA39D' },
        line: '#E6E9E3',
        gold: { DEFAULT: '#C6A76A', 50: '#F7F1E4' },
        danger: '#B4483C',
      },
      borderRadius: { xl: '0.875rem', '2xl': '1.125rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(24,34,28,0.04), 0 4px 16px -8px rgba(24,34,28,0.08)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: { 'fade-in': 'fade-in .25s ease-out both' },
    },
  },
  plugins: [],
}
