/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#2D6A4F',
        },
        selected: {
          bg: '#E8F5EE',
        },
        sos: {
          red: '#e53e3e',
          bg: '#fff0f0',
          border: '#ffaaaa',
        },
        page: '#f9f9f9',
        card: '#ffffff',
        border: '#e0e0e0',
        text: {
          primary: '#111111',
          secondary: '#666666',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 2px 8px rgba(0,0,0,0.08)',
        lg: '0 8px 24px rgba(0,0,0,0.12)',
      },
      keyframes: {
        'sos-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(229, 62, 62, 0.7)' },
          '70%': { boxShadow: '0 0 0 15px rgba(229, 62, 62, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(229, 62, 62, 0)' },
        },
        'sos-blink': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        'sos-pulse': 'sos-pulse 2s infinite',
        'sos-blink': 'sos-blink 1.5s infinite',
      }
    },
  },
  plugins: [],
}
