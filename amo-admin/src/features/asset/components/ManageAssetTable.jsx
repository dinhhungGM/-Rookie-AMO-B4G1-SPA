import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import ReactTable from "../../../components/ReactTable";
import DetailsComponent from "../../../components/DetailsComponent";
import { ParseDateTime } from "../../../utils/ParseDateTime";
import { onChangeParam, deleteAssetAsync } from "../assetSlice";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import Xcirclebtn from "../../../components/Button/Xcirclebtn";
import Editbtn from "../../../components/Button/Editbtn";
import { useHistory } from "react-router-dom";
import { onChangePageName } from "../../home/homeSlice";
import HistoryAssignment from "../../../features/asset/components/HistoryAssignment";
const stateArr = [
  "Available",
  "Not Available",
  "Assigned",
  "Waiting For Recycling",
  "Recycled",
];
const ManageAssetTable = ({ listitem, onRefresh, params, setparams }) => {
  const { isCreatedOrEdited } = useSelector((state) => state.asset);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [assetInfor, setAssetInfor] = useState(null);
  const [deleteAsset, setDeleteAsset] = useState(null);
  const [sort, setSort] = useState({
    sortDirection: "none",
    accessor: "some_accessor",
  });
  useEffect(() => {
    setSort({ direction: params.direction, accessor: params.orderProperty });
  }, [params]);
  const history = useHistory();
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setAssetInfor(null);
    setDeleteAsset(null);
    setIsOpen(false);
  }

  const handleRowClick = (dataRow) => {
    const code = dataRow.code == null ? "Is unavailable" : dataRow.code;
    console.log(dataRow);

    setAssetInfor({
      "Asset Code": code,
      "Asset Name": dataRow.name,
      Category: dataRow.category.name,
      "Installed Date": ParseDateTime(dataRow.installedDate),
      State: stateArr[dataRow.state],
      Location: dataRow.location,
      Specification: dataRow.specification,
      History: <HistoryAssignment id={dataRow.id} />,
    });
    openModal();
  };

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

  const dispatch = useDispatch();

  const handleChangePageName = (pagename) => {
    dispatch(onChangePageName(pagename));
  };

  const handleDeleteAsset = (id) => {
    setDeleteAsset(id);
    setAssetInfor(null);
    openModal();
  };

  const handleConfirmDeleteAsset = async () => {
    try {
      await dispatch(deleteAssetAsync({ id: deleteAsset }));
    } catch (error) {
      console.log("Failed to post user: ", error);
    }
    onRefresh();
    closeModal();
  };

  const columns = [
    {
      Header: "Asset Code",
      id: "Code",
      accessor: "code",
      sortDirection: sort.accessor === "Code" ? sort.direction : "none",
    },
    {
      Header: "Asset Name",
      id: "Name",
      accessor: "name",
      sortDirection: sort.accessor === "Name" ? sort.direction : "none",
    },
    {
      Header: "Category",
      id: "Category",
      accessor: "category.name",
      sortDirection: sort.accessor === "Category" ? sort.direction : "none",
    },
    {
      Header: "State",
      id: "State",
      accessor: (originalRow, rowIndex) => stateArr[originalRow.state],
      sortDirection: sort.accessor === "State" ? sort.direction : "none",
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="rookie-group-btn">
          <Editbtn
            disabled={stateArr[row.original.state] === "Assigned"}
            onClick={() => {
              handleChangePageName("Manage Asset > Edit Asset");
              history.push("/manageasset/editasset/" + row.original.id);
            }}
          />
          <Xcirclebtn
            onClick={() => {
              handleDeleteAsset(row.original.id);
            }}
            disabled={stateArr[row.original.state] === "Assigned"}
          />
        </div>
      ),
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
        if (isCreatedOrEdited) {
          setSort({ direction: "ASC", accessor: "UpdatedDate" });
          setparams((prev) => ({
            ...prev,
            orderProperty: "UpdatedDate",
            direction: "DESC",
          }));
        } else {
          setSort({ direction: "none", accessor: column.id });
          setparams((prev) => ({
            ...prev,
            orderProperty: column.id,
            direction: "none",
          }));
        }

        break;
    }
  };
  return (
    <>
      <ReactTable
        columns={columns}
        data={listitem}
        onRowClick={(e) => handleRowClick(e)}
        onHeaderClick={columnHeaderClick}
      ></ReactTable>
      <RookieModal
        title={deleteAsset ? "Are You Sure?" : "Detailed Asset Information"}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        customStyles={customStyles}
        isModalHeader={true}
      >
        {deleteAsset ? (
          <div
            style={{
              paddingTop: "10px",
              paddingBottom: "20px",
            }}
          >
            <div className="mb-3">Do you want to delete this asset?</div>
            <div className="d-flex">
              <Button
                color="danger"
                onClick={() => handleConfirmDeleteAsset()}
                className="me-2"
              >
                Delete
              </Button>
              <Button color="secondary" outline={true} onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        ) : assetInfor ? (
          <>
            <DetailsComponent list={assetInfor} />
            {/* <HistoryAssignment data={historyAssignment} /> */}
          </>
        ) : (
          ""
        )}
      </RookieModal>
    </>
  );
};

export default ManageAssetTable;
