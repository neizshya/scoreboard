import React, { ReactNode } from "react";

// Updated Column type
export type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (value: T[keyof T] | undefined, row: T, index: number) => ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  className?: string;
};

export function Table<T>({ data, columns, className }: TableProps<T>) {
  return (
    <table className={`table-auto min-w-full rounded-md ${className}`}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className="py-2 px-4 border-b">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="text-center">
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="py-2 px-4 border-b">
                {column.render
                  ? column.render(row[column.accessor!], row, rowIndex)
                  : (row[column.accessor!] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
