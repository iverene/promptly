/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F5F5', ink: '#0A0A0A', secondary: '#5E5E5E', muted: '#8A8A8A', line: '#E4E4E4',
      },
      fontFamily: { sans: ['Inter_400Regular'], medium: ['Inter_500Medium'], semibold: ['Inter_600SemiBold'] },
    },
  },
  plugins: [],
};

