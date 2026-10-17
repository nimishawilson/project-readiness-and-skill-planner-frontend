import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FilterChips } from './filter-chips';

const meta: Meta<FilterChips> = {
  title: 'Components/Filter chips',
  component: FilterChips,
  tags: ['autodocs'],
  args: {
    label: 'Filter team',
    options: [
      { value: 'all', label: 'All' },
      { value: 'awaiting', label: 'Awaiting approval' },
      { value: 'open', label: 'Has open slots' },
    ],
  },
};
export default meta;
type Story = StoryObj<FilterChips>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(canvas.getByRole('radio', { name: 'Awaiting approval' }));
    await expect(canvas.getByRole('radio', { name: 'Awaiting approval' })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'false');
  },
};

export const Projects: Story = {
  args: {
    label: 'Filter projects',
    options: [
      { value: 'all', label: 'All' },
      { value: 'ready', label: 'Ready to start' },
      { value: 'notReady', label: 'Not ready' },
    ],
  },
};

export const Preselected: Story = { args: { value: 'open' } };

export const WithCounts: Story = {
  args: {
    options: [
      { value: 'all', label: 'All', count: 6 },
      { value: 'awaiting', label: 'Awaiting approval', count: 2 },
      { value: 'open', label: 'Has open slots', count: 4 },
    ],
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('radio', { name: 'All' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    const second = canvas.getByRole('radio', { name: 'Awaiting approval' });
    await expect(second).toHaveAttribute('aria-checked', 'true');
    await expect(second).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('radio', { name: 'Has open slots' })).toHaveFocus();
  },
};

export const Departments: Story = {
  args: {
    label: 'Filter by department',
    options: ['All', 'Engineering', 'Design', 'Quality Assurance', 'Product', 'Data', 'Platform', 'Security'].map(
      (label) => ({ value: label.toLowerCase(), label }),
    ),
  },
  render: (args) => ({
    props: args,
    template: `<div style="width: 300px"><app-filter-chips [label]="label" [options]="options" /></div>`,
  }),
};
