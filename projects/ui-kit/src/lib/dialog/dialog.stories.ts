import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button/button';
import { Dialog } from './dialog';

const meta: Meta<Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { heading: 'Map project to another year', open: false },
  decorators: [],
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [Button] },
    template: `
      <button app-button type="button" (click)="open = true">Open dialog</button>
      <app-dialog [heading]="heading" [(open)]="open">
        <p style="margin: 0">Adds 2027 to this project and carries its requirements and assignments forward.</p>
        <div actions>
          <button app-button variant="ghost" type="button" (click)="open = false">Cancel</button>
          <button app-button type="button" (click)="open = false">Map to 2027</button>
        </div>
      </app-dialog>`,
  }),
};
export default meta;
type Story = StoryObj<Dialog>;

export const Closed: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open dialog' }));
    // The open dialog lives in the top layer, outside the story canvas.
    const dialog = await within(document.body).findByRole('dialog', { name: 'Map project to another year' });
    await expect(dialog).toBeVisible();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(dialog).not.toBeVisible());
  },
};
