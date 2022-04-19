import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTable, useSortBy } from "react-table";

function Table({ columns, data, onRowClick, onSort }) {
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
      disableSortRemove: true,
    },
    useSortBy
  );
  const { params: Params } = useSelector((state) => state.assignment); // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows;
  useEffect(() => {
    onSort(sortBy);
    console.log(sortBy);
  }, [sortBy]);
  return (
    <div
      className="d-flex mb-3"
      style={{
        overflowX: "auto",
      }}
    >
      <table
        class="table mb-0"
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr className="" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                // column.getSortByToggleProps()
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.id === Params.OrderProperty ? (
                      Params.Desc ? (
                        " ▼"
                      ) : (
                        " ▲"
                      )
                    ) : (
                      <span style={{ opacity: 0 }}> ▼</span>
                    )}
                    {/* {
                      
                      column.isSorted
                      ? column.isSortedDesc
                          ? ' ▲'
                          : ' ▼'
                        :   <span style={{opacity:0}}> ▼</span>} */}
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
                    <>
                      {cell.column.Header !== " " ? (
                        cell.column.Header === "Assigned Date" ? (
                          <>
                            <td {...cell.getCellProps()}>
                              {new Date(cell.value).toLocaleDateString("en")}
                            </td>
                          </>
                        ) : (
                          <td {...cell.getCellProps()}>
                            {String(cell.value).substring(0, 20) +
                              (String(cell.value).length > 20 ? "..." : "")}
                          </td>
                        )
                      ) : (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      )}
                    </>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </div>
  );
}
export default Table;
