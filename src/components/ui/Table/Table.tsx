import type { ReactNode } from 'react'

import './Table.css'

export type TableColumn<T> = {
  key: string
  label: string
  render?: (row: T) => ReactNode
}

type TableProps<T> = {
  columns: TableColumn<T>[]
  data: T[]
  rowKey?: (row: T, index: number) => string | number
}

export default function Table<T>({
  columns,
  data,
  rowKey = (_row, index) => index,
}: TableProps<T>) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowKey(row, rowIndex)}>
            {columns.map((column) => (
              <td key={column.key}>
                {column.render
                  ? column.render(row)
                  : String(
                      (row as Record<string, unknown>)[
                        column.key
                      ]
                    )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}