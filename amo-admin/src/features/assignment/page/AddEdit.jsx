import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
// import assignmentApi from '../../../api/assignmentApi';
import getFormattedDate from "../../../utils/getFormattedDate";

import AssignmentForm from "../components/AssignmentForm";
import {
  createNewAssignmentAsync,
  getAssignmentById,
  updateAssignmentAsync,
  setParams,
} from "../assignmentSlice";
import { onChangePageName } from "../../home/homeSlice";

const AddEdit = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const isAddMode = !id;

  const [inputValue, setInputValue] = useState({
    UserId: "",
    AssetId: "",
    UserFullName: "",
    AssetName: "",
    AssignedDate: getFormattedDate(new Date()),
    Note: "",
    AssignmentId: "",
  });
  const [initialValues, setInitialValue] = useState({
    UserId: "",
    AssetId: "",
    UserFullName: "",
    AssetName: "",
    AssignedDate: getFormattedDate(new Date()),
    Note: "",
    AssignmentId: "",
  });
  const handleSubmit = async (values) => {
    const { AssetName, UserFullName, ...postValue } = values;
    console.log("submit");
    console.log(postValue);
    await dispatch(
      isAddMode
        ? createNewAssignmentAsync(postValue)
        : updateAssignmentAsync(postValue)
    );
    if (isAddMode) {
      dispatch(setParams({ key: "OrderProperty", value: "createdDate" }));
      dispatch(setParams({ key: "Desc", value: true }));
      dispatch(setParams({ key: "Page", value: 0 }));
    } else {
      dispatch(setParams({ key: "OrderProperty", value: "updatedDate" }));
      dispatch(setParams({ key: "Desc", value: true }));
      dispatch(setParams({ key: "Page", value: 0 }));
    }
    dispatch(onChangePageName("Manage Assignment"));
    history.push("/manageassignment");
  };

  useEffect(() => {
    if (id) dispatch(getAssignmentById(id));
  }, [dispatch, isAddMode, id]);
  return (
    <div
      id="assignment-form"
      style={{
        width: "594px",
      }}
    >
      <div className="titleview mb-3">
        {isAddMode ? "Create New Assignment" : "Edit Assignment"}
      </div>
      <AssignmentForm
        isAddMode={isAddMode}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        setInputValue={setInputValue}
        setInitialValue={setInitialValue}
        inputValue={inputValue}
      />
    </div>
  );
};

export default AddEdit;
