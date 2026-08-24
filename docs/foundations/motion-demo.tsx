import { useCallback, useEffect, useState } from "react";

/** Tracks the live OS-level reduced-motion preference. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((value) => !value), []);
  return [on, toggle] as const;
}

const TRAVEL = "260px";

/**
 * One animated track.
 *
 * `forceMotion` swaps the semantic motion token for the raw duration primitive.
 * That is a documentation-only escape hatch so the easing curves stay
 * inspectable on a machine with reduced motion enabled. No shipped component
 * does this, and none should.
 */
export function Track({
  label,
  detail,
  token,
  easing,
  moved,
  forceMotion,
}: {
  label: string;
  detail: string;
  token: string;
  easing: string;
  moved: boolean;
  forceMotion: boolean;
}) {
  const durationVar = forceMotion
    ? token.replace("--motion-duration", "--duration")
    : token;

  return (
    <div className="mb-3">
      <div className="mb-1 flex items-baseline gap-3">
        <span className="w-56 shrink-0 font-mono text-foreground text-xs">
          {label}
        </span>
        <span className="text-muted-foreground text-xs">{detail}</span>
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-card p-2">
        <div
          className="size-8 rounded-sm bg-primary"
          style={{
            transform: moved ? `translateX(${TRAVEL})` : "translateX(0)",
            transitionDuration: `var(${durationVar})`,
            transitionProperty: "transform",
            transitionTimingFunction: `var(${easing})`,
          }}
        />
      </div>
    </div>
  );
}

export function StatusBanner({
  reduced,
  forceMotion,
}: {
  reduced: boolean;
  forceMotion: boolean;
}) {
  if (!reduced) {
    return (
      <div className="mb-6 rounded-md border border-border bg-muted p-3">
        <p className="text-foreground text-sm">
          <strong>Reduced motion is disabled</strong> on this machine, so the
          duration tokens below hold their normal values and the demos animate.
          Turn it on in your OS accessibility settings and every value becomes
          0ms without a reload.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-md border border-border bg-accent p-3">
      <p className="mb-2 text-accent-foreground text-sm">
        <strong>Reduced motion is enabled</strong> on this machine. Every{" "}
        <code className="font-mono text-xs">--motion-duration-*</code> token
        below reads 0ms as a result, and the demos jump straight to their final
        state. That is the intended behaviour, not a broken demo.
      </p>
      <p className="text-accent-foreground text-sm">
        {forceMotion
          ? "Preview override is on, so the tracks below are running on the raw duration primitives instead."
          : "Use the preview override to see the curves anyway."}
      </p>
    </div>
  );
}
