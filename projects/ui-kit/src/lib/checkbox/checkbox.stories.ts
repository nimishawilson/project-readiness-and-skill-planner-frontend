import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './checkbox';

const meta: Meta<Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { checked: false, indeterminate: false, label: 'Select Arjun Mehta', disabled: false },
};
export default meta;
type Story = StoryObj<Checkbox>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox', { name: 'Select Arjun Mehta' });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};

export const Checked: Story = { args: { checked: true } };

export const Indeterminate: Story = {
  args: { label: 'Select all' , indeterminate: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('checkbox', { name: 'Select all' })).toBePartiallyChecked();
  },
};

export const Disabled: Story = { args: { disabled: true } };
