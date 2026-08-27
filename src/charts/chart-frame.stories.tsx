import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ChartDataTable } from "@/charts/chart-data-table";
import { ChartFrame } from "@/charts/chart-frame";
import { ChartLegendList } from "@/charts/chart-legend-list";
import { rampColor } from "@/charts/chart-ramp";

/**
 * The shell every chart composes, shown with a placeholder in place of a real
 * plot. Reach for these three directly when building a chart the library does
 * not wrap, and you inherit the same accessibility contract.
 */
const meta = {
  component: ChartFrame,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  title: "Charts/ChartFrame",
} satisfies Meta<typeof ChartFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

const LABEL = "Requests by region";

const ROWS = [
  { cells: ["1,204"], header: "Europe", key: "eu" },
  { cells: ["980"], header: "North America", key: "na" },
  { cells: ["612"], header: "South America", key: "sa" },
];

export const Default: Story = {
  args: { children: null, label: LABEL },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The plot is one named image...
    await expect(canvas.getByRole("img", { name: LABEL })).toBeInTheDocument();

    // ...and the numbers live beside it, not inside it. A table nested within
    // role="img" would be removed from the accessibility tree entirely.
    const table = canvas.getByRole("table", { name: LABEL });
    await expect(
      within(table).getByRole("rowheader", { name: "Europe" })
    ).toBeInTheDocument();
    await expect(within(table).getByText("1,204")).toBeInTheDocument();
  },
  render: (args) => (
    <div className="w-96">
      <ChartFrame
        {...args}
        dataTable={
          <ChartDataTable
            caption={LABEL}
            columns={["Region", "Requests"]}
            rows={ROWS}
          />
        }
        legend={
          <ChartLegendList
            items={ROWS.map((row, index) => ({
              color: rampColor(index),
              label: row.header,
              value: row.cells[0],
            }))}
          />
        }
      >
        <div className="flex h-40 items-center justify-center rounded-md border border-border border-dashed text-muted-foreground text-sm">
          the plot goes here
        </div>
      </ChartFrame>
    </div>
  ),
};

export const Empty: Story = {
  args: {
    children: null,
    emptyLabel: "No requests in this period",
    isEmpty: true,
    label: LABEL,
  },
};
