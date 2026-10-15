import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { EmployeeCell } from '../employee-cell/employee-cell';
import { CountBadge } from './count-badge';

const meta: Meta<CountBadge> = {
  title: 'Components/Count badge',
  component: CountBadge,
  tags: ['autodocs'],
  args: { count: 3, max: 99, label: 'goals awaiting approval' },
};
export default meta;
type Story = StoryObj<CountBadge>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('3', { selector: '[aria-hidden]' })).toBeVisible();
    await expect(canvas.getByText('3 goals awaiting approval')).toBeInTheDocument();
  },
};

export const SingleDigit: Story = { args: { count: 1 } };
export const DoubleDigit: Story = { args: { count: 42 } };

export const Overflow: Story = {
  args: { count: 150 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('99+', { selector: '[aria-hidden]' }),
    ).toBeVisible();
  },
};

export const Zero: Story = {
  args: { count: 0 },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('app-count-badge')).toHaveAttribute('hidden');
  },
};

export const NextToName: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-employee-cell name="Arjun Mehta" title="Senior Software Engineer">
        <app-count-badge [count]="count" [max]="max" [label]="label" />
      </app-employee-cell>`,
    moduleMetadata: { imports: [EmployeeCell] },
  }),
  args: { count: 1 },
};
