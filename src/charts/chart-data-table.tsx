export interface ChartDataTableRow {
  /** One cell per column after the first. */
  cells: string[];
  /** Row header, typically the series or slice name. */
  header: string;
}

export interface ChartDataTableProps {
  /** Describes the chart. Reuse the chart's accessible name. */
  caption: string;
  /** Column headers, including the leading row-header column. */
  columns: string[];
  rows: ChartDataTableRow[];
}

/**
 * The text alternative every chart renders.
 *
 * An SVG chart is an image to assistive technology no matter how much ARIA it
 * carries, so the numbers have to exist somewhere reachable. This is that
 * somewhere: a real table, visually hidden, carrying exactly the data the chart
 * plots.
 *
 * It must be a sibling of the element carrying `role="img"`, never a child.
 * `role="img"` removes its descendants from the accessibility tree, so a table
 * nested inside one is invisible to the readers it exists for.
 */
export function ChartDataTable({
  caption,
  columns,
  rows,
}: ChartDataTableProps) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.header}>
            <th scope="row">{row.header}</th>
            {row.cells.map((cell, index) => (
              <td key={columns[index + 1] ?? String(index)}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
