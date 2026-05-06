import React from "react";

export interface TableColumn<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface EntityTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

function EntityTable<T>({
  columns,
  data,
  emptyMessage = "No hay registros disponibles.",
}: EntityTableProps<T>) {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="border-b border-[#eee] px-4 py-5 dark:border-strokedark"
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EntityTable;