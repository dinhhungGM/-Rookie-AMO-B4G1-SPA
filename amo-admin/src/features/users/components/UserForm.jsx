import { FastField, Form, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router";
import { Button, FormGroup, Spinner } from "reactstrap";
import * as Yup from "yup";
import InputField from "../../../components/custom-fields/InputField";
import RadioField from "../../../components/custom-fields/RadioField";
import SelectField from "../../../components/custom-fields/SelectField";
import { useDispatch } from "react-redux";
import { onChangePageName } from "../../home/homeSlice";

UserForm.propTypes = {
  onSubmit: PropTypes.func,
};

UserForm.defaultProps = {
  onSubmit: null,
};
const TYPE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Staff", label: "Staff" },
];
const GENRE_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];
function UserForm(props) {
  const { initialValues, isAddMode } = props;
  const dispatch = useDispatch();

  const history = useHistory();
  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function getAge1(Birthday, Joindate) {
    var birthday = new Date(Birthday);
    var joinedDate = new Date(Joindate);
    var age = joinedDate.getFullYear() - birthday.getFullYear();
    var m = joinedDate.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && joinedDate.getDate() < birthday.getDate())) {
      age--;
    }
    console.log(age);
    return age;
  }

  const validationSchema = Yup.object().shape({
    Email: Yup.string()
      .required("This field is required.")
      .email("Invalid email"),
    FirstName: Yup.string()
      .required("This field is required.")
      .test(
        "FirstName",
        "Invalid First Name, it must have max length less than or equal 100 character and contain character from A-Z, a-z",
        (value) => {
          if (value) return value.length <= 100 && /^[a-zA-Z]+$/.test(value);
        }
      ),
    LastName: Yup.string()
      .required("This field is required.")
      .test(
        "LastName",
        "Invalid Last Name, it must have max length less than or equal 100 character and contain character from A-Z, a-z",
        (value) => {
          if (value) return value.length <= 100 && /^[a-zA-Z ]+$/.test(value);
        }
      ),
    Type: Yup.string().required("This field is required.").nullable(),
    DateOfBirth: Yup.string()
      .required("This field is required.")
      .test(
        "DateOfBirth",
        "User is under 18. Please select a different date",
        (value) => {
          return getAge(value) >= 18;
        }
      )
      .nullable(),

    JoinedDate: Yup.date()
      .required("This field is required.")
      .when(["DateOfBirth"], (DateOfBirth, a) => {
        if (DateOfBirth) {
          return Yup.date()
            .min(
              DateOfBirth,
              "Joined date is not later than Date of Birth. Please select a different date"
            )
            .test(
              "JoinedDate",
              "Joined date is Saturday or Sunday. Please select a different date",
              (value) => {
                const day = new Date(value).getDay();
                if (day === 0 || day === 6) return false;
                else return true;
              }
            )
            .test(
              "JoinedDate",
              "User must be at least 18 years old",
              (value) => {
                return getAge1(DateOfBirth, value) >= 18;
              }
            );
        }
      })
      .test(
        "JoinedDate",
        "Join Date must be less than or equal to today",
        (value) => {
          return value <= Date.now();
        }
      )
      .nullable(),

    Gender: Yup.string().required("A radio option is required"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={props.onSubmit}
      id="form"
    >
      {(formikProps) => {
        // do something here ...
        const { isSubmitting } = formikProps;

        return (
          <Form>
            <FastField
              name="FirstName"
              component={InputField}
              disabled={!isAddMode}
              label="First Name"
              placeholder="Eg: Wow nature ..."
              id="FirstName"
            />

            <FastField
              name="LastName"
              component={InputField}
              id="LastName"
              disabled={!isAddMode}
              label="Last Name"
              placeholder="Eg: Wow nature ..."
            />

            {isAddMode ? (
              <>
                <FastField
                  name="Email"
                  component={InputField}
                  id="Email"
                  label="Email"
                  placeholder="Eg: Wow nature ..."
                />
              </>
            ) : (
              ""
            )}

            <FastField
              name="DateOfBirth"
              component={InputField}
              id="DateOfBirth"
              type="date"
              label="Date of Birth"
              placeholder="Eg: Wow nature ..."
            />
            <RadioField
              options={GENRE_OPTIONS}
              name="Gender"
              label="Gender"
              id="gender"
            />
            <FastField
              name="JoinedDate"
              component={InputField}
              id="JoinedDate"
              type="date"
              label="Joined Date"
              placeholder="Eg: Wow nature ..."
            />
            <FastField
              name="Type"
              component={SelectField}
              id="Type"
              label="Type"
              placeholder="What's your user type?"
              options={TYPE_OPTIONS}
            />

            <FormGroup
              style={{
                float: "right",
              }}
            >
              <Button
                type="submit"
                id="submit"
                disabled={!(formikProps.dirty && formikProps.isValid)}
                color="danger"
                style={{
                  marginRight: "18px",
                }}
              >
                {isSubmitting && <Spinner size="sm" />}
                Save
              </Button>{" "}
              <Button
                onClick={() => {
                  dispatch(onChangePageName("Manage User"));
                  history.push("/manageuser");
                }}
                id="cancel"
                outline
              >
                Cancel
              </Button>
            </FormGroup>
          </Form>
        );
      }}
    </Formik>
  );
}

export default UserForm;
