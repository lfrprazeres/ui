import { type ReactNode, useEffect, useState } from "react";

/**
 * Reads the resolved value of a custom property off the document root and
 * re-reads it whenever the theme class changes, so the docs reflect whichever
 * palette is selected in the toolbar rather than a hardcoded snapshot.
 */
export function useResolvedToken(name: string) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const read = () =>
      setValue(
        getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      );

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, [name]);

  return value;
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-1 font-semibold text-foreground text-lg">{title}</h2>
      {description ? (
        <p className="mb-4 max-w-2xl text-muted-foreground text-sm">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}

export function Swatch({ token, label }: { token: string; label?: string }) {
  const resolved = useResolvedToken(token);

  return (
    <div className="flex items-center gap-3">
      <div
        className="size-12 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="min-w-0">
        <div className="truncate font-medium font-mono text-foreground text-xs">
          {label ?? token}
        </div>
        <div className="truncate text-muted-foreground text-xs">
          {resolved || "not set"}
        </div>
      </div>
    </div>
  );
}

export function SwatchGrid({ tokens }: { tokens: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tokens.map((token) => (
        <Swatch key={token} token={token} />
      ))}
    </div>
  );
}

export function Ramp({ name, steps }: { name: string; steps: string[] }) {
  return (
    <div className="mb-5">
      <div className="mb-2 font-medium font-mono text-foreground text-xs">
        --{name}-*
      </div>
      <div className="flex overflow-hidden rounded-md border border-border">
        {steps.map((step) => (
          <div className="flex-1" key={step}>
            <div
              className="h-12"
              style={{ backgroundColor: `var(--${name}-${step})` }}
            />
            <div className="bg-card py-1 text-center text-[10px] text-muted-foreground">
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
