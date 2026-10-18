import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { Legend } from './legend';

const meta: Meta<Legend> = {
  title: 'Components/Legend',
  component: Legend,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Not assessed', tone: 'empty' },
      { label: 'Beginner', tone: 'soft' },
      { label: 'Intermediate', tone: 'medium' },
      { label: 'Expert', tone: 'strong' },
    ],
  },
};
export default meta;
type Story = StoryObj<Legend>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Intermediate')).toBeVisible();
  },
};
