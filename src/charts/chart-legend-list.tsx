import { cn } from "@/lib/cn";

export interface ChartLegendItem {
  color: string;
  label: string;
  /** Percentage or other secondary figure, right-aligned. */
  share?: string;
  value?: string;
}

export interface ChartLegendListProps {
  className?: string;
  items: ChartLegendItem[];
}

/**
 * The shared legend. Every entry names its series in text, so colour is never
 * the only thing carrying the meaning.
 */
export function ChartLegendList({ className, items }: ChartLegendListProps) {
  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((item) => (
        <li className="flex items-center gap-2 text-sm" key={item.label}>
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: item.color }}
          />
          <span className="flex-1 truncate text-foreground">{item.label}</span>
          {item.value ? (
            <span className="text-muted-foreground tabular-nums">
              {item.value}
            </span>
          ) : null}
          {item.share ? (
            <span className="w-12 text-right text-muted-foreground tabular-nums">
              {item.share}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
