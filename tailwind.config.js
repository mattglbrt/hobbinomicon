/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B91C1C',  // Tailwind blue-600
          light: '#3b82f6',
          dark: '#1e40af',
          hover: '#ffffff'
        },
        secondary: {
          DEFAULT: '#6b7280',  // Tailwind gray-600
        },
        body: '#404040',
      },
      fontFamily: {
        sans: ['"Libre Baskerville"', 'serif'], // <-- Make sans = Libre
      },
    },
  },
  plugins: [],
}
