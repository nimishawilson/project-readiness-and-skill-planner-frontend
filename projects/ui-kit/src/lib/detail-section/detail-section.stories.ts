import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { DetailSection } from './detail-section';

const meta: Meta<DetailSection> = {
  title: 'Components/Detail section',
  component: DetailSection,
  tags: ['autodocs'],
  args: { heading: 'Skills' },
  render: (args) => ({
    props: args,
    template: `
      <app-detail-section [heading]="heading">
        <span meta>4 mapped</span>
        <p style="margin: 0">Section body</p>
      </app-detail-section>`,
  }),
};
export default meta;
type Story = StoryObj<DetailSection>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('4 mapped')).toBeVisible();
    await expect(canvas.getByText('Section body')).toBeVisible();
  },
};
