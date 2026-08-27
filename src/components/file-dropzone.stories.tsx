import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { FileDropzone } from "@/components/file-dropzone";

const meta = {
  component: FileDropzone,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  title: "Components/FileDropzone",
} satisfies Meta<typeof FileDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    accept: ".csv,.pdf",
    hint: "CSV, XLSX or PDF, up to 10 files",
    label: "Drop files here, or click to browse",
    multiple: true,
    onFiles: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    hint: "Please wait",
    label: "Importing…",
    onFiles: () => undefined,
  },
};

/** The picker is reachable by keyboard, not just by pointer. */
export const KeyboardReachable: Story = {
  args: {
    label: "Drop files here, or click to browse",
    onFiles: () => undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const zone = canvas.getByRole("button");
    await userEvent.tab();
    await expect(zone).toHaveFocus();
  },
};

export const Live: Story = {
  args: { label: "Drop files here", onFiles: () => undefined },
  render: () => {
    const [names, setNames] = useState<string[]>([]);
    const handleFiles = useCallback(
      (files: File[]) => setNames(files.map((file) => file.name)),
      []
    );
    return (
      <div className="space-y-3">
        <FileDropzone
          hint="Any file type"
          label="Drop files here, or click to browse"
          multiple
          onFiles={handleFiles}
        />
        {names.length > 0 ? (
          <ul className="space-y-1 text-muted-foreground text-sm">
            {names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
};
