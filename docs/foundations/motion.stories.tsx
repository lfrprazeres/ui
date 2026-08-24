import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { Button } from "@/elements/button";
import { Section, useResolvedToken } from "./token-table";

const DURATIONS = [
  { note: "hover, focus, small state flips", token: "--motion-duration-fast" },
  { note: "the default for most transitions", token: "--motion-duration-base" },
  { note: "entrances, larger movements", token: "--motion-duration-slow" },
];

const EASINGS = [
  { note: "the default curve", token: "--motion-ease" },
  { note: "easeOutExpo, for entrances", token: "--motion-ease-emphasized" },
];

function TokenRow({ token, note }: { token: string; note: string }) {
  const resolved = useResolvedToken(token);

  return (
    <div className="flex items-baseline gap-4 border-border border-b py-2 last:border-b-0">
      <span className="w-56 shrink-0 font-medium font-mono text-foreground text-xs">
        {token}
      </span>
      <span className="w-28 shrink-0 font-mono text-muted-foreground text-xs">
        {resolved || "not set"}
      </span>
      <span className="text-muted-foreground text-xs">{note}</span>
    </div>
  );
}

function Demo() {
  const [moved, setMoved] = useState(false);
  const toggle = useCallback(() => setMoved((value) => !value), []);

  return (
    <div>
      <div className="mb-4 h-16 rounded-md border border-border bg-card p-2">
        <div
          className="size-12 rounded-md bg-primary"
          style={{
            transform: moved ? "translateX(320px)" : "translateX(0)",
            transitionDuration: "var(--motion-duration-slow)",
            transitionProperty: "transform",
            transitionTimingFunction: "var(--motion-ease-emphasized)",
          }}
        />
      </div>
      <Button onClick={toggle} variant="outline">
        Toggle
      </Button>
    </div>
  );
}

function MotionFoundations() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">Motion</h1>
      <p className="mb-8 max-w-2xl text-muted-foreground text-sm">
        Reduced motion is handled at the token layer, not per component. Under{" "}
        <code className="font-mono text-xs">
          prefers-reduced-motion: reduce
        </code>{" "}
        every duration token collapses to zero, so animated components inherit
        the behaviour without opting in. The animation is not disabled, because
        disabling it hides the outcome. The user lands on the final state
        instantly instead.
      </p>

      <Section title="Durations">
        <div>
          {DURATIONS.map((duration) => (
            <TokenRow
              key={duration.token}
              note={duration.note}
              token={duration.token}
            />
          ))}
        </div>
      </Section>

      <Section title="Easings">
        <div>
          {EASINGS.map((easing) => (
            <TokenRow
              key={easing.token}
              note={easing.note}
              token={easing.token}
            />
          ))}
        </div>
      </Section>

      <Section
        description="Uses --motion-duration-slow and --motion-ease-emphasized. Turn on reduced motion in your OS and the square jumps straight to its destination."
        title="Live"
      >
        <Demo />
      </Section>
    </div>
  );
}

const meta = {
  component: MotionFoundations,
  parameters: { layout: "fullscreen" },
  title: "Foundations/Motion",
} satisfies Meta<typeof MotionFoundations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Motion: Story = {};
