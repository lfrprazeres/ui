/*
 * The five chart roles are part of the semantic tier, so a palette retunes the
 * whole ramp and no chart ever learns a literal colour.
 */
export const CHART_RAMP = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const;

/** Picks a ramp colour by position, or honours an explicit override. */
export function rampColor(index: number, override?: string): string {
  // The modulo keeps this in range; the literal only satisfies the checker.
  return override ?? CHART_RAMP[index % CHART_RAMP.length] ?? CHART_RAMP[0];
}
