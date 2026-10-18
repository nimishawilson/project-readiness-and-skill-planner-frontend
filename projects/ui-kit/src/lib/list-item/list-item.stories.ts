import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ListItem } from './list-item';
import { ListHeader } from '../list-header/list-header';

const meta: Meta<ListItem> = {
  title: 'Components/List item',
  component: ListItem,
  tags: ['autodocs'],
  args: { selected: false, template: '1fr 120px', activate: fn() },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [ListHeader] },
    template: `
      <app-list-header [columns]="['Name', 'Department']" template="1fr 120px" />
      <app-list-item [selected]="selected" [template]="template" (activate)="activate()">
        <span>Arjun Mehta</span><span>Engineering</span>
      </app-list-item>
      <app-list-item [template]="template"><span>Kavya Reddy</span><span>Engineering</span></app-list-item>`,
  }),
};
export default meta;
type Story = StoryObj<ListItem>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getAllByRole('button')[0]);
    await expect(args.activate).toHaveBeenCalled();
  },
};

export const Selected: Story = { args: { selected: true } };
