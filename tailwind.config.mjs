/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'parchment': '#F4ECD8',
        'ink': '#1a1614',
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
