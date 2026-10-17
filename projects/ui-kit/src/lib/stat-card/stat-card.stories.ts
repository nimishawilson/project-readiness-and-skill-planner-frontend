import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { StatCard } from './stat-card';

const meta: Meta<StatCard> = {
  title: 'Components/Stat card',
  component: StatCard,
  tags: ['autodocs'],
  args: { value: 3, label: 'Awaiting approval', variant: 'warning' },
  argTypes: {
    variant: { control: 'select', options: ['warning', 'accent', 'neutral', 'primary'] },
  },
};
export default meta;
type Story = StoryObj<StatCard>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('3')).toBeVisible();
    await expect(canvas.getByText('Awaiting approval')).toBeVisible();
  },
};

export const Accent: Story = { args: { value: 3, label: 'In progress', variant: 'accent' } };
export const Neutral: Story = { args: { value: 1, label: 'Not started', variant: 'neutral' } };
export const Primary: Story = { args: { value: 2, label: 'Approved', variant: 'primary' } };
export const Zero: Story = { args: { value: 0 } };
export const Placeholder: Story = { args: { value: '—' } };

export const LongLabel: Story = {
  args: { label: 'Awaiting approval from your manager this quarter' },
  render: (args) => ({
    props: args,
    template: `<div style="width: 160px"><app-stat-card [value]="value" [label]="label" [variant]="variant" /></div>`,
  }),
};

export const InARow: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px">
        <app-stat-card [value]="3" label="Awaiting approval" variant="warning" />
        <app-stat-card [value]="3" label="In progress" variant="accent" />
        <app-stat-card [value]="1" label="Not started" variant="neutral" />
        <app-stat-card [value]="2" label="Approved" variant="primary" />
      </div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Approved')).toBeVisible();
    await expect(canvas.getByText('Not started')).toBeVisible();
  },
};
