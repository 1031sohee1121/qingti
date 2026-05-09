/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Noto Serif SC', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'sans-serif'],
      },
      colors: {
        cream: '#FAF6F0',
        'cream-light': '#FFFBF5',
        coral: '#D17A5C',
        'coral-light': '#E8956F',
        'coral-pale': '#FFE4D6',
        moss: '#7A9B7E',
        'moss-light': '#A8C4A2',
        ink: '#2C2926',
        'text-soft': '#5C544A',
        'text-muted': '#8A7E6F',
        'border-soft': '#E8B4A0',
      },
    },
  },
  plugins: [],
};
