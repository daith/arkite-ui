import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

// Wordmark: purple rounded square with "A" + "Arkite UI" text
const brandImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="30" viewBox="0 0 150 30">
  <rect width="30" height="30" rx="7" fill="#6a4dff"/>
  <path d="M15 7l7 16h-3.4l-1.5-3.6h-8.2L7.4 23H4l7-16h4zm-2 3.8L10.1 16.6h5.8L13 10.8z" fill="#fff" transform="translate(0.5 0)"/>
  <text x="38" y="21" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="650" fill="#16181d" letter-spacing="-0.3">Arkite UI</text>
</svg>`)

addons.setConfig({
  theme: create({
    base: 'light',

    brandTitle: 'Arkite UI',
    brandUrl: './',
    brandImage,
    brandTarget: '_self',

    colorPrimary: '#6a4dff',
    colorSecondary: '#6a4dff',

    appBg: '#fafafa',
    appContentBg: '#ffffff',
    appPreviewBg: '#ffffff',
    appBorderColor: '#e5e7eb',
    appBorderRadius: 8,

    fontBase: '"Inter", system-ui, -apple-system, sans-serif',
    fontCode: '"JetBrains Mono", ui-monospace, monospace',

    textColor: '#16181d',
    textMutedColor: '#6b7280',
    textInverseColor: '#ffffff',

    barBg: '#ffffff',
    barTextColor: '#6b7280',
    barSelectedColor: '#6a4dff',
    barHoverColor: '#6a4dff',

    inputBg: '#ffffff',
    inputBorder: '#e5e7eb',
    inputTextColor: '#16181d',
    inputBorderRadius: 6,
  }),
})
