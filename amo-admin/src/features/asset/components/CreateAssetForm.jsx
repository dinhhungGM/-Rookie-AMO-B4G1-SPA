import React from "react";
import { Formik } from "formik";
import { Input, FormGroup, Label, Col, Button, FormFeedback } from "reactstrap";
import { useDispatch } from "react-redux";
import { CreateAssetAsync } from "../assetSlice";
import { useHistory } from "react-router-dom";
import { sortAssetByUpdatedDate } from "../page/ManageAsset";
const user = JSON.parse(localStorage.getItem("user"));
export default function CreateAssetForm(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleCancel = () => {
    history.push("/manageasset");
  };
  return (
    <Formik
      initialValues={{
        name: "",
        specification: "",
        installedDate: "",
        category: "",
        state: "",
        categoryId: "",
        location: user.profile.location,
      }}
      validate={(values) => {
        const errors = {};
        if (!values.name) {
          errors.name = "Required";
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
            <Label for="name" sm={2}>
              Name
            </Label>
            <Col sm={5} className="position-relative">
              <Input
                id="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                invalid={errors.name && touched.name}
              />
              <FormFeedback tooltip>{errors.name}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="category" sm={2}>
              Category
            </Label>
            <Col sm={5}>
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
                  document.getElementById("installedDate-hidden").click();
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
            <Label for="specification" sm={2}>
              Specification
            </Label>
            <Col sm={5} className="position-relative">
              <Input
                id="specification"
                type="textarea"
                rows="3"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.specification}
                invalid={errors.specification && touched.specification}
              />
              <FormFeedback tooltip>{errors.specification}</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="installeddate-input" sm={2}>
              Installed Date
            </Label>
            <Col sm={5} className="position-relative">
              <Input
                name="installedDate"
                type="date"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.installedDate}
                invalid={errors.installedDate && touched.installedDate}
              />
              {/* <Input
                id="installeddate-input"
                name="date"
                type="date"
                invalid={errors.installedDate && touched.installedDate}
                onChange={(target) => {
                  touched.installedDate = true;
                  if (target.target.value)
                    values.installedDate = new Date(
                      target.target.value
                    ).toISOString();
                  else values.installedDate = "";
                  document.getElementById("installedDate-hidden").click();
                }}
              /> */}
              <FormFeedback tooltip>{errors.installedDate}</FormFeedback>
              <span id="installedDate-hidden" hidden onClick={handleChange} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="state" sm={2}>
              State
            </Label>
            <Col sm={5}>
              <Input
                id="state-available"
                value="Available"
                name="state"
                type="radio"
                onClick={(target) => {
                  if (values.state !== target.target.value) {
                    values.state = target.target.value;
                    document.getElementById("installedDate-hidden").click();
                  }
                }}
              />
              <Label for="state-available">Available</Label>
              <br></br>
              <Input
                id="state-notavailable"
                value="NotAvailable"
                name="state"
                type="radio"
                onClick={(target) => {
                  if (values.state !== target.target.value) {
                    values.state = target.target.value;
                    document.getElementById("installedDate-hidden").click();
                  }
                }}
              />
              <Label for="state-notavailable">Not available</Label>
            </Col>
          </FormGroup>
          <div className="text-center">
            <Button
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
  );
}
