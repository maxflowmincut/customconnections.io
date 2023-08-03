module.exports = {
  mode: 'jit',
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        '320': '320px',
        '200': '200px',
        '150': '150px',
        '70': '70px',
        '80': '80px',
      },
      maxWidth: {
        '200': '200px',
        '150': '150px',
      },
      keyframes: {
        'fast-shake': {
          '0%, 100%': { transform: 'translateX(-1px)' },
          '50%': { transform: 'translateX(1px)' },
        },
        bounceOnce: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '50%': { transform: 'translateY(0)', opacity: '1' },
          '80%': { transform: 'translateY(-10px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fast-shake': 'fast-shake 0.05s linear infinite',
        'bounceOnce': 'bounceOnce 2s cubic-bezier(.5,1.3,1,.9)',
        'fadeOut': 'fadeOut 1s ease-in-out forwards',
      },
      colors: {
        'custom-gray': '#5A594E',
        'custom-light': '#EFEFE6',
        'game-yellow': '#FBD400',
        'game-green': '#B5E352',
        'game-blue': '#729EEB',
        'game-purple': '#BC70C4',
      },
    },
  },
  plugins: [],
};