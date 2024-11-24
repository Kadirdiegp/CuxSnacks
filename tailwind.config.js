/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scale-up-down': 'scale-up-down 3s ease-in-out infinite',
        'fade-in-out': 'fade-in-out 3s ease-in-out infinite',
        'rotate-slow': 'rotate 6s linear infinite',
      },
      keyframes: {
        'scale-up-down': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
