import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { EmptyState } from './empty-state';

const meta: Meta<EmptyState> = {
  title: 'Components/Empty state',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    heading: 'Select an employee',
    message: 'Click any row in the list to see their profile, skills and learning goals here.',
    skeleton: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-empty-state [heading]="heading" [message]="message" [skeleton]="skeleton">
        <svg icon width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linejoin="round"><path d="m5 3 14 8-6 2-2 6z" /></svg>
      </app-empty-state>`,
  }),
};
export default meta;
type Story = StoryObj<EmptyState>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Select an employee' })).toBeVisible();
  },
};

export const WithoutSkeleton: Story = { args: { skeleton: false } };
