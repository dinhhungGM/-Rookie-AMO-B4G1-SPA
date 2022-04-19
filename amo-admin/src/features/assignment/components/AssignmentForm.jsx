import { FastField, Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Button, FormGroup, Spinner } from "reactstrap";
import * as Yup from "yup";
import InputField from "../../../components/custom-fields/InputField/index";
import InputFieldForList from "../../../components/custom-fields/InputField/inputShowList";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import AvailableAssetList from "./AvailableAssetList";
import UserList from "./UserList";
import { onChangePageName } from "../../home/homeSlice";
import getFormattedDate from "../../../utils/getFormattedDate";
import {setPreAsset, setPreUser} from "../assignmentSlice";

AssignmentForm.propTypes = {
  onSubmit: PropTypes.func,
};

AssignmentForm.defaultProps = {
  onSubmit: null,
};

function AssignmentForm(props) {
  const { initialValues, isAddMode, setInputValue, inputValue, onSubmit } =
    props;
  const [selectedValue, setSelectedValue] = useState(initialValues);
  const [modelSwitch, setModelSwitch] = useState();
  const history = useHistory();
  const [modalIsOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const {assignment} = useSelector(state => state.assignment);

  const onSelectAssetValue = (id, name) => {
    setInputValue({ ...inputValue, AssetId: id, AssetName: name });
  };
  const onSelectUserValue = (id, name) => {
    setInputValue({ ...inputValue, UserId: id, UserFullName: name });
  };
  const onSave = (setFieldValue) => {
    setFieldValue("UserId", inputValue.UserId);
    setFieldValue("UserFullName", inputValue.UserFullName);
    setFieldValue("AssetId", inputValue.AssetId);
    setFieldValue("AssetName", inputValue.AssetName);
    dispatch(setPreAsset({
      id: inputValue.AssetId,
      name: inputValue.AssetName
    }));
    dispatch(setPreUser({
      id: inputValue.UserId,
      name: inputValue.UserFullName
    }));
    setSelectedValue(inputValue);
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedValue(initialValues);
  }, [initialValues]);

  const openAssetModal = async () => {
    setModelSwitch(2);
    setIsOpen(true);
  };
  const openUserModal = async () => {
    setModelSwitch(1);
    setIsOpen(true);
  };
  function closeModal() {
    setIsOpen(false);
    
  }
  const modalStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  function IsGreaterThanOrEqualToday(dateString) {
    var today = new Date().setHours(0, 0, 0, 0);
    var assignedDate = new Date(dateString).setHours(0, 0, 0, 0);
    return today <= assignedDate;
  }

  function isEmpty(value) {
    return (
        value === null || // check for null
        value === undefined || // check for undefined
        value === '' || // check for empty string
        (Array.isArray(value) && value.length === 0) || // check for empty array
        (typeof value === 'object' && Object.keys(value).length === 0) // check for empty object
    );
 }

  function checkSelectedValueValid(values) {
    if (
      isEmpty(values.UserId) || 
      isEmpty(values.AssetId) ||
      isEmpty(values.AssignedDate) 
    ) {
      return false;
    }
    
    if (!IsGreaterThanOrEqualToday(values.AssignedDate) && isAddMode) {
      return false;
    }
    return true;
  }



  const validationSchema = Yup.object().shape({
    AssetName: Yup.string().required("This field is required."),
    UserFullName: Yup.string().required("This field is required."),
    UserId: Yup.string().required("This field is required."),
    AssetId: Yup.string().required("This field is required."),

    
    AssignedDate: Yup.string()
      .required("This field is required.")
      .test(
        "AssignedDate",
        "Must be greater than or equal to today",
        (value) => {
          return true;
        }
      ),
    Note: Yup.string().test(
      "Note",
      "Exceeded characters",
      (val) => !val || val.length <= 1000
    ).optional()
    .nullable(),
  });


  useEffect(() => {
    if (!isAddMode) {
      console.log(assignment) 
      setSelectedValue({
        UserId: assignment?.assignedTo,
        AssetId: assignment?.assetId,
        UserFullName: assignment?.userNameAssignedTo,
        AssetName:assignment?.asset?.name,
        AssignedDate: getFormattedDate(new Date(assignment?.assignedDate)),
        Note: assignment?.note,
      });
      setInputValue({
        UserId: assignment?.assignedTo,
        AssetId: assignment?.assetId,
        UserFullName: assignment?.userNameAssignedTo,
        AssetName:assignment?.asset?.name,
        AssignedDate: getFormattedDate(new Date(assignment?.assignedDate)),
        Note: assignment?.note,
        AssignmentId: assignment?.id
      })
      dispatch(setPreAsset({
        id: assignment?.assetId,
        name: assignment?.asset?.name
      }))
      dispatch(setPreUser({
        id: assignment?.assignedTo,
        name: assignment?.userNameAssignedTo
      }))
      
    }
  }, [dispatch, isAddMode, assignment, setInputValue]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={inputValue}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formikProps) => {
          // do something here ...
          const { isSubmitting, setFieldValue } = formikProps;
          
          return (
            <>
              <Form>
                {isAddMode ? (
                  <>
                    <Field
                      name="UserFullName"
                      value={selectedValue.UserFullName}
                      inputClassName="input-icon"
                      onClick={openUserModal}
                      component={InputFieldForList}
                      label="User"
                    />
                    

                    <Field
                      name="AssetName"
                      value={selectedValue.AssetName}
                      inputClassName="input-icon"
                      onClick={openAssetModal}
                      component={InputFieldForList}
                      label="Asset"
                    />

                  
                    <FastField
                      name="AssignedDate"
                      component={InputField}
                      type="date"
                      label="Assigned Date"
                      
                      
                    />

                    <FastField
                      name="Note"
                      component={InputField}
                      type="textarea"
                      label="Note"
                    />
                  </>
                ) : (
                  <>
                    <Field
                      name="UserFullName"
                      value={selectedValue.UserFullName}
                      inputClassName="input-icon"
                      onClick={openUserModal}
                      component={InputFieldForList}
                      label="User"
                    />
                    
                    <Field
                      name="AssetName"
                      value={selectedValue.AssetName}
                      inputClassName="input-icon"
                      onClick={openAssetModal}
                      component={InputFieldForList}
                      label="Asset"
                    />
                   
                    <FastField
                      name="AssignedDate"
                      component={InputField}
                      type="date"
                      label="Assigned Date"
                      mode="edit"
                    />
                    <FastField
                      name="Note"
                      component={InputField}
                      type="textarea"
                      label="Note"
                      value={selectedValue.Note}
                    />
                  </>
                )}
                <FormGroup
                  style={{
                    float: "right",
                    marginRight: "13px",
                  }}
                >
                  <Button
                    type="submit"
                    disabled={isAddMode ? !(checkSelectedValueValid(selectedValue) && formikProps.isValid) : !checkSelectedValueValid(selectedValue)}
                    color="danger"
                    style={{
                      marginRight: "18px",
                    }}
                  >
                    {isSubmitting && <Spinner size="sm" />}
                    {isAddMode ? "Save" : "Update"}
                  </Button>{" "}
                  <Button
                    outline
                    onClick={() => {
                      dispatch(onChangePageName("Manage Assginment"));
                      history.push("/manageassignment");
                    }}
                  >
                    Cancel
                  </Button>
                </FormGroup>
              </Form>
              <RookieModal
                title="Select List"
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                customStyles={modalStyles}
              >
                {modelSwitch === 2 ? (
                  <AvailableAssetList
                    onSelectValue={onSelectAssetValue}
                    checked={inputValue.AssetId}
                    onSave={() => onSave(setFieldValue)}
                    currentValue={selectedValue.AssetId}
                    onClose={closeModal}
                  />
                ) : (
                  <UserList
                    onSelectValue={onSelectUserValue}
                    checked={inputValue.UserId}
                    onSave={() => onSave(setFieldValue)}
                    currentValue={selectedValue.UserId}
                    onClose={closeModal}
                  />
                )}
              </RookieModal>
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default AssignmentForm;
