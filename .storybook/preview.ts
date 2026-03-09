import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Component Guidelines',
          'Foundation',
          'Form Patterns',
          'Primitives',
          'Form',
          'Layout',
          'Navigation',
          'Data Display',
          'Overlay',
          'Feedback',
          '*',
        ],
      },
    },
  },
  tags: ['autodocs'],
}

export default preview
