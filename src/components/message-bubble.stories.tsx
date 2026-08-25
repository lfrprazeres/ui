import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatePresence } from "motion/react";
import { useCallback, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Chip } from "@/components/chip";
import { MessageBubble, type MessageRole } from "@/components/message-bubble";
import { StreamingDots } from "@/components/streaming-dots";
import { Button } from "@/elements/button";

const meta = {
  component: MessageBubble,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  title: "Components/MessageBubble",
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

const SEND = /^send$/i;
const FIRST_MESSAGE = /what changed in the latest filing/i;

interface Message {
  body: string;
  from: MessageRole;
  id: number;
}

const SCRIPT: Omit<Message, "id">[] = [
  { body: "What changed in the latest filing?", from: "user" },
  { body: "Called search_documents with 2 filters", from: "tool" },
  {
    body: "The dividend policy was revised, with the payout ratio tied to free cash flow.",
    from: "assistant",
  },
  { body: "Can you cite that?", from: "user" },
];

function LiveThread() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);

  const send = useCallback(() => {
    setMessages((current) => {
      const next = SCRIPT[current.length % SCRIPT.length];
      return next ? [...current, { ...next, id: Date.now() }] : current;
    });
  }, []);

  const removeFirst = useCallback(
    () => setMessages((current) => current.slice(1)),
    []
  );

  const clear = useCallback(() => setMessages([]), []);
  const togglePending = useCallback(() => setPending((value) => !value), []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button onClick={send} size="sm">
          Send
        </Button>
        <Button onClick={removeFirst} size="sm" variant="outline">
          Remove oldest
        </Button>
        <Button onClick={togglePending} size="sm" variant="outline">
          {pending ? "Stop streaming" : "Start streaming"}
        </Button>
        <Button onClick={clear} size="sm" variant="ghost">
          Clear
        </Button>
      </div>

      {/* AnimatePresence is what lets the exit run. Without it the element
          unmounts immediately and only the entrance is visible. */}
      <div className="flex min-h-64 flex-col gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {messages.map((message) => (
            <MessageBubble from={message.from} key={message.id}>
              {message.body}
            </MessageBubble>
          ))}
          {pending ? (
            <MessageBubble from="assistant" key="pending">
              <StreamingDots />
            </MessageBubble>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export const Live: Story = {
  args: { children: "Hello", from: "user" },
  /**
   * Guards against the failure mode of a JS-driven entrance: if the animation
   * never runs, the bubble is stuck at its initial opacity of 0 and the message
   * is invisible. This asserts it actually reaches full opacity.
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: SEND }));

    const bubble = await canvas.findByText(FIRST_MESSAGE);
    const wrapper = bubble.closest("div.flex.w-full");

    await waitFor(() =>
      expect(Number(getComputedStyle(wrapper as Element).opacity)).toBe(1)
    );
  },
  render: () => <LiveThread />,
};

export const Roles: Story = {
  args: { children: "Hello", from: "user" },
  render: () => (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      <MessageBubble from="user">User, filled with primary</MessageBubble>
      <MessageBubble from="assistant">Assistant, on card surface</MessageBubble>
      <MessageBubble from="tool">Tool, dashed and muted</MessageBubble>
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
        With a footer of citation chips.
      </MessageBubble>
    </div>
  ),
};
