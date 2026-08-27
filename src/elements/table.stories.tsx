import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/elements/table";

const meta = {
  component: Table,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  title: "Elements/Table",
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  { name: "Alpha", owner: "Ana", status: "Active" },
  { name: "Beta", owner: "Bruno", status: "Paused" },
  { name: "Gamma", owner: "Cora", status: "Active" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Three projects and who owns them.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.owner}</TableCell>
            <TableCell className="text-right">{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
