/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',  // Tailwind blue-600 (for buttons, highlights)
          light: '#3b82f6',    // lighter blue (hover)
          dark: '#1e40af',     // darker blue (active)
        },
        secondary: {
          DEFAULT: '#6b7280',  // Tailwind gray-600 (for text, accents)
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
