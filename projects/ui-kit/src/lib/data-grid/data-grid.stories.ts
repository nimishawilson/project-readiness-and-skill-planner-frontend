import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';
import { DataGrid, GridCell, GridCorner, GridFooterCell, GridFooterLabel, GridRowHeader } from './data-grid';

interface Person {
  id: number;
  name: string;
}

const people = (count: number): Person[] => Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Person ${i + 1}` }));
const skills = (count: number) => Array.from({ length: count }, (_, i) => ({ key: `s${i + 1}`, header: `Skill ${i + 1}` }));

const meta: Meta<DataGrid<Person>> = {
  title: 'Components/Data grid',
  component: DataGrid,
  tags: ['autodocs'],
  args: {
    label: 'Team skills',
    rows: people(6),
    columns: skills(5),
    rowKey: (row: Person) => row.id,
    maxHeight: '360px',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-data-grid
        [label]="label" [rows]="rows" [columns]="columns" [rowKey]="rowKey" [maxHeight]="maxHeight"
        [highlightColumn]="highlightColumn" [firstColumnWidth]="firstColumnWidth" [columnMinWidth]="columnMinWidth">
        <ng-template appGridCorner>Employee</ng-template>
        <ng-template appGridRowHeader let-row>{{ row.name }}</ng-template>
        <ng-template appGridCell let-row let-column="column">{{ row.name.slice(-1) }} / {{ column.key }}</ng-template>
        <ng-template appGridFooterLabel>Team coverage</ng-template>
        <ng-template appGridFooterCell let-column>{{ column.header }} total</ng-template>
      </app-data-grid>`,
    moduleMetadata: { imports: [GridCorner, GridRowHeader, GridCell, GridFooterLabel, GridFooterCell] },
  }),
};
export default meta;
type Story = StoryObj<DataGrid<Person>>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table', { name: 'Team skills' })).toBeVisible();
    await expect(canvas.getByText('Team coverage')).toBeVisible();
  },
};

/** More employees than fit: header and footer stay in view. */
export const ManyRows: Story = { args: { rows: people(40) } };

/** More skills than fit: the first column stays in view. */
export const ManyColumns: Story = { args: { columns: skills(20) } };

export const ManyRowsAndColumns: Story = { args: { rows: people(40), columns: skills(20) } };

export const HighlightedColumn: Story = { args: { highlightColumn: 's2' } };
