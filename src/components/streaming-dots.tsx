import { cn } from "@/lib/cn";

const DELAYS = ["", "[animation-delay:120ms]", "[animation-delay:240ms]"];

export interface StreamingDotsProps {
  className?: string;
  /** Announced to assistive tech. */
  label?: string;
}

/**
 * Three bouncing dots for a pending response.
 *
 * `motion-reduce:animate-none` rather than the duration tokens, for the same
 * reason as Marquee: this is a loop with no final state to collapse toward. The
 * role and label still convey the state once the animation stops.
 */
export function StreamingDots({
  label = "Loading",
  className,
}: StreamingDotsProps) {
  return (
    <span
      aria-label={label}
      className={cn("inline-flex items-center gap-1", className)}
      role="status"
    >
      {DELAYS.map((delay) => (
        <span
          className={cn(
            "size-1.5 animate-bounce rounded-full bg-current motion-reduce:animate-none",
            delay
          )}
          key={delay || "first"}
        />
      ))}
    </span>
  );
}
