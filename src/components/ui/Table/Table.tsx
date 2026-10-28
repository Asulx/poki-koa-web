import type { ReactNode } from 'react';

import './Table.css';

/**
 * Define la estructura y el comportamiento de una columna dentro de la tabla genérica.
 *
 * @template T Tipo de objeto que representa una fila de datos.
 */
export type TableColumn<T> = {
  /** Clave única o identificador de la propiedad en el objeto de datos. */
  key: string;
  /** Etiqueta de texto visible en la cabecera de la columna. */
  label: string;
  /** Función opcional para renderizar contenido personalizado en las celdas de esta columna. */
  render?: (row: T) => ReactNode;
};

/**
 * Propiedades requeridas para el componente Table.
 *
 * @template T Tipo de objeto que conforma los datos de las filas.
 */
type TableProps<T> = {
  /** Colección de definiciones de columnas que estructurarán la tabla. */
  columns: TableColumn<T>[];
  /** Arreglo de elementos u objetos de datos a mostrar en las filas. */
  data: T[];
  /** Función opcional para generar una clave única por cada fila. Por defecto utiliza el índice. */
  rowKey?: (row: T, index: number) => string | number;
};

/**
 * Componente de tabla genérica y reutilizable para el despliegue estructurado de datos.
 * Soporta tipado estricto mediante genéricos, renderizado personalizado de celdas
 * y optimización de claves de filas (*row keys*).
 *
 * @template T Tipo de datos de los elementos tabulares.
 * @param props Contiene las columnas, los datos y la función opcional de clave de fila.
 * @returns Un elemento `<table>` estructurado con sus cabeceras y filas correspondientes.
 */
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
                  : String((row as Record<string, unknown>)[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
