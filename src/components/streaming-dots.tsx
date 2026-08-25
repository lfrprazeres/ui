import { cn } from "@/lib/cn";

const DOTS = [
  "[animation-delay:-320ms]",
  "[animation-delay:-160ms]",
  "[animation-delay:0ms]",
];

export interface StreamingDotsProps {
  className?: string;
  /** Announced to assistive tech. */
  label?: string;
}

/**
 * Three dots for a pending response.
 *
 * Under reduced motion the bounce is swapped for an opacity pulse rather than
 * removed. This is a loop, so there is no final state to collapse toward, but
 * killing it outright would drop the only "something is happening" cue a
 * sighted user has. Reduced motion targets vestibular triggers, which means
 * movement, so fading in place stays within it.
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
      {DOTS.map((delay) => (
        <span
          className={cn(
            "size-1.5 animate-bounce rounded-full bg-current opacity-60",
            "motion-reduce:animate-pulse motion-reduce:[animation-delay:0ms]",
            delay
          )}
          key={delay}
        />
      ))}
    </span>
  );
}
