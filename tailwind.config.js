/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B1F3A',
          2:       '#1A2F4E',
        },
        paper: {
          DEFAULT: '#F7F4EE',
          2:       '#EFEAE0',
        },
        card:    '#FFFFFF',
        rule: {
          DEFAULT: '#E2DCCE',
          strong:  '#C9C0AC',
        },
        muted: {
          DEFAULT: '#5B6577',
          2:       '#8A93A3',
        },
        coral: {
          DEFAULT: '#D9603B',
          ink:     '#B14A28',
        },
        sage: {
          DEFAULT: '#4F7060',
          tint:    '#E8EFE9',
        },
        amber: {
          DEFAULT: '#B5802A',
          tint:    '#F4ECD7',
        },
        crimson: {
          DEFAULT: '#A8341F',
          tint:    '#F4E1DC',
        },
        info: {
          DEFAULT: '#2F4F7A',
          tint:    '#E2EAF3',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
        sans:  ['Inter', '-apple-system', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
      spacing: {
        section:    '96px',
        sectionSm:  '64px',
        container:  '1200px',
        gutter:     '32px',
      },
      borderRadius: {
        xs:   '4px',
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        pill: '999px',
      },
      maxWidth: {
        container: '1200px',
      },
      letterSpacing: {
        eyebrow: '0.14em',
      },
      lineHeight: {
        h1:   '1.04',
        h2:   '1.10',
        h3:   '1.25',
        body: '1.55',
        faq:  '1.65',
      },
      fontSize: {
        stat: ['44px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '420' }],
      },
    },
  },
  plugins: [],
}
