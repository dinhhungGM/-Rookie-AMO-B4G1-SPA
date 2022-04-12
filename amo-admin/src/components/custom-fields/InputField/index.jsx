import { ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

InputField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

InputField.defaultProps = {
  type: 'text',
  label: '',
  placeholder: '',
  disabled: false,
}

function InputField(props) {
  const {
    field, form,
    type, label, placeholder, disabled,
  } = props;
  const { name } = field;
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];

  return (
    <FormGroup  className={`myformgroup `}>
      <div className="row myformgroup-row">
      {label && <Label className="col-md-4" htmlFor={name}>{label}</Label>}

      <Input
        className={`myinput col-md-8 `}
        id={name}
        {...field}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        style={
          type === 'textarea' ? { 
            resize: 'none',
            borderRadius: '10px',
           } : {borderRadius: '7px'}
        }
        invalid={showError}
        {
          ...(name === 'AssignedDate' ? {
            min: new Date().toISOString().split('T')[0],
          } : {})
        }
      />
      <ErrorMessage name={name} component={FormFeedback} className="custom-error--feedback"/>
      </div>
    </FormGroup>
  );
}

export default InputField;