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

export type ChipProps = ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & {
    icon?: ReactNode;
    /** Renders as an anchor when set, keeping the same visual treatment. */
    href?: string;
  };

/**
 * A compact pill for metadata, tags, sources or filters.
 *
 * Carries no domain meaning by design. A citation chip, a ticker tag and a
 * filter pill are all this component with different children.
 */
export function Chip({
  className,
  variant,
  size,
  icon,
  href,
  children,
  ...props
}: ChipProps) {
  const content = (
    <>
      {icon}
      <span className="truncate">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        className={cn(
          chipVariants({ size, variant }),
          "hover:bg-accent hover:text-accent-foreground",
          className
        )}
        href={href}
        {...(props as ComponentProps<"a">)}
      >
        {content}
      </a>
    );
  }

  return (
    <span className={cn(chipVariants({ size, variant }), className)} {...props}>
      {content}
    </span>
  );
}

export { chipVariants };
