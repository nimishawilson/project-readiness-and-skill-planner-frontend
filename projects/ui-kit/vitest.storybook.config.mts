import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { storybookAngularVitest } from '@storybook/angular-vite/vitest';

const configDir = path.join(import.meta.dirname, '.storybook');

// Runs every *.stories.ts as a test. Kept apart from the `ng test` setup.
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [storybookAngularVitest({ zoneless: true }), storybookTest({ configDir })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
