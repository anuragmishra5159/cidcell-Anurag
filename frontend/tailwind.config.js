/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        bg: '#FFFDF5', // Soft cream/beige
        primary: '#1A1A1A', // Dark text/border
        secondary: '#000000', // Deep black
        
        // Bold Accents
        highlight: {
          yellow: '#FFDE59',
          purple: '#C0B6F2',
          blue: '#87CEEB',
          green: '#98FB98',
          pink: '#FFA6C9',
          orange: '#FF914D',
          teal: '#7ED9CE',
        },
      },
      fontFamily: {
        heading: ['Anton', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      borderRadius: {
        'neo': '1.5rem', // 24px - Rounded corners
        'pill': '9999px',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #1A1A1A',
        'neo-lg': '6px 6px 0px 0px #1A1A1A',
        'neo-sm': '2px 2px 0px 0px #1A1A1A',
      },
      transitionProperty: {
        'neo': 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
