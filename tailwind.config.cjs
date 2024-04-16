/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgba(var(${variableName}))`
  }
}

const plugin = require('tailwindcss/plugin')

module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,jsx,js,ts,tsx}', './node_modules/flowbite/**/*.js'],
  darkMode: 'class',
  safelist: [
    'theme-space',
    'theme-dark',
    'theme-light',
    'theme-old-school',
    { pattern: /bg-theme-(success|error|warning|info|base|section)/ },
    { pattern: /text-theme-(success|error|warning|info|base|section|tooling)-panel/ },
    { pattern: /(w-|h-)./ },
  ],
  theme: {
    extend: {
      transitionProperty: {
        right: 'right',
      },
      fontFamily: {
        logo: ['Josefin Slab', 'serif'],
        content: ['Lato', 'sans-serif'],
      },
      fontSize: {
        sm: '0.8rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      colors: {
        primary: withOpacity('--color-primary'),
        section: withOpacity('--color-bg-content-section'),
        tooling: withOpacity('--color-bg-tooling'),
        info: withOpacity('--color-bg-panel-info'),
        success: withOpacity('--color-bg-panel-success'),
        warning: withOpacity('--color-bg-panel-warning'),
        error: withOpacity('--color-bg-panel-error'),
        inverted: withOpacity('--color-text-base'),
        input: withOpacity('--color-bg-input'),
      },
      textColor: {
        theme: {
          primary: withOpacity('--color-primary'),
          base: withOpacity('--color-text-base'),
          muted: withOpacity('--color-text-muted'),
          inverted: withOpacity('--color-text-inverted'),
          tooling: withOpacity('--color-text-tooling'),
          section: withOpacity('--color-bg-content-section'),
          input: withOpacity('--color-text-input'),
          info: withOpacity('--color-text-info'),
          success: withOpacity('--color-text-success'),
          warning: withOpacity('--color-text-warning'),
          error: withOpacity('--color-text-error'),
          'info-panel': withOpacity('--color-text-panel-info'),
          'success-panel': withOpacity('--color-text-panel-success'),
          'warning-panel': withOpacity('--color-text-panel-warning'),
          'error-panel': withOpacity('--color-text-panel-error'),
          'tooling-panel': withOpacity('--color-text-tooling'),
        },
      },
      backgroundColor: {
        theme: {
          base: withOpacity('--color-bg-content-base'),
          section: withOpacity('--color-bg-content-section'),
          'section-hover': withOpacity('--color-bg-content-section-hover'),
          tooling: withOpacity('--color-bg-tooling'),
          neutral: withOpacity('--color-text-base'),
          primary: withOpacity('--color-primary'),
          info: withOpacity('--color-bg-panel-info'),
          success: withOpacity('--color-bg-panel-success'),
          warning: withOpacity('--color-bg-panel-warning'),
          error: withOpacity('--color-bg-panel-error'),
          inverted: withOpacity('--color-text-base'),
          input: withOpacity('--color-bg-input'),
        },
      },
      ringColor: {
        theme: {
          base: withOpacity('--color-bg-content-base'),
          section: withOpacity('--color-bg-content-section'),
          'section-hover': withOpacity('--color-bg-content-section-hover'),
          tooling: withOpacity('--color-bg-tooling'),
          primary: withOpacity('--color-primary'),
          info: withOpacity('--color-text-info'),
          success: withOpacity('--color-text-success'),
          warning: withOpacity('--color-text-warning'),
          error: withOpacity('--color-text-error'),
        },
      },
      borderColor: {
        theme: {
          primary: withOpacity('--color-primary'),
          base: withOpacity('--color-text-base'),
          muted: withOpacity('--color-text-muted'),
          inverted: withOpacity('--color-text-inverted'),
          tooling: withOpacity('--color-bg-tooling'),
          'tooling-text': withOpacity('--color-text-tooling'),
          'input-text': withOpacity('--color-text-input'),
        },
      },
      textDecorationColor: {
        theme: {
          primary: withOpacity('--color-primary'),
          base: withOpacity('--color-text-base'),
          muted: withOpacity('--color-text-muted'),
          inverted: withOpacity('--color-text-inverted'),
          tooling: withOpacity('--color-text-tooling'),
          section: withOpacity('--color-bg-content-section'),
        },
      },
      ringOffsetColor: {
        theme: {
          primary: withOpacity('--color-primary'),
          section: withOpacity('--color-bg-content-section'),
          base: withOpacity('--color-bg-content-base'),
          tooling: withOpacity('--color-bg-tooling'),
          info: withOpacity('--color-bg-panel-info'),
          success: withOpacity('--color-bg-panel-success'),
          warning: withOpacity('--color-bg-panel-warning'),
          error: withOpacity('--color-bg-panel-error'),
        },
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/forms'),
    plugin(function ({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus']) // custom hover and focus variant
      addVariant('hovus', ['&:hover', '&:focus-visible']) // custom hover and focus-visible variant
    }),
  ],
}
