import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { ProficiencyMeter } from './proficiency-meter';

const meta: Meta<ProficiencyMeter> = {
  title: 'Components/Proficiency meter',
  component: ProficiencyMeter,
  tags: ['autodocs'],
  args: { level: 'INTERMEDIATE' },
  argTypes: { level: { control: 'select', options: ['NOT_ASSESSED', 'BEGINNER', 'INTERMEDIATE', 'EXPERT'] } },
};
export default meta;
type Story = StoryObj<ProficiencyMeter>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Intermediate' })).toBeVisible();
  },
};

export const AllLevels: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 8px">
        <app-proficiency-meter level="NOT_ASSESSED" />
        <app-proficiency-meter level="BEGINNER" />
        <app-proficiency-meter level="INTERMEDIATE" />
        <app-proficiency-meter level="EXPERT" />
      </div>`,
  }),
};
