import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { GoalCard } from './goal-card';

const meta: Meta<GoalCard> = {
  title: 'Components/Goal card',
  component: GoalCard,
  tags: ['autodocs'],
  args: {
    title: 'Complete Kubernetes for Developers (CKAD prep)',
    description: 'Finish the course and pass the practice exam with 75% or more.',
    assignedDate: '2026-02-10',
    progress: 'COMPLETED',
    approved: false,
    canApprove: true,
    showProgress: true,
    canEditProgress: true,
    approve: fn(),
    sendBack: fn(),
    progressChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <app-goal-card
        style="max-width: 640px"
        [title]="title"
        [description]="description"
        [assignedDate]="assignedDate"
        [progress]="progress"
        [approved]="approved"
        [canApprove]="canApprove"
        [showProgress]="showProgress"
        [canEditProgress]="canEditProgress"
        (approve)="approve()"
        (sendBack)="sendBack()"
        (progressChange)="progressChange($event)"
      />`,
  }),
};
export default meta;
type Story = StoryObj<GoalCard>;

export const AwaitingApproval: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Awaiting approval')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Approve completion' }));
    await expect(args.approve).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Send back' }));
    await expect(args.sendBack).toHaveBeenCalled();
  },
};

export const NotSubmitted: Story = {
  args: { title: 'Lead one architecture review per quarter', description: undefined, progress: 'IN_PROGRESS' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Not submitted')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Completed' }));
    await expect(args.progressChange).toHaveBeenCalledWith('COMPLETED');
  },
};

export const Approved: Story = {
  args: { approved: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Progress is locked after approval.')).toBeVisible();
    await expect(canvas.getByRole('radio', { name: 'Completed' })).toBeDisabled();
  },
};

export const ReadOnly: Story = { args: { canApprove: false, canEditProgress: false } };

export const WithoutProgress: Story = { args: { showProgress: false } };
