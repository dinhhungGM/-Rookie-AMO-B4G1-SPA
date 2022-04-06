import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import UserForm from "../components/UserForm";

import {
  setUserId,
  setSort,
  setDesc,
  getUserById,
  updateUserAsync,
} from "../userSlice";
import { createNewUserAsync } from "../userSlice";
//import {onParamsChange} from '../userSlice';

const AddEdit = () => {
  const convertString = (date) => {
    if (date) {
      const array = date.split("/");
      return array[2] + "-" + array[1] + "-" + array[0];
    }
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  //const Params = useSelector(state => state.user.Params);
  const isAddMode = !userId;
  const { user: User } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    dispatch(getUserById(userId));
  }, [dispatch]);
  const initialValues = isAddMode
    ? {
        FirstName: "",
        LastName: "",
        Email: "",
        DateOfBirth: null,
        JoinedDate: null,
        Gender: "",
        Type: "Staff",
      }
    : {
        Id: User.id,
        FirstName: User.firstName,
        LastName: User.lastName,
        Email: User.email,
        DateOfBirth: convertString(User.dateOfBirth),
        JoinedDate: convertString(User.joinedDate),
        Gender: User.gender,
        Type: User.type,
      };

  const handleSubmit = async (values) => {
    if (isAddMode) {
      console.log("Add mode");
      console.log(values);
      await dispatch(createNewUserAsync(values));
      dispatch(setSort("codeStaff"));
      dispatch(setDesc(true));
      history.push("/manageuser");
    } else {
      dispatch(setUserId(values.Id));
      dispatch(updateUserAsync(values));
      console.log("Edit mode");
      history.push("/manageuser");
    }
  };
  return (
    <div
      id="user-form"
      style={{
        paddingLeft: "10%",
        paddingRight: "30%",
      }}
    >
      <div className="titleview mb-3" >
        {isAddMode ? "Create New User" : "Edit User"}
      </div>
     
        <UserForm
          isAddMode={isAddMode}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      
    </div>
  );
};

export default AddEdit;
