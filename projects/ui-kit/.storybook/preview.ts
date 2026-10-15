import type { Preview } from '@storybook/angular-vite';

import '../src/styles/index.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'error' },
  },
};

export default preview;
