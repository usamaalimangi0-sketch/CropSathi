/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2f8f4',
          100: '#e1efe6',
          200: '#c4e0ce',
          300: '#99caa9',
          400: '#69ad7f',
          500: '#46915e',
          600: '#34754a',
          700: '#2b5d3c',
          800: '#254a32',
          900: '#1e3e2a',
          950: '#0e2217',
        },
        harvest: {
          50: '#fdfbf6',
          100: '#f9f4e8',
          200: '#f1e6cd',
          300: '#e7d2a7',
          400: '#dcba7a',
          500: '#d1a457',
          600: '#bf8b44',
          700: '#9f6f37',
          800: '#815932',
          900: '#6a4a2c',
        }
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 30px -5px rgba(245, 158, 11, 0.3)',
        'glass': '0 12px 35px 0 rgba(14, 34, 23, 0.07)',
        'glass-hover': '0 16px 45px 0 rgba(14, 34, 23, 0.12)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
