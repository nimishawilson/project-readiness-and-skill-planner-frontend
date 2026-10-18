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

export const Cell: Story = { args: { appearance: 'cell' } };

export const CellHighlighted: Story = { args: { appearance: 'cell', highlighted: true } };

export const CellLevels: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: grid; gap: 8px; width: 160px">
        <app-proficiency-select appearance="cell" label="Not assessed level" value="NOT_ASSESSED" />
        <app-proficiency-select appearance="cell" label="Beginner level" value="BEGINNER" />
        <app-proficiency-select appearance="cell" label="Intermediate level" value="INTERMEDIATE" />
        <app-proficiency-select appearance="cell" label="Expert level" value="EXPERT" />
      </div>`,
  }),
};
