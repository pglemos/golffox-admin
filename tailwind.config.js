/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './views/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        golffox: {
          base: '#050508',
          foreground: '#f4f7fb',
          muted: 'rgba(244,247,251,0.62)',
          surface: 'rgba(13,16,24,0.55)',
          'surface-strong': 'rgba(18,22,31,0.85)',
          'orange-primary': '#FF5F00',
          'blue-dark': '#0f172a',
          'blue-light': '#1e293b',
          'gray-dark': '#e2e8f0',
          'gray-medium': 'rgba(226,232,240,0.7)',
          'gray-light': 'rgba(148,163,184,0.14)',
          white: '#ffffff',
          red: '#ff4757',
          yellow: '#ffc857',
        },
        primary: '#5B2EFF',
        secondary: '#00E0FF',
        accent: '#FFD700',
        dark: '#0A0A0A',
        light: '#F5F5F7',
        neutral: '#D1D5DB',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#38BDF8',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
