import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import { Field } from "formik";
import { FormFeedback, FormGroup, Label, Col } from "reactstrap";

RadioFieldV2.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
};

RadioFieldV2.defaultProps = {
  label: "",
  placeholder: "",
  disabled: false,
  options: [],
};

function RadioFieldV2(props) {
  const { field, form, options, label, placeholder, disabled } = props;
  const { name, value } = field;

  const { errors, touched } = form;
  const showError = errors[name] && touched[name];

  const handleSelectedOptionChange = (selectedOption) => {
    const selectedValue = selectedOption
      ? selectedOption.value
      : selectedOption;

    const changeEvent = {
      target: {
        name: name,
        value: selectedValue,
      },
    };
    field.onChange(changeEvent);
  };

  return (
    <FormGroup row>
      {label && (
        <Label for={name} sm={3}>
          {label}
        </Label>
      )}
      <Col className="d-flex flex-column">
        {options.map((opt, i) => (
          <label key={i}>
            <Field type="radio" name={name} value={opt.value} className="myradio" style={{marginRight:"10px"}}/>
            <span>{opt.label}</span>
          </label>
        ))}

        <ErrorMessage name={name} component={FormFeedback} />
      </Col>
    </FormGroup>
  );
}

export default RadioFieldV2;