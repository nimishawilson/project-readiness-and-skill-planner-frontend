import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './badge';

const meta: Meta<Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { variant: 'neutral', emphasis: 'soft' },
  argTypes: {
    variant: { control: 'select', options: ['success', 'warning', 'neutral'] },
    emphasis: { control: 'select', options: ['soft', 'solid', 'outline'] },
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [emphasis]="emphasis">Label</app-badge>`,
  }),
};
export default meta;
type Story = StoryObj<Badge>;

const badge = (label: string, variant: string, emphasis = 'soft') => ({
  template: `<app-badge variant="${variant}" emphasis="${emphasis}">${label}</app-badge>`,
});

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Label')).toBeVisible();
  },
};

export const Success: Story = { render: () => badge('Ready to start', 'success') };
export const Warning: Story = { render: () => badge('Not ready to start', 'warning') };
export const Neutral: Story = { render: () => badge('2026', 'neutral') };
export const OutlineSuccess: Story = { render: () => badge('My team', 'success', 'outline') };
export const SolidWarning: Story = { render: () => badge('+1 needed', 'warning', 'solid') };
export const SolidSuccess: Story = { render: () => badge('Approved', 'success', 'solid') };

export const WithIcon: Story = {
  render: () => ({
    template: `
      <app-badge variant="neutral">
        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 16 16" fill="none"
             stroke="currentColor" stroke-width="2">
          <rect x="3" y="7" width="10" height="7" rx="1.5" />
          <path d="M5 7V5a3 3 0 0 1 6 0v2" />
        </svg>
        View only
      </app-badge>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, max-content); gap: 12px 24px; justify-items: start">
        <app-badge variant="success">Ready to start</app-badge>
        <app-badge variant="success" emphasis="solid">Approved</app-badge>
        <app-badge variant="warning">Awaiting approval</app-badge>
        <app-badge variant="warning" emphasis="solid">+1 needed</app-badge>
        <app-badge variant="neutral">Covered</app-badge>
        <app-badge variant="neutral" emphasis="solid">2026</app-badge>
      </div>`,
  }),
};
