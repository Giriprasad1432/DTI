/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'float':      'float 5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'blink':      'blink 1.5s ease-in-out infinite',
        'slide-up':   'slideUp 0.3s ease',
        'card-in':    'cardIn 0.4s ease',
        'arrow-pulse':'arrowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from:{ opacity:0, transform:'translateY(40px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn:   { from:{ opacity:0 }, to:{ opacity:1 } },
        float:    { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-18px)' } },
        blink:    { '0%,100%':{ opacity:1 }, '50%':{ opacity:0.3 } },
        slideUp:  { from:{ opacity:0, transform:'translateY(16px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        cardIn:   { from:{ opacity:0, transform:'translateY(20px) scale(0.98)' }, to:{ opacity:1, transform:'translateY(0) scale(1)' } },
        arrowPulse:{ '0%,100%':{ transform:'translateX(0)', opacity:0.4 }, '50%':{ transform:'translateX(6px)', opacity:0.8 } },
      }
    },
  },
  plugins: [],
}
