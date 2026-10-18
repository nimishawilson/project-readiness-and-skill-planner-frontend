import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Callout } from './callout';

const meta: Meta<Callout> = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <app-callout [variant]="variant">
        <svg icon width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M12 8v5M12 16.5v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <strong>Yearly limit reached.</strong> Arjun already has 3 goals for 2026.
      </app-callout>`,
  }),
};
export default meta;
type Story = StoryObj<Callout>;

export const Info: Story = { args: { variant: 'info' } };
export const Warning: Story = { args: { variant: 'warning' } };
