/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        foreground: '#ffffff',
        primary: '#ff6b35',
        secondary: '#004e89',
        accent: '#f77f00',
      },
    },
  },
  plugins: [],
}
