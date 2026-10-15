import type { Preview } from '@storybook/angular-vite';

// Import the design tokens here once src/styles/index.scss has content.
const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'error' },
  },
};

export default preview;
