import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type ThemeMode, ThemeToggle } from "@/components/theme-toggle";

const meta = {
  component: ThemeToggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "Components/ThemeToggle",
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled() {
  const [mode, setMode] = useState<ThemeMode>("system");

  return (
    <div className="flex flex-col items-center gap-3">
      <ThemeToggle onValueChange={setMode} value={mode} />
      <p className="text-muted-foreground text-xs">
        Selected: <span className="font-mono">{mode}</span>
      </p>
    </div>
  );
}

export const Default: Story = {
  args: { onValueChange: () => undefined, value: "system" },
  render: () => <Controlled />,
};
