<<<<<<< HEAD
import './Table.css'

type TableProps = {
  columns: string[]
  data: Record<string, string | number>[]
}

export default function Table({
  columns,
  data,
}: TableProps) {
=======
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
>>>>>>> rama-temporal
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column) => (
<<<<<<< HEAD
            <th key={column}>{column}</th>
=======
            <th key={column.key}>{column.label}</th>
>>>>>>> rama-temporal
          ))}
        </tr>
      </thead>

      <tbody>
<<<<<<< HEAD
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column}>
                {row[column]}
=======
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
>>>>>>> rama-temporal
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}