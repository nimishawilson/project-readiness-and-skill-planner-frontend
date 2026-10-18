import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { GoalCard } from './goal-card';

const meta: Meta<GoalCard> = {
  title: 'Components/Goal card',
  component: GoalCard,
  tags: ['autodocs'],
  args: {
    title: 'Complete Kubernetes for Developers (CKAD prep)',
    targetDate: '2026-10-31',
    completedDate: '2026-10-09',
    progress: 'COMPLETED',
    approved: false,
    canApprove: true,
    approve: fn(),
    sendBack: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <app-goal-card
        style="max-width: 420px"
        [title]="title"
        [targetDate]="targetDate"
        [completedDate]="completedDate"
        [progress]="progress"
        [approved]="approved"
        [canApprove]="canApprove"
        (approve)="approve()"
        (sendBack)="sendBack()"
      />`,
  }),
};
export default meta;
type Story = StoryObj<GoalCard>;

export const NeedsApproval: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Completed · needs approval')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Approve' }));
    await expect(args.approve).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Send back' }));
    await expect(args.sendBack).toHaveBeenCalled();
  },
};

export const InProgress: Story = {
  args: { title: 'Lead one architecture review per quarter', targetDate: '2026-12-15', completedDate: undefined, progress: 'IN_PROGRESS' },
};

export const Approved: Story = { args: { approved: true } };

export const ReadOnlyManager: Story = { args: { canApprove: false } };
