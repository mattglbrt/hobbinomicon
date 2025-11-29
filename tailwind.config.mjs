/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'parchment': '#F4ECD8',
        'parchment-dark': '#1a1614',
        'ink': '#1a1614',
        'ink-dark': '#F4ECD8',
      },
      fontFamily: {
        'serif': ['Besley', 'Georgia', 'Garamond', 'serif'],
        'heading': ['"IM Fell DW Pica"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
