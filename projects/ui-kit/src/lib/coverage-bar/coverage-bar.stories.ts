import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { CoverageBar } from './coverage-bar';

const meta: Meta<CoverageBar> = {
  title: 'Components/Coverage bar',
  component: CoverageBar,
  tags: ['autodocs'],
  args: { expert: 1, intermediate: 1, beginner: 2, total: 6 },
};
export default meta;
type Story = StoryObj<CoverageBar>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img')).toHaveAccessibleName('1 expert, 1 intermediate, 2 beginner');
    await expect(within(canvasElement).getByText('1 Exp · 1 Int · 2 Beg')).toBeVisible();
  },
};

export const Nobody: Story = { args: { expert: 0, intermediate: 0, beginner: 0 } };

export const Everyone: Story = { args: { expert: 3, intermediate: 2, beginner: 1 } };
