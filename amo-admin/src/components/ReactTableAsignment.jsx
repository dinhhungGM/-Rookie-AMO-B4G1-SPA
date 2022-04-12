import { useTable, useSortBy } from "react-table";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import "./table.css";

function Table({ columns, data, onRowClick, onSort, tableName }) {
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
  const { sort: SortUser, desc: DescUser } = useSelector((state) => state.user);
  const { orderProperty: SortAsset, direction: DescAsset } = useSelector(
    (state) => state.asset
  );
  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows;
  useEffect(() => {
    onSort(sortBy);
  }, [sortBy]);
  console.log(tableName);
  return (
    <>
      <table {...getTableProps()} className="table_mix">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, _idx) => {
                

                console.log(SortAsset)
                return (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="header_of_table"
                    style={_idx !== 0 ? { borderBottom: "1px solid" } : {}}
                  >
                    {column.render("Header")}
                   
                    <span>
                      {
                        _idx !== 0 ? 
                        tableName === "users"
                          ? SortUser === column.id
                            ? DescUser
                              ? " ▼"
                              : " ▲"
                            : ""
                          : tableName === "assets"
                          ? column.sortDirection === "ASC"
                            ? " ▼"
                            : " ▲"
                          : ""
                        : ""
                       }
                    </span>
                  </th>
                );
              })}
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
                {row.cells.map((cell, _idx) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={_idx !== 0 ? "inline_bottom" : ""}
                      style={_idx === 0 ? { width: "7%" } : {}}
                    >
                      {cell.render("Cell")}
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
