import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const chipVariants = cva(
  "inline-flex max-w-full items-center gap-1.5 rounded-full border font-medium text-xs transition-colors [&_svg]:size-3 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "px-2.5 py-1",
        sm: "px-2 py-0.5 text-[11px]",
      },
      variant: {
        accent: "border-transparent bg-accent text-accent-foreground",
        default: "border-border bg-card text-card-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border bg-transparent text-foreground",
      },
    },
  }
);

type ChipOwnProps = VariantProps<typeof chipVariants> & {
  icon?: ReactNode;
};

/*
 * Discriminated on `href`, so the anchor branch accepts anchor attributes such
 * as `target` and `rel`. Typing the whole thing as a span made those a type
 * error on the very element that renders as a link.
 */
export type ChipProps = ChipOwnProps &
  (
    | ({ href: string } & Omit<ComponentProps<"a">, "href">)
    | ({ href?: never } & ComponentProps<"span">)
  );

export function Chip({
  className,
  variant,
  size,
  icon,
  children,
  ...rest
}: ChipProps) {
  const content = (
    <>
      {icon}
      <span className="truncate">{children}</span>
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest;
    return (
      <a
        className={cn(
          chipVariants({ size, variant }),
          "hover:bg-accent hover:text-accent-foreground",
          className
        )}
        href={href}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { href: _omitted, ...spanProps } = rest;
  return (
    <span
      className={cn(chipVariants({ size, variant }), className)}
      {...spanProps}
    >
      {content}
    </span>
  );
}

export { chipVariants };
