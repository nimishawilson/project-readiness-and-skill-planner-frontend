import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { Avatar } from './avatar';

const meta: Meta<Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Arjun Mehta', size: 'md', tone: 'soft', decorative: false },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['soft', 'solid', 'primary'] },
  },
};
export default meta;
type Story = StoryObj<Avatar>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('img', { name: 'Arjun Mehta' });
    await expect(avatar).toHaveTextContent('AM');
  },
};

export const Sizes: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: 12px; align-items: center">
        <app-avatar [name]="name" size="sm" />
        <app-avatar [name]="name" size="md" />
        <app-avatar [name]="name" size="lg" />
      </div>`,
  }),
};

export const Solid: Story = {
  args: { name: 'Priya Nair', tone: 'solid' },
  render: (args) => ({
    props: args,
    template: `
      <div style="background: var(--app-color-ink); padding: 16px; display: inline-block">
        <app-avatar [name]="name" [tone]="tone" [size]="size" />
      </div>`,
  }),
};

export const Primary: Story = { args: { tone: 'primary', size: 'lg' } };

export const SingleName: Story = { args: { name: 'Madonna' } };

export const Decorative: Story = {
  args: { decorative: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: 8px; align-items: center">
        <app-avatar [name]="name" [decorative]="decorative" />
        <span>{{ name }}</span>
      </div>`,
  }),
};
