import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ProficiencySelect } from './proficiency-select';

const meta: Meta<ProficiencySelect> = {
  title: 'Components/Proficiency select',
  component: ProficiencySelect,
  tags: ['autodocs'],
  args: { value: 'INTERMEDIATE', label: 'Java level', disabled: false },
};
export default meta;
type Story = StoryObj<ProficiencySelect>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', { name: 'Java level' });
    await expect(select).toHaveDisplayValue('Intermediate');
    await userEvent.selectOptions(select, 'Expert');
    await expect(select).toHaveDisplayValue('Expert');
  },
};

export const Disabled: Story = { args: { disabled: true } };
