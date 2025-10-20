/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--bg-primary)',
        'app-secondary': 'var(--bg-secondary)',
        'app-accent': 'var(--accent)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Отключаем reset чтобы не конфликтовало с нашими стилями
  }
}

