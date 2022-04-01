import React, { useState } from "react";
import { JsonTable } from "react-json-to-html";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Button } from "reactstrap";
import assetApi from "../../../api/assetApi";
import ReactTable from "../../../components/ReactTable";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import { ParseDateTime } from "../../../utils/ParseDateTime";
import { onListChange, onChangeParam } from "../assetSlice";

const ManageAssetTable = ({ listitem, onRefresh }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const params = useSelector((state) => state.asset.params);
  const [assetInfor, setAssetInfor] = useState(null);
  const [deleteAsset, setDeleteAsset] = useState(null);

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
      Category: dataRow.categoryName,
      "Installed Date": ParseDateTime(dataRow.installedDate),
      State: dataRow.state,
      Location: dataRow.location,
      Specification: dataRow.specification,
      //History: dataRow.id,
    });
    console.log(assetInfor);
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

  const handleDeleteAsset = (id) => {
    setDeleteAsset(id);
    setAssetInfor(null);
    openModal();
  };

  const handleConfirmDeleteAsset = async () => {
    try {
      await assetApi.delete(deleteAsset);
      dispatch(onListChange());
    } catch (error) {
      console.log("Failed to post user: ", error);
    }
    onRefresh();
    closeModal();
  };

  const handleOnSort = (e) => {
    if (e[0])
      dispatch(
        onChangeParam({
          ...params,
          OrderProperty: e[0].id,
          Desc: e[0].desc,
        })
      );
    console.log(e);
    console.log("called");
  };

  const columns = [
    {
      Header: "Asset Code",
      accessor: "code",
    },
    {
      Header: "Asset Name",
      accessor: "name",
    },
    {
      Header: "Category",
      accessor: "categoryName",
    },
    {
      Header: "State",
      accessor: "state",
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div>
          <Button
            color="danger"
            onClick={() => history.push("/manageasset/" + row.original.id)}
          >
            Edit
          </Button>{" "}
          <Button
            color="danger"
            onClick={() => handleDeleteAsset(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ReactTable
        columns={columns}
        data={listitem}
        onSort={(e) => handleOnSort(e)}
        onRowClick={(e) => handleRowClick(e)}
      ></ReactTable>
      <RookieModal
        title={deleteAsset ? "Are You Sure?" : "Detailed Asset Information"}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        customStyles={customStyles}
      >
        {deleteAsset ? (
          <>
            <div>Do you want to delete this asset?</div>
            <Button color="danger" onClick={() => handleConfirmDeleteAsset()}>
              Delete
            </Button>
          </>
        ) : assetInfor ? (
          <JsonTable json={assetInfor} />
        ) : (
          ""
        )}
      </RookieModal>
    </>
  );
};

export default ManageAssetTable;
