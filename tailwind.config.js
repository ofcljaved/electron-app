/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '@media print': {
          '-webkit-print-color-adjust': 'exact',
        },
      });
    },
  ],
};
