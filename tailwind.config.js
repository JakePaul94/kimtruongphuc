/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#187c19',
        secondary: '#FF6347',
        'soft-gray': '#f5f5f5',
      },
    },
  },
  plugins: [],
};
