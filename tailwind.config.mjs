/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

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
        'serif': ['Besley', '"Besley Fallback"', 'Georgia', 'Garamond', 'serif'],
        'heading': ['"IM Fell DW Pica"', '"IM Fell Fallback"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function({ addComponents }) {
      addComponents({
        // Common image hover effect - use with group class on parent
        '.img-hover': {
          '@apply transition-transform duration-300 group-hover:scale-105': {},
        },
        '.img-hover-slow': {
          '@apply transition-transform duration-500 group-hover:scale-105': {},
        },
      });
    }),
  ],
}
