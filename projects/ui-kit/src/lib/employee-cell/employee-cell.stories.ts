import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { CountBadge } from '../count-badge/count-badge';
import { EmployeeCell } from './employee-cell';

const meta: Meta<EmployeeCell> = {
  title: 'Components/Employee cell',
  component: EmployeeCell,
  tags: ['autodocs'],
  args: { name: 'Arjun Mehta', title: 'Senior Software Engineer', size: 'md' },
  argTypes: { size: { control: 'select', options: ['sm', 'md'] } },
};
export default meta;
type Story = StoryObj<EmployeeCell>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Arjun Mehta')).toBeVisible();
    await expect(canvas.getByText('Senior Software Engineer')).toBeVisible();
    // The avatar is decorative: the name is only exposed once, as text.
    await expect(canvas.queryByRole('img')).toBeNull();
  },
};

export const Small: Story = { args: { size: 'sm' } };

export const WithoutTitle: Story = { args: { title: undefined } };

export const WithTrailingContent: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-employee-cell [name]="name" [title]="title" [size]="size">
        <app-count-badge [count]="1" label="goal awaiting approval" />
      </app-employee-cell>`,
    moduleMetadata: { imports: [CountBadge] },
  }),
};

export const LongText: Story = {
  args: {
    name: 'Alexandria Montgomery-Featherstonehaugh',
    title: 'Principal Staff Software Engineer, Platform Infrastructure',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 180px">
        <app-employee-cell [name]="name" [title]="title" [size]="size" />
      </div>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Alexandria Montgomery-Featherstonehaugh')).toHaveAttribute(
      'title',
      'Alexandria Montgomery-Featherstonehaugh',
    );
  },
};

export const InList: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 14px">
        <app-employee-cell name="Arjun Mehta" title="Senior Software Engineer" [size]="size" />
        <app-employee-cell name="Kavya Reddy" title="Software Engineer" [size]="size" />
        <app-employee-cell name="Rahul Iyer" title="Frontend Engineer" [size]="size" />
      </div>`,
  }),
};
