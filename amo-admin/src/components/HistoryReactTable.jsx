import { useEffect } from "react";
import { useTable, useSortBy } from "react-table";

function Table({ columns, data /*, onHeaderClick, onRowClick*/ }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
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
    <>
      <table style={{ fontSize: "12px" }} class="table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr scope="col" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  /*  onClick={() => onHeaderClick(column)}*/
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
                {...row.getRowProps()} /*onClick={() => onRowClick(row.original)}*/
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.column.Header !== "Action"
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
      <br />
    </>
  );
}
export default Table;
