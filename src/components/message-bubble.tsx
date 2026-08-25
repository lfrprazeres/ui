"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MessageRole = "user" | "assistant" | "tool";

const ROLE = {
  assistant: {
    align: "justify-start",
    offset: -8,
    surface: "border bg-card text-card-foreground",
  },
  tool: {
    align: "justify-start",
    offset: -8,
    surface: "border border-dashed bg-muted text-muted-foreground",
  },
  user: {
    align: "justify-end",
    offset: 8,
    surface: "bg-primary text-primary-foreground",
  },
} satisfies Record<
  MessageRole,
  { align: string; offset: number; surface: string }
>;

export interface MessageBubbleProps {
  children: ReactNode;
  className?: string;
  /** Rendered below the body, typically a row of Chips. */
  footer?: ReactNode;
  /** Who sent it. Maps directly from an AI SDK message role. */
  from: MessageRole;
}

/**
 * A chat message.
 *
 * Animates in on mount, and out when removed, but the exit only runs if the
 * consumer wraps the list in `AnimatePresence` and gives each bubble a stable
 * `key`. Without that the element unmounts immediately and there is nothing
 * left to animate.
 *
 * Under reduced motion the movement is dropped and only the fade remains,
 * rather than removing the animation outright. The preference targets
 * vestibular triggers, which means translation and scale, so a cross-fade stays
 * within it while still marking that a new message arrived.
 */
export function MessageBubble({
  from,
  children,
  footer,
  className,
}: MessageBubbleProps) {
  const reduced = useReducedMotion();
  const { align, offset, surface } = ROLE[from];

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      className={cn("flex w-full", align, className)}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, x: offset, y: 6 }
      }
      transition={
        reduced
          ? { duration: 0.15, ease: "linear" }
          : { damping: 26, stiffness: 320, type: "spring" }
      }
    >
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
    </motion.div>
  );
}
