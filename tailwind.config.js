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
          'orange-primary': '#FF5F00',
          'blue-dark': '#002D56',
          'blue-light': '#004A8D',
          'gray-dark': '#2C3E50',
          'gray-medium': '#7F8C8D',
          'gray-light': '#F4F4F4',
          white: '#FFFFFF',
          red: '#E74C3C',
          yellow: '#F1C40F',
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
