import React, { useEffect, useState } from "react";
import { JsonTable } from "react-json-to-html";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import assetApi from "../../../api/assetApi";
import ReactTable from "../../../components/ReactTable";

import { ParseDateTime } from "../../../utils/ParseDateTime";
import { onListChange, onChangeParam } from "../assetSlice";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import YesNoModal from "../../../components/rookiemodal/YesNoModal";
import Xcirclebtn from "../../../components/Button/Xcirclebtn";
import Editbtn from "../../../components/Button/Editbtn";
import { useHistory } from "react-router-dom";
const stateArr = [
  "Available",
  "Not Available",
  "Assigned",
  "Waiting For Recycling",
  "Recycled",
];
const ManageAssetTable = ({ listitem, onRefresh, params, setparams }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  //const params = useSelector((state) => state.asset.params);
  const [assetInfor, setAssetInfor] = useState(null);
  const [deleteAsset, setDeleteAsset] = useState(null);
  const [sort, setSort] = useState({
    sortDirection: "none",
    accessor: "some_accessor",
  });
  //  useEffect(() => {
  //     setSort({ direction: params.direction, accessor: params.orderProperty });
  //   }, [params]);
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
            disabled={false}
            onClick={() =>
              history.push("/manageasset/editasset/" + row.original.id)
            }
          />
          <Xcirclebtn
            onClick={() => {
              handleDeleteAsset(row.original.id);
            }}
            disabled={false}
          />
        </div>
      ),
    },
  ];
  const columnHeaderClick = async (column) => {
    console.log(column);
    switch (column.sortDirection) {
      case "none":
        setSort({ direction: "ASC", accessor: column.id });
        // const desc = await getClients( 'ASC', column.id );
        // setData(desc);
        setparams((prev) => ({
          ...prev,
          orderProperty: column.id,
          direction: "ASC",
        }));

        break;
      case "ASC":
        setSort({ direction: "DESC", accessor: column.id });
        // const asc = await getClients('DESC', column.id);
        // setData(asc);
        setparams((prev) => ({
          ...prev,
          orderProperty: column.id,
          direction: "DESC",
        }));

        break;
      case "DESC":
        setSort({ direction: "none", accessor: column.id });
        setparams((prev) => ({
          ...prev,
          orderProperty: column.id,
          direction: "none",
        }));

        // const newData = await getClients('none', column.id);
        // setData(newData);
        break;
    }
  };
  return (
    <>
      <ReactTable
        columns={columns}
        data={listitem}
        onSort={(e) => handleOnSort(e)}
        onRowClick={(e) => handleRowClick(e)}
        onHeaderClick={columnHeaderClick}
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
