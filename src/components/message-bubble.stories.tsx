import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "@/components/chip";
import { MessageBubble } from "@/components/message-bubble";
import { StreamingDots } from "@/components/streaming-dots";

const meta = {
  component: MessageBubble,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  title: "Components/MessageBubble",
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Conversation: Story = {
  args: { children: "Hello", from: "user" },
  render: () => (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      <MessageBubble from="user">
        What changed in the latest filing?
      </MessageBubble>
      <MessageBubble from="tool">
        Called search_documents with 2 filters
      </MessageBubble>
      <MessageBubble
        footer={
          <>
            <Chip size="sm" variant="muted">
              Source 1
            </Chip>
            <Chip size="sm" variant="muted">
              Source 2
            </Chip>
          </>
        }
        from="assistant"
      >
        The dividend policy was revised, with the payout ratio tied to free cash
        flow.
      </MessageBubble>
      <MessageBubble from="assistant">
        <StreamingDots />
      </MessageBubble>
    </div>
  ),
};

export const Roles: Story = {
  args: { children: "Hello", from: "user" },
  render: () => (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      <MessageBubble from="user">User, filled with primary</MessageBubble>
      <MessageBubble from="assistant">Assistant, on card surface</MessageBubble>
      <MessageBubble from="tool">Tool, dashed and muted</MessageBubble>
    </div>
  ),
};
