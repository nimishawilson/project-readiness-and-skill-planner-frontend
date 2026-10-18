import type { Meta, StoryObj } from '@storybook/angular-vite';
import { HeadcountMeter } from './headcount-meter';

const meta: Meta<HeadcountMeter> = {
  title: 'Components/Headcount meter',
  component: HeadcountMeter,
  tags: ['autodocs'],
  args: { filled: 1, required: 2 },
};
export default meta;
type Story = StoryObj<HeadcountMeter>;

export const ShortOfTarget: Story = {};
export const Covered: Story = { args: { filled: 2, required: 2 } };
export const Nobody: Story = { args: { filled: 0, required: 3 } };
