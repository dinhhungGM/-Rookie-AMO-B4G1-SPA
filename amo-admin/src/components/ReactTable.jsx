import { useTable, useSortBy } from "react-table";

function Table({ columns, data, onHeaderClick, onRowClick }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        manualSortBy: true,
      },
      useSortBy
    );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows;

  return (
    <div
      className="d-flex mb-3"
      style={{
        overflowX: "auto",
      }}
    >
      <table
        className="table mb-0"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  onClick={() => onHeaderClick(column)}
                >
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.sortDirection === "ASC" ? (
                      " ▲"
                    ) : column.sortDirection === "DESC" ? (
                      " ▼"
                    ) : (
                      <span style={{ opacity: 0 }}> ▼</span>
                    )}
                    {/* {column.isSorted ? (column.isSortedDesc ? " ▲" : " ▼") : ""} */}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => onRowClick(row.original)}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.column.Header !== ""
                        ? String(cell.value).substring(0, 20) +
                          (String(cell.value).length > 20 ? "..." : "")
                        : cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default Table;
