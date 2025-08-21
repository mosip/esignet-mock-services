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
        'heading-color': '#1C3C50', // for "Congratulations!"
        'subtext-color': '#4B5E6C', // for paragraph text
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        display: ['"Segoe UI"', 'sans-serif'],
        body: ['"Segoe UI"', 'sans-serif'],
        segoe: ['Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'sm-text': ['16px', '100%'], // mobile subtext
        'md-text': ['18px', '100%'], // desktop subtext
        'lg-heading': ['32px', '100%'], // mobile heading
        'xl-heading': ['36px', '100%'], // desktop heading
      },
      spacing: {
        '15': '3.75rem', // 60px
        '18': '4.5rem',  // 72px
        '58': '14.5rem', // 232px
      },
      maxWidth: {
        '1/2': '50%',
        'md-card': '28rem', // 448px max width for card
      },
      zIndex: {
        '999': '999',
        '1000': '1000',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        xl: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      screens: {
        'md': { max: '768px' }, // custom mobile breakpoint
      }
    },
  },
  plugins: [],
}
