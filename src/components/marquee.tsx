"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

export interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full pass. Larger is slower. */
  duration?: number;
  /** Fade the leading and trailing edges into the background. */
  fade?: boolean;
  /** Hold the strip still while the pointer is over it. */
  pauseOnHover?: boolean;
  /** Scroll direction. */
  reverse?: boolean;
}

const FADE_MASK =
  "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]";

/** The track is duplicated, so one pass is half the total width. */
const PASS_PERCENT = 50;

/**
 * A continuously scrolling strip.
 *
 * Driven frame by frame rather than by a keyframe animation, because that is
 * what makes `pauseOnHover` able to stop and resume mid-travel instead of
 * snapping back to the start.
 *
 * Under reduced motion this suppresses the animation and becomes a scrollable
 * region, rather than using the duration tokens. A loop has no final state to
 * land on, so collapsing its duration to zero would be an infinite speed.
 */
export function Marquee({
  children,
  className,
  duration = 30,
  fade = false,
  pauseOnHover = false,
  reverse = false,
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const offset = useMotionValue(0);
  const translate = useTransform(offset, (value) => `${value}%`);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  useAnimationFrame((_time, delta) => {
    if (paused || reduced) {
      return;
    }
    const travelled = (PASS_PERCENT / (duration * 1000)) * delta;
    const next = offset.get() + (reverse ? travelled : -travelled);
    if (next <= -PASS_PERCENT) {
      offset.set(next + PASS_PERCENT);
      return;
    }
    if (next >= 0 && reverse) {
      offset.set(next - PASS_PERCENT);
      return;
    }
    offset.set(next);
  });

  const track = (
    <div className="flex shrink-0 items-center gap-6 pr-6">{children}</div>
  );

  if (reduced) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className="flex w-max items-center">{track}</div>
      </div>
    );
  }

  return (
    <div
      className={cn("overflow-hidden", fade && FADE_MASK, className)}
      onBlurCapture={pauseOnHover ? resume : undefined}
      onFocusCapture={pauseOnHover ? pause : undefined}
      onPointerEnter={pauseOnHover ? pause : undefined}
      onPointerLeave={pauseOnHover ? resume : undefined}
    >
      <motion.div className="flex w-max items-center" style={{ x: translate }}>
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
