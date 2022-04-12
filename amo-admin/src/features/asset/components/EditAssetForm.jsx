import React, { useEffect } from "react";
import { Formik } from "formik";
import {
  Input,
  FormGroup,
  Label,
  Col,
  Button,
  FormFeedback,
  FormText,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import RadioFieldV2 from "../../../components/custom-fields/RadioFieldV2";
import { updateAssetDetailAsync } from "../assetSlice";
import { useHistory } from "react-router-dom";
import { sortAssetByUpdatedDate } from "../page/ManageAsset";
const convertDate = (date) => {
  var day = ("0" + date.getDate()).slice(-2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var year = ("000" + date.getFullYear()).slice(-4);
  return year + "-" + month + "-" + day;
};

export default function EditAssetForm(props) {
  const history = useHistory();
  const stateOptions = [
    { value: "0", label: "Available" },
    { value: "1", label: "Not Available" },
    { value: "3", label: "Waiting for Recycling" },
    { value: "4", label: "Recycled" },
  ];
  const dispatch = useDispatch();
  const { assetDetail, loading, error } = useSelector((state) => state.asset);
  useEffect(() => {
    //console.log(new Date(assetDetail.installedDate).toISOString());
  }, [assetDetail]);
  return (
    <div
      id="user-form"
      style={{
        paddingLeft: "10%",
        paddingRight: "30%",
      }}
    >
      <div className="titleview mb-3">Edit Asset</div>
      <Formik
        enableReinitialize
        initialValues={{
          id: assetDetail.id,
          name: assetDetail.name,
          specification: assetDetail.specification,
          installedDate: convertDate(new Date(assetDetail.installedDate)),
          category: assetDetail.category.desc,
          state: String(assetDetail.state),
          categoryId: assetDetail.categoryId,
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
        onSubmit={async (values, { setSubmitting }) => {
          console.log(new Date(values.installedDate));
          await dispatch(updateAssetDetailAsync({ ...values }));
          setSubmitting(false);
          sortAssetByUpdatedDate();
          history.push("/manageasset");
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
                  name="name"
                  value={values.name}
                  invalid={errors.name}
                  maxLength={250}
                />
                <FormFeedback>{errors.name}</FormFeedback>
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
                    values.category = document.getElementById("category").value;
                  }}
                  value={values.category}
                  disabled
                >
                  <option value="" selected disabled hidden>
                    Choose here
                  </option>
                  {props.categories.map((cat) => {
                    return (
                      <option
                        key={cat.id}
                        value={cat.desc}
                        onClick={(values.categoryId = cat.id)}
                      >
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
                  name="specification"
                  value={values.specification}
                  invalid={errors.specification}
                  maxLength={4000}
                />
                <FormFeedback>{errors.specification}</FormFeedback>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="installeddate-input" sm={3}>
                Installed Date
              </Label>
              <Col sm={9} className="position-relative">
                <Input
                  //id="installeddate-input"
                  name="installedDate"
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.installedDate}
                  invalid={errors.installedDate}
                />
                <FormFeedback>{errors.installedDate}</FormFeedback>
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
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
              <Button
                id="btn-cancel"
                outline
                disabled={isSubmitting}
                className="mx-2"
                onClick={() => history.push("/manageasset")}
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
