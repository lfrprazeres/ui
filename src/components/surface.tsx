import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

/*
 * The fallbacks, and why they are written as overrides rather than gates.
 *
 * The tempting form is `prefers-reduced-transparency: no-preference` as an
 * opt-in. It is wrong: an unsupported media feature evaluates to false, so
 * Firefox would never match it and would never get glass at all. Written as a
 * `reduce` override instead, browsers without support fall through to the
 * translucent default and browsers with the preference get the opaque surface,
 * which is correct in both directions.
 *
 * `--popover` is the fallback because it is opaque in every palette, including
 * this one. A palette cannot express blur, so it cannot express its own
 * fallback either.
 */
const OPAQUE_FALLBACK = [
  "[@media(prefers-reduced-transparency:reduce)]:bg-popover",
  "[@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none",
  "[@supports_not_(backdrop-filter:blur(1px))]:bg-popover",
].join(" ");

const surfaceVariants = cva(
  cn(
    "relative rounded-lg border border-border",
    // The hairline top edge is what reads as a lit pane rather than a tinted
    // box. Without it translucency just looks washed out.
    "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-lg before:bg-white/25 before:content-['']",
    OPAQUE_FALLBACK
  ),
  {
    defaultVariants: {
      blur: "md",
      elevation: "flat",
      tint: "neutral",
    },
    variants: {
      blur: {
        lg: "backdrop-blur-xl",
        md: "backdrop-blur-md",
        none: "",
        sm: "backdrop-blur-sm",
      },
      elevation: {
        flat: "",
        raised: "shadow-md",
      },
      tint: {
        neutral: "bg-card text-card-foreground",
        none: "bg-transparent text-foreground",
        primary: "bg-accent text-accent-foreground",
      },
    },
  }
);

export type SurfaceProps<T extends ElementType = "div"> = VariantProps<
  typeof surfaceVariants
> & {
  /** Element to render. Defaults to a div; use `section`, `aside` etc. */
  as?: T;
} & Omit<ComponentProps<T>, "as" | "color">;

/**
 * A translucent, blurred panel.
 *
 * Colour comes from the palette and the effect comes from here. That split is
 * deliberate: palettes are colour-only by contract, and the components that
 * would otherwise carry the blur are vendored from the shadcn registry and have
 * to stay re-runnable. So `Surface` composes nothing vendored and owns blur,
 * hairline and elevation only.
 *
 * Pair it with `palette-glass`, whose `--card` is translucent. Under any other
 * palette `--card` is opaque, the blur has nothing to show through, and this
 * degrades to an ordinary panel rather than breaking.
 */
export function Surface<T extends ElementType = "div">({
  as,
  blur,
  className,
  elevation,
  tint,
  ...rest
}: SurfaceProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(surfaceVariants({ blur, elevation, tint }), className)}
      {...rest}
    />
  );
}

export { surfaceVariants };
