import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import ReactTable from "../../../components/ReactTable";
import DetailsComponent from "../../../components/DetailsComponent";
import { ParseDateTime } from "../../../utils/ParseDateTime";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import YesNoModal from "../../../components/rookiemodal/YesNoModal";
import Xcirclebtn from "../../../components/Button/Xcirclebtn";
import Editbtn from "../../../components/Button/Editbtn";
import { useHistory } from "react-router-dom";
import { onChangePageName } from "../../home/homeSlice";
const stateArr = ["Completed", "Waiting For Returning"];

const ReturnRequestTable = ({ listitem, onRefresh, params, setparams }) => {
  const [completeModalIsOpen, setCompleteModalIsOpen] = useState(false);
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);

  const [sort, setSort] = useState({
    sortDirection: "none",
    accessor: "some_accessor",
  });
  useEffect(() => {
    setSort({ direction: params.direction, accessor: params.orderProperty });
  }, [params]);

  const closeCompleteModal = () => {
    setCompleteModalIsOpen(false);
  };
  const closeCancelModal = () => {
    setCancelModalIsOpen(false);
  };

  const columns = [
    {
      Header: "Asset Code",
      id: "Code",
      accessor: "assignment.asset.code",
      sortDirection: sort.accessor === "Code" ? sort.direction : "none",
    },
    {
      Header: "Asset Name",
      id: "Name",
      accessor: "assignment.asset.name",
      sortDirection: sort.accessor === "Name" ? sort.direction : "none",
    },
    {
      Header: "Requested By",
      id: "RequestedBy",
      accessor: "nameRequestedBy",
      sortDirection: sort.accessor === "RequestedBy" ? sort.direction : "none",
    },
    {
      Header: "Assigned Date",
      id: "AssignedDate",
      accessor: "createdDate",
      sortDirection: sort.accessor === "AssignedDate" ? sort.direction : "none",
    },
    {
      Header: "Accepted By",
      id: "AcceptedBy",
      accessor: "nameAcceptedBy",
      sortDirection: sort.accessor === "AcceptedBy" ? sort.direction : "none",
    },
    {
      Header: "Returned Date",
      id: "ReturnedDate",
      accessor: "returnDate",
      sortDirection: sort.accessor === "ReturnedDate" ? sort.direction : "none",
    },
    {
      Header: "State",
      id: "State",
      accessor: (originalRow, rowIndex) => stateArr[originalRow.state],
      sortDirection: sort.accessor === "State" ? sort.direction : "none",
    },
    {
      Header: "Action",
      Cell: ({ row }) => {
        //console.log(row);
        return (
          <div className="rookie-group-btn">
            <Editbtn
              disabled={stateArr[row.original.state] === "Completed"}
              onClick={() => {
                setCompleteModalIsOpen(true);
              }}
            />
            <Xcirclebtn
              onClick={() => {
                setCancelModalIsOpen(true);
              }}
              disabled={stateArr[row.original.state] === "Completed"}
            />
          </div>
        );
      },
    },
  ];
  const columnHeaderClick = async (column) => {
    switch (column.sortDirection) {
      case "none":
        setSort({ direction: "ASC", accessor: column.id });
        setparams((prev) => ({
          ...prev,
          orderProperty: column.id,
          direction: "ASC",
        }));

        break;
      case "ASC":
        setSort({ direction: "DESC", accessor: column.id });
        setparams((prev) => ({
          ...prev,
          orderProperty: column.id,
          direction: "DESC",
        }));

        break;
      case "DESC":
        setSort({ direction: "ASC", accessor: "UpdatedDate" });
        setparams((prev) => ({
          ...prev,
          orderProperty: column.id,
          direction: "none",
        }));

        break;
    }
  };
  return (
    <>
      <ReactTable
        columns={columns}
        data={listitem}
        onHeaderClick={columnHeaderClick}
        onRowClick={() => {}}
      ></ReactTable>
      <YesNoModal
        title={"Are You Sure?"}
        modalIsOpen={completeModalIsOpen}
        closeModal={closeCompleteModal}
      >
        <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
          <p>Do you want to mark this returning request as 'Completed'?</p>
          <Button color="danger" onClick={() => closeCompleteModal()}>
            Yes
          </Button>
          <Button onClick={() => closeCompleteModal()} id="cancelUserBtn">
            No
          </Button>
        </div>
      </YesNoModal>
      <YesNoModal
        title={"Are You Sure?"}
        modalIsOpen={cancelModalIsOpen}
        closeModal={closeCancelModal}
      >
        <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
          <p>Do you want to cancel this returning request?</p>
          <Button color="danger" onClick={() => closeCancelModal()}>
            Yes
          </Button>
          <Button onClick={() => closeCancelModal()} id="cancelUserBtn">
            No
          </Button>
        </div>
      </YesNoModal>
    </>
  );
};

export default ReturnRequestTable;
