import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/elements/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/elements/card";

const meta = {
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Elements/Card",
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Monthly report</CardTitle>
        <CardDescription>Generated on the first of each month.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Everything inside reads from the semantic token tier.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Download</Button>
      </CardFooter>
    </Card>
  ),
};
