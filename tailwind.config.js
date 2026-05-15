/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**', './src/**/*.js', './public/**/*'],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          light: '#DCF8C6',
          hover: '#1DA851',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};