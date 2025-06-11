/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#87CEEB',
        secondary: '#98FB98', 
        accent: '#FFB6C1',
        surface: '#FFF8DC',
        background: '#FAFAFA',
        success: '#90EE90',
        warning: '#FFE4B5',
        error: '#FFA07A',
        info: '#B0C4DE',
        underweight: '#E6F3FF',
        normal: '#E6FFE6',
        overweight: '#FFF2E6',
        obese: '#FFE6E6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(135, 206, 235, 0.3)'
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide': 'slide 200ms ease-out'
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'slide': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}