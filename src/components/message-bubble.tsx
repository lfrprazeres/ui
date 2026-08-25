import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MessageRole = "user" | "assistant" | "tool";

const ROLE = {
  assistant: {
    align: "justify-start",
    surface: "border bg-card text-card-foreground",
  },
  tool: {
    align: "justify-start",
    surface: "border border-dashed bg-muted text-muted-foreground",
  },
  user: {
    align: "justify-end",
    surface: "bg-primary text-primary-foreground",
  },
} satisfies Record<MessageRole, { align: string; surface: string }>;

export interface MessageBubbleProps {
  children: ReactNode;
  className?: string;
  /** Rendered below the body, typically a row of Chips. */
  footer?: ReactNode;
  /** Who sent it. Maps directly from an AI SDK message role. */
  from: MessageRole;
}

export function MessageBubble({
  from,
  children,
  footer,
  className,
}: MessageBubbleProps) {
  const { align, surface } = ROLE[from];

  return (
    <div className={cn("flex w-full", align, className)}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed",
          surface
        )}
      >
        <div className="whitespace-pre-wrap">{children}</div>
        {footer ? (
          <div className="mt-2 flex flex-wrap gap-1">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
