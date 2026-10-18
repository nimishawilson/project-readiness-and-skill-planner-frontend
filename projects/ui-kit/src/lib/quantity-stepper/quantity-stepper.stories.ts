import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { QuantityStepper } from './quantity-stepper';

const meta: Meta<QuantityStepper> = {
  title: 'Components/Quantity stepper',
  component: QuantityStepper,
  tags: ['autodocs'],
  args: { value: 2, label: 'Angular people needed', min: 1, max: 5, disabled: false },
};
export default meta;
type Story = StoryObj<QuantityStepper>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase Angular people needed' }));
    await expect(canvas.getByText('3')).toBeVisible();
  },
};

export const AtMinimum: Story = {
  args: { value: 1 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Decrease Angular people needed' })).toBeDisabled();
  },
};

export const Disabled: Story = { args: { disabled: true } };
