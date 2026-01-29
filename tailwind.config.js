/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        accent: '#0066FF',
        danger: '#DC2626',
        success: '#10B981'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)']
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' }
        },
        floatUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        pulseSoft: 'pulseSoft 2.2s ease-in-out infinite',
        floatUp: 'floatUp 0.8s ease-out both'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,102,255,0.6), 0 10px 30px rgba(0,102,255,0.25)'
      }
    }
  },
  plugins: []
}

