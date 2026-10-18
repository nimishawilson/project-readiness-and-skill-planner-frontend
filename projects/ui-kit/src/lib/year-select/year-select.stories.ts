import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { YearSelect } from './year-select';

const meta: Meta<YearSelect> = {
  title: 'Components/Year select',
  component: YearSelect,
  tags: ['autodocs'],
  args: { years: [2025, 2026, 2027], value: 2026, label: 'Goal year' },
};
export default meta;
type Story = StoryObj<YearSelect>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByLabelText('Goal year');
    await userEvent.selectOptions(select, '2027');
    await expect(select).toHaveValue('2027');
  },
};
