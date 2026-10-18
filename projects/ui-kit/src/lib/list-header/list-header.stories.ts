import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { ListHeader } from './list-header';

const meta: Meta<ListHeader> = {
  title: 'Components/List header',
  component: ListHeader,
  tags: ['autodocs'],
  args: { columns: ['Employee', 'Department', 'Access'], template: '1fr 120px 100px' },
};
export default meta;
type Story = StoryObj<ListHeader>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Department')).toBeVisible();
  },
};
