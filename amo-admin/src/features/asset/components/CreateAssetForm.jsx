import React from "react";
import { Formik } from "formik";
import { Input, FormGroup, Label, Col, Button, FormFeedback } from "reactstrap";
import { useDispatch } from "react-redux";
import { CreateAssetAsync } from "../assetSlice";
import { useHistory } from "react-router-dom";
import { sortAssetByUpdatedDate } from "../page/ManageAsset";
import RadioFieldV2 from "../../../components/custom-fields/RadioFieldV2";
const user = JSON.parse(localStorage.getItem("user"));
export default function CreateAssetForm(props) {
  const stateOptions = [
    { value: "0", label: "Available" },
    { value: "1", label: "Not Available" },
  ];
  const history = useHistory();
  const dispatch = useDispatch();
  const handleCancel = () => {
    history.push("/manageasset");
  };
  return (
    <div
      id="user-form"
      style={{
        paddingLeft: "10%",
        paddingRight: "30%",
      }}
    >
      <div className="titleview mb-3">Create New Asset</div>
      <Formik
        initialValues={{
          name: "",
          specification: "",
          installedDate: "",
          category: "",
          state: "0",
          categoryId: "",
          location: user.profile.location,
        }}
        validate={(values) => {
          const errors = {};
          const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;

          const result = specialChars.split("").some((specialChar) => {
            if (values.name.includes(specialChar)) {
              return true;
            }
            return false;
          });
          if (!values.name) {
            errors.name = "Required";
          } else if (result) {
            errors.name = "Name cannot contain special character!";
          }

          if (!values.specification) {
            errors.specification = "Required";
          }
          if (!values.installedDate) {
            errors.installedDate = "Required";
          }
          if (!values.category) {
            errors.category = "Required";
          }
          if (!values.state) {
            errors.state = "Required";
          }
          if (!errors.installedDate) {
            if (
              Object.prototype.toString.call(new Date(values.installedDate)) ===
              "[object Date]"
            ) {
              // it is a date
              if (isNaN(new Date(values.installedDate))) {
                // d.getTime() or d.valueOf() will also work
                // date object is not valid
                errors.installedDate = "Invalid date";
              } else {
                // date object is valid
                if (new Date(values.installedDate).getFullYear() > 9999)
                  errors.installedDate = "Invalid date";
              }
            } else {
              // not a date object
              errors.installedDate = "Invalid date";
            }
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(async () => {
            await dispatch(
              CreateAssetAsync({ code: values.category, data: values })
            );
            setSubmitting(false);
            sortAssetByUpdatedDate();
            history.push("/manageasset");
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValid,
        }) => (
          <form onSubmit={handleSubmit}>
            <FormGroup row>
              <Label for="name" sm={3}>
                Name
              </Label>
              <Col sm={9} className="position-relative">
                <Input
                  id="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  invalid={errors.name && touched.name}
                  maxLength={250}
                />
                <FormFeedback tooltip>{errors.name}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="category" sm={3}>
                Category
              </Label>
              <Col sm={9}>
                <Input
                  id="category"
                  name="select"
                  type="select"
                  onChange={() => {
                    var cate = document
                      .getElementById("category")
                      .value.split("/");
                    values.category = cate[0];
                    values.categoryId = cate[1];
                    document.getElementById("hidden-span").click();
                  }}
                >
                  <option value="" selected disabled hidden>
                    Choose here
                  </option>
                  {props.categories.map((cat) => {
                    return (
                      <option key={cat.id} value={cat.desc + "/" + cat.id}>
                        {cat.name}
                      </option>
                    );
                  })}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="specification" sm={3}>
                Specification
              </Label>
              <Col sm={9} className="position-relative">
                <Input
                  id="specification"
                  type="textarea"
                  rows="3"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.specification}
                  invalid={errors.specification && touched.specification}
                  maxLength={4000}
                />
                <FormFeedback tooltip>{errors.specification}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="installeddate-input" sm={3}>
                Installed Date
              </Label>
              <Col sm={9} className="position-relative">
                <Input
                  name="installedDate"
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.installedDate}
                  invalid={errors.installedDate && touched.installedDate}
                />
                <FormFeedback tooltip>{errors.installedDate}</FormFeedback>
                <span id="hidden-span" hidden onClick={handleChange} />
              </Col>
            </FormGroup>
            <RadioFieldV2
              label="State"
              field={{
                name: "state",
                onChange: handleChange,
                onBlur: handleBlur,
                value: values.state,
              }}
              options={stateOptions}
              form={{ errors, touched }}
            />
            <div className="text-end">
              <Button
                style={{ marginRight: "20px" }}
                id="btn-save"
                color="danger"
                type="submit"
                disabled={
                  !isValid ||
                  isSubmitting ||
                  (Object.keys(touched).length === 0 &&
                    touched.constructor === Object)
                }
              >
                Save
              </Button>
              <Button
                id="btn-cancel"
                outline
                disabled={isSubmitting}
                onClick={() => handleCancel()}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
