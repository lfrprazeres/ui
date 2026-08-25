import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/elements/card";
import { cn } from "@/lib/cn";

export type StatDirection = "up" | "down" | "flat";

const DIRECTION = {
  down: { className: "text-negative", icon: ArrowDownIcon },
  flat: { className: "text-muted-foreground", icon: ArrowRightIcon },
  up: { className: "text-positive", icon: ArrowUpIcon },
} satisfies Record<
  StatDirection,
  { className: string; icon: typeof ArrowUpIcon }
>;

export interface StatTileProps {
  caption?: string;
  className?: string;
  /** Optional change indicator. Colour comes from the positive/negative tokens. */
  delta?: { direction: StatDirection; label: string };
  label: string;
  value: ReactNode;
}

export function StatTile({
  label,
  value,
  delta,
  caption,
  className,
}: StatTileProps) {
  const direction = delta ? DIRECTION[delta.direction] : null;
  const DeltaIcon = direction?.icon;

  return (
    <Card className={cn("gap-0 py-4", className)}>
      <CardContent className="px-4">
        <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          {label}
        </div>
        <div className="mt-1 font-mono font-semibold text-2xl text-foreground tabular-nums">
          {value}
        </div>
        {delta && direction && DeltaIcon ? (
          <div
            className={cn(
              "mt-1 flex items-center gap-1 font-medium text-xs tabular-nums",
              direction.className
            )}
          >
            <DeltaIcon aria-hidden="true" className="size-3" />
            {delta.label}
          </div>
        ) : null}
        {caption ? (
          <div className="mt-1 text-muted-foreground text-xs">{caption}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
