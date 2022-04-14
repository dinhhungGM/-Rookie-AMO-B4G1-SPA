import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";
import Checkbtn from "../../../components/Button/Checkbtn";
import Arrowcircle from "../../../components/Button/Arrowcircle";
import Xcirclebtn from "../../../components/Button/Xcirclebtn";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import YesNoModal from "../../../components/rookiemodal/YesNoModal";
import DetailsComponent from "../../../components/DetailsComponent";
import Table from "./TableList";
import {
  acceptAssignment,
  declineAssignment,
  setIdAssignment,
  onListChange,
} from "../homeSlice";
import { CreateReturnRequestAsync } from "../../returnRequest/returnRequestSlice";

const HomeTable = ({ listitem, onRefresh }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalRequestIsOpen, setmodalRequestIsOpen] = useState(false);
  const [assignmentInfor, setAssignmentInfor] = useState(null);
  const [Id, setAssignmentId] = useState(false);
  const [type, setType] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setAssignmentId(null);
    setType(false);
    setAssignmentInfor(null);
    setmodalRequestIsOpen(false);
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "auto",
      transform: "translate(-50%, -50%)",
    },
  };

  const dispatch = useDispatch();

  const handleRowClick = (dataRow) => {
    setAssignmentInfor({
      "Asset Code": dataRow.asset.code,
      "Asset Name": dataRow.asset.name,
      Specification: dataRow.asset.specification,
      "Assigned To": dataRow.userNameAssignedTo,
      "Assigned By": dataRow.userNameAssignedBy,
      "Assigned Date": new Date(dataRow.assignedDate).toLocaleDateString("vi"),
      State: dataRow.state,
      Note: dataRow.note,
    });
    openModal();
  };

  const handleAcceptAssign = (id) => {
    setType(true);
    setAssignmentId(id);
    openModal();
  };

  const handleDeclineAssign = (id) => {
    setType(false);
    setAssignmentId(id);
    openModal();
  };

  const handleSubmitAcceptAssign = async () => {
    await dispatch(acceptAssignment(Id));
    await dispatch(setIdAssignment(Id));
    dispatch(onListChange());
    closeModal();
  };

  const handleSubmitDeclineAssign = async () => {
    await dispatch(declineAssignment(Id));
    await dispatch(setIdAssignment(Id));
    dispatch(onListChange());
    closeModal();
  };

  const handleCreateRequestReturing = (e, id) => {
    setmodalRequestIsOpen(true);
    setAssignmentId(id);
  };

  const handleCreateReturnRequest = async () => {
    await dispatch(CreateReturnRequestAsync(Id));
    onRefresh();
    closeModal();
  };

  function checkRequest(stateName, requestid) {
    if (stateName !== "Accepted" || requestid !== null) {
      return true;
    }
    return false;
  }

  const columns = [
    {
      Header: "Asset Code",
      accessor: "asset.code",
    },
    {
      Header: "Asset Name",
      accessor: "asset.name",
    },
    {
      Header: "Category",
      accessor: "asset.category.name",
    },
    {
      Header: "Assigned Date",
      accessor: "assignedDate",
    },
    {
      Header: "State",
      accessor: "state",
    },
    {
      Header: " ",
      Cell: ({ row }) => (
        <div className="rookie-group-btn">
          <Checkbtn
            onClick={(e) => handleAcceptAssign(row.original.id)}
            disabled={row.original.state === "Accepted"}
          />
          <span style={{ marginLeft: "15px", marginRight: "15px" }}>
            <Xcirclebtn
              onClick={(e) => handleDeclineAssign(row.original.id)}
              disabled={row.original.state === "Accepted"}
            />
          </span>
          <Arrowcircle
            onClick={(e) => handleCreateRequestReturing(e, row.original.id)}
            disabled={checkRequest(
              row.original.state,
              row.original.returnRequestId,
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={listitem}
        onRowClick={(e) => handleRowClick(e)}
      ></Table>
      {Id ? (
        modalRequestIsOpen ? (
          <YesNoModal
            title={"Are You Sure?"}
            modalIsOpen={modalRequestIsOpen}
            closeModal={closeModal}
            customStyles={customStyles}
          >
            <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
              <p>Do you want to create a returning request for this asset?</p>
              <Button
                color="danger"
                onClick={() => handleCreateReturnRequest()}
              >
                Create
              </Button>
              <Button onClick={() => closeModal()} id="cancelUserBtn">
                Cancel
              </Button>
            </div>
          </YesNoModal>
        ) : type ? (
          <YesNoModal
            title={"Are You Sure?"}
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            customStyles={customStyles}
          >
            <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
              <p>Do you want to accept this assignment?</p>
              <Button color="danger" onClick={() => handleSubmitAcceptAssign()}>
                Accept
              </Button>
              <Button onClick={() => closeModal()} id="cancelUserBtn">
                Cancel
              </Button>
            </div>
          </YesNoModal>
        ) : (
          <YesNoModal
            title={"Are You Sure?"}
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            customStyles={customStyles}
          >
            <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
              <p>Do you want to decline this assignment?</p>
              <Button
                color="danger"
                onClick={() => handleSubmitDeclineAssign()}
              >
                Delete
              </Button>
              <Button onClick={() => closeModal()} id="cancelUserBtn">
                Cancel
              </Button>
            </div>
          </YesNoModal>
        )
      ) : (
        <RookieModal
          title={Id ? "Are You Sure?" : "Assignment Details"}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          customStyles={customStyles}
          isModalHeader={true}
        >
          {assignmentInfor ? (
            <>
              <DetailsComponent list={assignmentInfor} />
            </>
          ) : (
            ""
          )}
        </RookieModal>
      )}
    </>
  );
};

export default HomeTable;
