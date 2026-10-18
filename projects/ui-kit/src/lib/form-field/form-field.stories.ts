import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { FormField } from './form-field';

const meta: Meta<FormField> = {
  title: 'Components/Form field',
  component: FormField,
  tags: ['autodocs'],
  args: { label: 'Add a skill', hint: undefined, error: undefined },
  render: (args) => ({
    props: args,
    template: `
      <app-form-field [label]="label" [hint]="hint" [error]="error" style="max-width: 280px">
        <input type="text" placeholder="e.g. Kubernetes" />
      </app-form-field>`,
  }),
};
export default meta;
type Story = StoryObj<FormField>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('Add a skill')).toBeVisible();
  },
};

export const WithError: Story = { args: { error: 'Skill name is required' } };

export const WithSelect: Story = {
  args: { label: 'Level' },
  render: (args) => ({
    props: args,
    template: `
      <app-form-field [label]="label" style="max-width: 200px">
        <select><option>Beginner</option><option>Intermediate</option><option>Expert</option></select>
      </app-form-field>`,
  }),
};

export const DateInput: Story = {
  args: { label: 'Target date' },
  render: (args) => ({
    props: args,
    template: `<app-form-field [label]="label" style="max-width: 200px"><input type="date" /></app-form-field>`,
  }),
};
