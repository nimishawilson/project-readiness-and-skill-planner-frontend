import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { MasterDetail } from './master-detail';

const meta: Meta<MasterDetail> = {
  title: 'Components/Master-detail layout',
  component: MasterDetail,
  tags: ['autodocs'],
  args: { masterHeight: '240px', masterWidth: undefined },
  render: (args) => ({
    props: args,
    template: `
      <app-master-detail [masterHeight]="masterHeight" [masterWidth]="masterWidth">
        <div master tabindex="0" style="overflow: auto; padding: 16px">
          @for (n of [1,2,3,4,5,6,7,8,9,10]; track n) { <p>List row {{ n }}</p> }
        </div>
        <div detail style="padding: 16px">Detail pane</div>
      </app-master-detail>`,
  }),
};
export default meta;
type Story = StoryObj<MasterDetail>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Detail pane')).toBeVisible();
    await expect(canvas.getByText('List row 1')).toBeVisible();
  },
};

/** A narrow list column; the detail pane takes the rest. */
export const NarrowList: Story = {
  args: { masterWidth: '360px' },
  play: async ({ canvasElement }) => {
    const master = canvasElement.querySelector('.master') as HTMLElement;
    await expect(Math.round(master.getBoundingClientRect().width)).toBeLessThanOrEqual(360);
  },
};
