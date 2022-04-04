import React, { useEffect } from "react";
import { Formik } from "formik";
import { Input, FormGroup, Label, Col, Button } from "reactstrap";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import RadioFieldV2 from "../../../components/custom-fields/RadioFieldV2";
import { updateAssetDetailAsync } from "../assetSlice";

const convertDate = (date) => {
  var day = ("0" + date.getDate()).slice(-2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);

  return date.getFullYear() + "-" + month + "-" + day;
};

export default function EditAssetForm(props) {
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
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(updateAssetDetailAsync({ ...values }));
        setSubmitting(false);
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
            <Col sm={5}>
              <Input
                id="name"
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
                value={values.name}
                placeholder={"Required"}
              />
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
            <Label for="specification" sm={2}>
              Specification
            </Label>
            <Col sm={5}>
              <Input
                id="specification"
                type="textarea"
                rows="3"
                onChange={handleChange}
                onBlur={handleBlur}
                name="specification"
                value={values.specification}
                placeholder={"Required"}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="installeddate-input" sm={2}>
              Installed Date
            </Label>
            <Col sm={5}>
              <Input
                //id="installeddate-input"
                name="installedDate"
                type="date"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.installedDate}
              />
              <span id="installedDate-hidden" hidden onClick={handleChange} />
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
          <div className="text-center">
            <Button
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
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
}
