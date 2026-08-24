import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/elements/button";
import {
  StatusBanner,
  Track,
  useReducedMotion,
  useToggle,
} from "./motion-demo";
import { Section, useResolvedToken } from "./token-table";

const DURATIONS = [
  {
    detail: "hover, focus, small state flips",
    primitive: "--duration-fast",
    token: "--motion-duration-fast",
  },
  {
    detail: "the default for most transitions",
    primitive: "--duration-base",
    token: "--motion-duration-base",
  },
  {
    detail: "entrances, larger movements",
    primitive: "--duration-slow",
    token: "--motion-duration-slow",
  },
];

const EASINGS = [
  { detail: "the default curve", token: "--motion-ease" },
  { detail: "easeOutExpo, for entrances", token: "--motion-ease-emphasized" },
];

function TokenRow({
  token,
  primitive,
  detail,
}: {
  token: string;
  primitive?: string;
  detail: string;
}) {
  const effective = useResolvedToken(token);
  const raw = useResolvedToken(primitive ?? token);
  const collapsed = Boolean(primitive) && effective !== raw;

  return (
    <div className="flex items-baseline gap-4 border-border border-b py-2 last:border-b-0">
      <span className="w-56 shrink-0 font-mono text-foreground text-xs">
        {token}
      </span>
      <span className="w-24 shrink-0 font-mono text-muted-foreground text-xs">
        {raw || "not set"}
      </span>
      <span
        className={`w-24 shrink-0 font-mono text-xs ${collapsed ? "text-negative" : "text-foreground"}`}
      >
        {effective || "not set"}
      </span>
      <span className="text-muted-foreground text-xs">{detail}</span>
    </div>
  );
}

function MotionFoundations() {
  const reduced = useReducedMotion();
  const [forceMotion, toggleForce] = useToggle(false);
  const [moved, toggleMoved] = useToggle(false);

  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-foreground">Motion</h1>
      <p className="mb-6 max-w-3xl text-muted-foreground text-sm">
        Reduced motion is handled once, at the token layer, rather than in every
        component. Under{" "}
        <code className="font-mono text-xs">
          prefers-reduced-motion: reduce
        </code>{" "}
        the semantic duration tokens collapse to zero, so anything reading them
        inherits the behaviour without opting in. The animation is not disabled,
        because disabling it hides the outcome. The user lands on the final
        state instantly instead.
      </p>

      <StatusBanner forceMotion={forceMotion} reduced={reduced} />

      <Section
        description="Two tiers. The primitive never changes. The semantic token is what components read, and it is the one that collapses. A red effective value means the collapse is currently active."
        title="Durations"
      >
        <div className="mb-2 flex gap-4 border-border border-b pb-1">
          <span className="w-56 shrink-0 text-muted-foreground text-xs">
            semantic token
          </span>
          <span className="w-24 shrink-0 text-muted-foreground text-xs">
            primitive
          </span>
          <span className="w-24 shrink-0 text-muted-foreground text-xs">
            effective
          </span>
        </div>
        {DURATIONS.map((duration) => (
          <TokenRow
            detail={duration.detail}
            key={duration.token}
            primitive={duration.primitive}
            token={duration.token}
          />
        ))}
      </Section>

      <Section
        description="Easings are unaffected by reduced motion. A curve applied over zero milliseconds simply has nothing to shape."
        title="Easings"
      >
        {EASINGS.map((easing) => (
          <TokenRow
            detail={easing.detail}
            key={easing.token}
            token={easing.token}
          />
        ))}
      </Section>

      <Section
        description="All three durations run on the same trigger, so their relative pacing is directly comparable."
        title="Durations, side by side"
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <Button onClick={toggleMoved} size="sm" variant="outline">
            {moved ? "Send back" : "Run"}
          </Button>
          <Button
            onClick={toggleForce}
            size="sm"
            variant={forceMotion ? "default" : "outline"}
          >
            {forceMotion ? "Preview override on" : "Preview override off"}
          </Button>
        </div>

        {DURATIONS.map((duration) => (
          <Track
            detail={duration.detail}
            easing="--motion-ease"
            forceMotion={forceMotion}
            key={duration.token}
            label={duration.token}
            moved={moved}
            token={duration.token}
          />
        ))}
      </Section>

      <Section
        description="Same duration, different curve. The emphasized curve starts fast and settles, which is why it suits entrances."
        title="Easings, side by side"
      >
        {EASINGS.map((easing) => (
          <Track
            detail={easing.detail}
            easing={easing.token}
            forceMotion={forceMotion}
            key={easing.token}
            label={easing.token}
            moved={moved}
            token="--motion-duration-slow"
          />
        ))}
      </Section>

      <Section title="The preview override">
        <p className="max-w-3xl text-muted-foreground text-sm">
          That second button is a documentation affordance only. It swaps the
          semantic token for the raw duration primitive so the curves stay
          inspectable on a machine with reduced motion enabled. No shipped
          component does this, and none should: honouring the preference is the
          entire point of putting the collapse in the token layer.
        </p>
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
