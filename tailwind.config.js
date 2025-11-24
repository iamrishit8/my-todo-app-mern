/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // This enables manual light/dark toggling
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        },
        colors: {
          // Custom Zenith Palette
          zenith: {
            50: '#f4f4f5',
            100: '#e4e4e7',
            800: '#27272a',
            900: '#18181b',
            950: '#09090b', // OLED Black
          }
        }
      },
    },
    plugins: [],
  }