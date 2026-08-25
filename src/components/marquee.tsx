"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full pass. Larger is slower. */
  duration?: number;
  /** Fade the leading and trailing edges into the background. */
  fade?: boolean;
  /** Scroll direction. */
  reverse?: boolean;
}

const FADE_MASK =
  "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]";

/**
 * A continuously scrolling strip.
 *
 * Under reduced motion this suppresses the animation and becomes a scrollable
 * region, rather than using the duration tokens. A loop has no final state to
 * land on, so collapsing its duration to zero would be an infinite speed.
 */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  fade = false,
  className,
}: MarqueeProps) {
  const reduced = useReducedMotion();

  const track = (
    <div
      aria-hidden={undefined}
      className="flex shrink-0 items-center gap-6 pr-6"
    >
      {children}
    </div>
  );

  if (reduced) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className="flex w-max items-center">{track}</div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", fade && FADE_MASK, className)}>
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        className="flex w-max items-center"
        transition={{
          duration,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {track}
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center gap-6 pr-6"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
