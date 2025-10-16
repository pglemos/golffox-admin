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
          'white': '#FFFFFF',
          'red': '#E74C3C',
          'yellow': '#F1C40F',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}