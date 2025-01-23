/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'slide-left': 'slide-left 0.2s ease-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('daisyui')
  ],
  daisyui: {
    themes: ['light'],
  },
};
