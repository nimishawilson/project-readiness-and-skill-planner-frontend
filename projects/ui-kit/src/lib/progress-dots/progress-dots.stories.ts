import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ProgressDots } from './progress-dots';

const meta: Meta<ProgressDots> = {
  title: 'Components/Progress dots',
  component: ProgressDots,
  tags: ['autodocs'],
  args: { filled: 2, total: 3, label: '2 of 3 goals' },
};
export default meta;
type Story = StoryObj<ProgressDots>;

export const Partial: Story = {};
export const Empty: Story = { args: { filled: 0, label: '0 of 3 goals' } };
export const Full: Story = { args: { filled: 3, label: '3 of 3 goals' } };
