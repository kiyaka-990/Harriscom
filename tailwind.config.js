/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1B2B6B',
        'navy-dark': '#0F1A44',
        'navy-light': '#2A3D8F',
        crimson: '#D42B2B',
        'crimson-light': '#E85555',
        emerald: '#2D8C4E',
        'emerald-light': '#3DAF64',
        amber: '#F5A623',
        'amber-light': '#FFBE50',
        violet: '#6B3FA0',
        'violet-light': '#8B5FC0',
        teal: '#1A7A9A',
        'teal-light': '#2A9ABF',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
}
