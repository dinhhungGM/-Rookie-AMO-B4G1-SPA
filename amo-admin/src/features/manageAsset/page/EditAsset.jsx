import React from "react";
import { Formik } from "formik";
import InputField from "../../../components/custom-fields/InputField";
import SelectField from "../../../components/custom-fields/SelectField";
import { Button, Row } from "reactstrap";
import RadioField from "../../../components/custom-fields/RadioField";
const EditAsset = () => {
  const options = [
    { value: "C1", label: "Category 1" },
    { value: "C2", label: "Category 2" },
  ];
  const stateOptions = [
    { value: "Available", label: "Available" },
    { value: "NotAvailable", label: "Not Available" },
  ];
  return (
    <div>
      <div id="Online_Asset_Management_mjc" className="mb-5">
        <span>Edit Asset</span>
      </div>

      <Formik
        initialValues={{
          name: "",
          specification: "",
          installedDate: new Date().toISOString().split("T")[0],
          state: "Available",
          category: "C1",
        }}
        validate={(values) => {
          const errors = {};

          if (!values.name) {
            errors.name = "Required";
          }

          if (!values.specification) {
            errors.specification = "Required";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));

            setSubmitting(false);
          }, 100);
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

          dirty,

          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <InputField
              label="Name"
              field={{
                name: "name",
                onChange: handleChange,
                onBlur: handleBlur,
                value: values.name,
              }}
              form={{ errors, touched }}
            />
            <SelectField
              label="Category"
              disabled
              field={{
                name: "category",
                onChange: handleChange,
                onBlur: handleBlur,
                value: values.category,
              }}
              form={{ errors, touched }}
              options={options}
            />
            <InputField
              label="Specification"
              field={{
                name: "specification",
                onChange: handleChange,
                onBlur: handleBlur,
                value: values.specification,
              }}
              type="textarea"
              form={{ errors, touched }}
            />
            <InputField
              label="Installed Date"
              field={{
                name: "installedDate",
                onChange: handleChange,
                onBlur: handleBlur,
                value: values.installedDate,
              }}
              type="date"
              form={{ errors, touched }}
            />
            <RadioField
              label="State"
              field={{
                name: "state",
                value: values.state,
              }}
              options={stateOptions}
              form={{ errors, touched }}
            />
            <div className="d-flex justify-content-end mt-5">
              <Button
                color="danger"
                type="submit"
                disabled={
                  isSubmitting ||
                  !isValid ||
                  (Object.keys(touched).length === 0 &&
                    touched.constructor === Object)
                }
                className="mx-2"
              >
                Save
              </Button>
              <Button disabled={isSubmitting}>Cancel</Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default EditAsset;
