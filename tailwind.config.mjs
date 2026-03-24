/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';

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
        'serif': ['var(--font-besley)', 'Georgia', 'Garamond', 'serif'],
        'heading': ['var(--font-imfell)', 'Georgia', 'serif'],
        'display': ['var(--font-cinzel)', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
      },
    },
  },
  plugins: [
    typography,
    plugin(function({ addComponents, addUtilities }) {
      addComponents({
        // Common image hover effect - use with group class on parent
        '.img-hover': {
          '@apply transition-transform duration-300 group-hover:scale-105': {},
        },
        '.img-hover-slow': {
          '@apply transition-transform duration-500 group-hover:scale-105': {},
        },
      });
      addUtilities({
        // Scroll reveal - elements start hidden, animate in when .revealed is added
        '[data-scroll-reveal]': {
          opacity: '0',
          transform: 'translateY(30px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        },
        '[data-scroll-reveal].revealed': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      });
    }),
  ],
}
