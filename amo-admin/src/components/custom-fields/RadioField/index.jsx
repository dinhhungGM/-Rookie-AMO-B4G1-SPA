import { Field } from "formik";
import React from "react";
import { FormGroup } from "reactstrap";

const index = ({ options, name, label }) => {
  return (
    <FormGroup className="myformgroup">
      <div className="row">
        <div className="col-md-4" >
          {label}
        </div>
        <div className="col-md-8" role="group" aria-labelledby="my-radio-group" id="my-radio-group">
          {options.map((option, idx) => (
            <div key={idx} style={{
              marginRight: "10px"
            }}>
              
                <Field
                  type="radio"
                  name={name}
                  value={option.value}
                  id={`${idx}_${option.value}`}
                  className="myradio"
                />
                {" " + option.label}
              
            </div>
          ))}
        </div>
      </div>
    </FormGroup>
  );
};

export default index;
