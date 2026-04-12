import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#904824',
        'primary-container': '#ae603a',
        'on-primary': '#ffffff',
        'primary-fixed': '#ffdbcd',
        'on-primary-fixed': '#351000',
        secondary: '#7b5548',
        'secondary-container': '#ffccbb',
        'on-secondary-container': '#7a5447',
        'on-secondary': '#ffffff',
        tertiary: '#685a42',
        'tertiary-container': '#817359',
        'on-tertiary': '#ffffff',
        surface: '#fff8f2',
        'surface-dim': '#e0d9cf',
        'surface-bright': '#fff8f2',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#fbf2e8',
        'surface-container': '#f5ede3',
        'surface-container-high': '#efe7dd',
        'surface-container-highest': '#e9e1d8',
        'on-surface': '#1e1b15',
        'on-surface-variant': '#54433c',
        outline: '#87736b',
        'outline-variant': '#dac1b8',
        'inverse-surface': '#343029',
        'inverse-on-surface': '#f8f0e6',
        error: '#ba1a1a',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      transitionTimingFunction: {
        craft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
