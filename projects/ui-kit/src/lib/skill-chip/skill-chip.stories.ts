import type { Meta, StoryObj } from '@storybook/angular-vite';
import { SkillChip } from './skill-chip';

const meta: Meta<SkillChip> = {
  title: 'Components/Skill chip',
  component: SkillChip,
  tags: ['autodocs'],
  args: { skill: 'Java', level: 'EXPERT', met: false },
};
export default meta;
type Story = StoryObj<SkillChip>;

export const Default: Story = {};
export const Met: Story = { args: { met: true } };
