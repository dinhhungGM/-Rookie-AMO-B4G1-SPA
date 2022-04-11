import { FastField, Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Button, FormGroup, Spinner } from "reactstrap";
import * as Yup from "yup";
import InputField from "../../../components/custom-fields/InputField/index";
import InputFieldForList from "../../../components/custom-fields/InputField/inputShowList";
import RookieModal from "../../../components/rookiemodal/RookieModal";
import AvailableAssetList from "./AvailableAssetList";
import UserList from "./UserList";
import { onChangePageName } from "../../home/homeSlice";
// import { onChangePageName } from "../assignmentManagerSlice";
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

  //   const handleChangePageName = (pagename) => {
  //     dispatch(onChangePageName(pagename))
  //   }

  const onSelectAssetValue = (id, name) => {
    setInputValue({ ...inputValue, AssetID: id, AssetName: name });
  };
  const onSelectUserValue = (id, name) => {
    setInputValue({ ...inputValue, UserID: id, UserFullName: name });
  };
  const onSave = (setFieldValue) => {
    setFieldValue("UserId", inputValue.UserID);
    setFieldValue("UserFullName", inputValue.UserFullName);
    setFieldValue("AssetId", inputValue.AssetID);
    setFieldValue("AssetName", inputValue.AssetName);
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
          return IsGreaterThanOrEqualToday(value);
        }
      )
      .nullable(),

    Note: Yup.string().test(
      "len",
      "Exceeded characters",
      (val) => !val || val.length <= 1000
    ),
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
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
                    />
                    <FastField
                      name="Note"
                      component={InputField}
                      type="textarea"
                      label="Note"
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
                    disabled={!(formikProps.dirty && formikProps.isValid)}
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
                      // handleChangePageName("Manage Assignment")
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
                    checked={inputValue.AssetID}
                    onSave={() => onSave(setFieldValue)}
                    currentValue={selectedValue.AssetID}
                    onClose={closeModal}
                  />
                ) : (
                  <UserList
                    onSelectValue={onSelectUserValue}
                    checked={inputValue.UserID}
                    onSave={() => onSave(setFieldValue)}
                    currentValue={selectedValue.UserID}
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
