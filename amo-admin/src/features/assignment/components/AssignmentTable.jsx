import React, { useEffect, useState } from "react";
import { JsonTable } from "react-json-to-html";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
// import assignmentApi from "../../../../api/assignmentApi";
// import requestApi from "../../../../api/requestApi";
import Arrowcircle from "../../../components/Button/Arrowcircle";
import Editbtn from "../../../components/Button/Editbtn";
import Xcirclebtn from "../../../components/Button/Xcirclebtn";
import ReactTable from "../../../components/ReactTable";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import YesNoModal from "../../../components/rookiemodal/YesNoModal";
import { setParams } from "../assignmentSlice";
import Table from "./TableList";
const AssignmentTable = ({ listitem, onRefresh }) => {
  

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalRequestIsOpen, setmodalRequestIsOpen] = useState(false)
  const [assignmentInfor, setAssignmentInfor] = useState(null);
  const {params:Params} = useSelector((state)=>state.assignment)
  const history = useHistory();

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setAssignmentInfor(null);
    setIsOpen(false);
  }
  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const handleDisableAssignment = async (id) => {
    setAssignmentInfor(null);
    openModal();
  };
  const handleConfirmDisableAssignment = async () => {
    // try {
    //   await assignmentApi.delete(deleteAssignment);
    //   onRefresh();
    //   setParams({ ...Params, OrderProperty: "UpdatedDate" });
    // } catch (error) {
    //   console.log("Failed to post user: ", error);
    // }
    closeModal();
  };
  const capitalize1st = (s) => s && s[0].toUpperCase() + s.slice(1);
 const dispatch =useDispatch();
  const handleOnSort = (e) => {
    console.log(e)
    if (e[0]) {
      dispatch(setParams({key:"OrderProperty", value:e[0].id}));
      dispatch(setParams({key:"Desc", value:e[0].desc}));
    }else{
      dispatch(setParams({key:"OrderProperty", value:''}));
      dispatch(setParams({key:"Desc", value:false}));
    }
  };
  
  const handleRowClick = (dataRow) => {
    setAssignmentInfor({
      "Asset Code": dataRow.assetCode,
      "Asset Name": dataRow.assetName,
      "Specification": dataRow.assetSpecification,
      "Assigned To": dataRow.assignedTo,
      "Assigned By": dataRow.assignedBy,
      "Assigned Date": dataRow.assignedDate,
      State: dataRow.state,
      Note: dataRow.note,
    });
    openModal();
  };


  const handleCreateRequestReturing = (e, value) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.profile["sub"];
    const request = { Id: value.id, UserId: userId };
  }
  const closeRequestModal = () => {
    setmodalRequestIsOpen(false)
  }
  const handleCreateReturnRequest = () => {
    const createRequest = async () => {
      // try {
      //   await requestApi.createreturnrequest(requestReturn);
      //   onRefresh();
      // } catch (error) {
      //   console.log("Failed to create Request: ", error);
      // }
    }
    createRequest();
    closeRequestModal();
  }
  function checkRequest(stateName, requestid) {
    if (requestid !== null) {
      return true;
    }
    if (stateName === "Waiting for accept") {
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
      Header: "Assigned to",
      accessor: "userNameAssignedTo",
    },
    {
      Header: "Assigned by",
      accessor: "userNameAssignedBy",
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
          <Editbtn
            onClick={() => history.push(`/manageassignment/${row.original.id}`)}
            disabled={row.original.state === "Accepted"}
          />
          <span style = {{'marginLeft': '15px', 'marginRight':'15px'}}>
            <Xcirclebtn
              onClick={() => handleDisableAssignment(row.original.id)}
              disabled={row.original.state === "Accepted"}
            />
          </span>
          <Arrowcircle
            onClick={(e) => handleCreateRequestReturing(e, row.original)}
            //onClick={() => handleDisableAssignment(row.original.id)}
            disabled={checkRequest(row.original.state,row.original.requestAssignmentId)}
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
        onSort={(e) => handleOnSort(e)}
        onRowClick={(e) => handleRowClick(e)}
      ></Table>
      {true ?
        <YesNoModal
          title={"Are You Sure?"}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          customStyles={customStyles}
        >
          <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
            <p>Do you want to delete this assignment?</p>
            <Button
              color="danger"
              onClick={() => handleConfirmDisableAssignment()}
            >
              Delete
            </Button>
            <Button onClick={() => closeModal()} id="cancelUserBtn">
              Cancel
            </Button>
          </div>
        </YesNoModal>
        :
        <RookieModal
          title={true ? "Are You Sure?" : "Assignment Details"}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          customStyles={customStyles}
        >
          {
            assignmentInfor ? (
              <JsonTable json={assignmentInfor} />
            ) :
              ""
          }
        </RookieModal>

      }

      <YesNoModal
        title="Are you sure?"
        modalIsOpen={modalRequestIsOpen}
        closeModal={closeRequestModal}
        customStyles={customStyles}
      >
        <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
          <p>Do you want to create a returning request for this asset?</p>
          <Button
            color="danger"
            onClick={() => handleCreateReturnRequest()}
          >
            Yes
          </Button>
          <Button onClick={() => closeRequestModal()} id="cancelUserBtn">
            No
          </Button>
        </div>
      </YesNoModal>
    </>
  );
};

export default AssignmentTable;
