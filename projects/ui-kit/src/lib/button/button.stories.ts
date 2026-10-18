import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { variant: 'primary', size: 'md', iconOnly: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  render: (args) => ({
    props: args,
    template: `<button app-button [variant]="variant" [size]="size">Approve</button>`,
  }),
};
export default meta;
type Story = StoryObj<Button>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Approve' })).toBeVisible();
  },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center">
        <button app-button variant="primary">Approve</button>
        <button app-button variant="outline">Send back</button>
        <button app-button variant="ghost">Cancel</button>
        <button app-button variant="primary" disabled>Add skill</button>
      </div>`,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    template: `
      <button app-button variant="ghost" [iconOnly]="true" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>`,
  }),
};
