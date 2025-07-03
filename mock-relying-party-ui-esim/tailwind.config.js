/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#017DC0',
        'brand-blue-dark': '#017DC0',
      },
      fontFamily: {
        // 👇 These are your custom typography tokens
        display: ['"Segoe UI"', 'sans-serif'], // for headings
        body: ['"Segoe UI"', 'sans-serif'],    // for body text
        segoe: ['Segoe UI', 'sans-serif'],     // (kept for legacy support)
      },
      spacing: {
        '15': '3.75rem', // 60px
        '18': '4.5rem',  // 72px
        '58': '14.5rem', // 232px
      },
      maxWidth: {
        '1/2': '50%',
      },
      zIndex: {
        '999': '999',
        '1000': '1000',
      },
      screens: {
        'md': { max: '768px' },
      },
      inset: {
        '15': '3.75rem',
      }
    },
  },
  plugins: [],
}
