import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { PageHeader } from './page-header';
import { StatCard } from '../stat-card/stat-card';

const meta: Meta<PageHeader> = {
  title: 'Components/Page header',
  component: PageHeader,
  tags: ['autodocs'],
  args: { heading: 'Employees', subtitle: 'Review skills and learning goals.' },
};
export default meta;
type Story = StoryObj<PageHeader>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('heading', { name: 'Employees' })).toBeVisible();
  },
};

export const WithActions: Story = {
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [StatCard] },
    template: `
      <app-page-header [heading]="heading" [subtitle]="subtitle">
        <app-stat-card actions [value]="6" label="on my team" variant="primary" />
        <app-stat-card actions [value]="3" label="goals awaiting approval" variant="warning" />
      </app-page-header>`,
  }),
};
