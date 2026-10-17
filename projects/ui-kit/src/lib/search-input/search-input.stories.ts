import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { SearchInput } from './search-input';

const meta: Meta<SearchInput> = {
  title: 'Components/Search input',
  component: SearchInput,
  tags: ['autodocs'],
  args: { label: 'Search my team', placeholder: 'Search my team', searchChange: fn() },
};
export default meta;
type Story = StoryObj<SearchInput>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search my team' });
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull();
    await userEvent.type(input, 'arj');
    await expect(canvas.getByRole('button', { name: 'Clear search' })).toBeVisible();
    await waitFor(() => expect(args.searchChange).toHaveBeenCalledWith('arj'));
  },
};

export const ClearButton: Story = {
  args: { value: 'Kavya' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    const input = canvas.getByRole('searchbox');
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
    await expect(args.searchChange).toHaveBeenCalledWith('');
  },
};

export const EscapeClears: Story = {
  args: { value: 'Kavya' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('searchbox');
    await userEvent.type(input, '{Escape}');
    await expect(input).toHaveValue('');
  },
};

export const Projects: Story = { args: { label: 'Search projects', placeholder: 'Search projects' } };
export const Disabled: Story = { args: { disabled: true, value: 'Kavya' } };

export const InAList: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="width: 300px"><app-search-input [label]="label" [placeholder]="placeholder" /></div>`,
  }),
};
