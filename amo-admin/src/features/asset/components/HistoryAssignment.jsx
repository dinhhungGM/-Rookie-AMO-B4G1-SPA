import React, { useEffect } from "react";
import ReactTable from "../../../components/HistoryReactTable";
import { getHistory } from "../assetSlice";
import { useSelector, useDispatch } from "react-redux";

const HistoryAssignment = ({ id }) => {
  const { history } = useSelector((state) => state.asset);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHistory({ id }));
  }, [id, dispatch]);
  const columns = [
    {
      Header: "Date",
      accessor: "assignedDate",
    },
    {
      Header: "Assigned To",
      accessor: "assignedTo",
    },
    {
      Header: "Assigned By",
      accessor: "assignedBy",
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
    },
  ];

  return (
    <div id="historyAssignmenttbl">
      {history && (
        <ReactTable
          columns={columns}
          data={history}
          onSort={function noRefCheck() {}}
          onRowClick={function noRefCheck() {}}
        ></ReactTable>
      )}
    </div>
  );
};

export default HistoryAssignment;
