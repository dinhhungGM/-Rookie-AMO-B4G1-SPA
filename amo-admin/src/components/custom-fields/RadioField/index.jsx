import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import { Field } from "formik";
import { FormFeedback, FormGroup, Label, Col } from "reactstrap";

RadioField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
};

RadioField.defaultProps = {
  label: "",
  placeholder: "",
  disabled: false,
  options: [],
};

function RadioField(props) {
  const { field, form, options, label, placeholder, disabled } = props;
  const { name, value } = field;

  return (
    <FormGroup row>
      {label && (
        <Label for={name} className="col-3">
          {label}
        </Label>
      )}
      <Col className="d-flex flex-column">
        {options.map((opt, i) => (
          <label key={i}>
            <Field type="radio" name={name} value={opt.value} />
            {opt.label}
          </label>
        ))}

        <ErrorMessage name={name} component={FormFeedback} />
      </Col>
    </FormGroup>
  );
}

export default RadioField;
