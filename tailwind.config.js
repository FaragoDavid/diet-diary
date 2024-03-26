const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/components/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        'max-1': 'max-content',
        'max-2': 'max-content max-content',
        'max-3': 'max-content max-content max-content',
        'max-4': 'max-content max-content max-content max-content',
        'max-5': 'max-content max-content max-content max-content max-content',
        'max-6': 'max-content max-content max-content max-content max-content max-content',
      },
      gridTemplateRows: {
        'max-1': 'max-content',
        'max-2': 'max-content max-content',
        'max-3': 'max-content max-content max-content',
        'max-4': 'max-content max-content max-content max-content',
        'max-5': 'max-content max-content max-content max-content max-content',
        'max-6': 'max-content max-content max-content max-content max-content max-content',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['dark'],
  },
};
