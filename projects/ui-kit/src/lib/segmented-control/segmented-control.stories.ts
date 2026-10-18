import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SegmentedControl } from './segmented-control';

const meta: Meta<SegmentedControl> = {
  title: 'Components/Segmented control',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    label: 'Progress',
    value: 'IN_PROGRESS',
    options: [
      { value: 'NOT_STARTED', label: 'Not started' },
      { value: 'IN_PROGRESS', label: 'In progress' },
      { value: 'COMPLETED', label: 'Completed' },
    ],
  },
};
export default meta;
type Story = StoryObj<SegmentedControl>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'In progress' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(canvas.getByRole('radio', { name: 'Completed' }));
    await expect(canvas.getByRole('radio', { name: 'Completed' })).toHaveAttribute('aria-checked', 'true');
  },
};

export const Disabled: Story = {
  args: { value: 'COMPLETED', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Completed' })).toBeDisabled();
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('radio', { name: 'In progress' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    const last = canvas.getByRole('radio', { name: 'Completed' });
    await expect(last).toHaveAttribute('aria-checked', 'true');
    await expect(last).toHaveFocus();
  },
};
