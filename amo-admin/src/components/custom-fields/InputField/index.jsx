import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Col, FormFeedback, FormGroup, Input, Label } from "reactstrap";

InputField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

InputField.defaultProps = {
  type: "text",
  label: "",
  placeholder: "",
  disabled: false,
};

function InputField(props) {
  const { field, form, type, label, placeholder, disabled } = props;
  const { name } = field;
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];
  useEffect(() => {
    console.log(field);
  }, []);
  return (
    <FormGroup row={true}>
      {label && (
        <Label htmlFor={name} className="col-3">
          {label}
        </Label>
      )}
      <Col>
        <Input
          id={name}
          {...field}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          invalid={showError}
        />

        <ErrorMessage name={name} component={FormFeedback} />
      </Col>
    </FormGroup>
  );
}

export default InputField;
