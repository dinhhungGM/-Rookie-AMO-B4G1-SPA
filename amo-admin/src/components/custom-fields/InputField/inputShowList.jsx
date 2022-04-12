import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

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
  const { field, form, type, label, placeholder, disabled, onClick } = props;
  const { name } = field;
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];

  return (
    <FormGroup className={`myformgroup `}>
      <div className="row myformgroup-row">
        {label && (
          <Label className="col-md-4" htmlFor={name}>
            {label}{" "}
            <span
              style={{
                color: "red",
                fontSize: "1rem",
              }}
            >
              *
            </span>
          </Label>
        )}

        <Input
          className={`myinput col-md-8 `}
          id={name}
          {...field}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          onClick={onClick}
          invalid={showError}
          style={{
            borderRadius: "7px",
            paddingRight: "36px",
          }}
        />

        {(name === "UserFullName" || name === "AssetName") && !showError && (
          <i
            className="fa-solid fa-magnifying-glass input--with-search-icon"
            onClick={onClick}
          ></i>
        )}

        <ErrorMessage
          name={name}
          component={FormFeedback}
          className="custom-error--feedback"
        />
      </div>
    </FormGroup>
  );
}

export default InputField;
