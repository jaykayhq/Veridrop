interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-default">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-[10px] font-semibold text-text-muted uppercase tracking-[0.1em]"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-default">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-text-muted"
                >
                  No data
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-surface-hover">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-text-secondary", col.className)}>
                    {col.render
                      ? col.render(row)
                      : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
