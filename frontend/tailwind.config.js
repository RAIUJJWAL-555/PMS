/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arctic':   { DEFAULT: '#F1F6F4' },
        'mint':     { DEFAULT: '#D9E8E2' },
        'forsytha': { DEFAULT: '#FFC801' },
        'saffron':  { DEFAULT: '#FF9932' },
        'nocturnal':{ DEFAULT: '#114C5A' },
        'oceanic':  { DEFAULT: '#172B36' },
      },
      boxShadow: {
        'clay':        '8px 8px 20px rgba(23,43,54,0.15), -4px -4px 12px rgba(255,255,255,0.9)',
        'clay-inset':  'inset 3px 3px 8px rgba(23,43,54,0.1), inset -1px -1px 4px rgba(255,255,255,0.95)',
        'clay-yellow': '4px 4px 12px rgba(255,200,1,0.4), -2px -2px 6px rgba(255,255,255,0.9)',
        'clay-teal':   '4px 4px 12px rgba(17,76,90,0.3), -2px -2px 6px rgba(255,255,255,0.9)',
        'clay-active': 'inset 2px 2px 6px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
