import React, { useEffect, useRef } from "react";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import { getHistory, deleteAssetAsync } from "../assetSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
const DeleteAssetModal = ({ id, modalIsOpen, closeModal, onRefresh }) => {
  const firstRenderRef = useRef(true);
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
  const { history } = useSelector((state) => state.asset);
  const dispatch = useDispatch();
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    dispatch(getHistory({ id }));
  }, [id]);
  const handleConfirmDeleteAsset = async () => {
    try {
      await dispatch(deleteAssetAsync({ id }));
    } catch (error) {
      console.log("Failed to post user: ", error);
    }
    onRefresh();
    closeModal();
  };
  return (
    <RookieModal
      title={history.length === 0 ? "Are You Sure?" : "Cannot Delete Asset"}
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      customStyles={customStyles}
      isModalHeader={true}
    >
      {history.length === 0 ? (
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
      ) : (
        <div
          style={{
            paddingTop: "10px",
            paddingBottom: "20px",
          }}
        >
          <div className="mb-3">
            Cannot delete the asset because it belongs to one or more historical
            assignments.
            <br />
            If the asset is not able to be used anymore please update its state
            in <Link to={"/manageasset/editasset/" + id}>Edit Asset page</Link>
          </div>
        </div>
      )}
    </RookieModal>
  );
};

export default DeleteAssetModal;
