import React from 'react'
import { Formik } from 'formik';
import { Input, FormGroup, Label, Col, Button } from 'reactstrap';
import { useDispatch } from "react-redux";
import { getAssetCodeAsync } from '../assetSlice';
export default function CreateAssetForm(props) {
    const dispatch = useDispatch();
    return (<Formik
        initialValues={{ name: '', specification: '', installedDate: '', category: '', state: 'Available', categoryId: '' }}
        validate={values => {
            const errors = {};
            if (!values.name) {
                errors.name = 'Required';
            }
            if (!values.specification) {
                errors.specification = 'Required';
            }
            if (!values.installedDate) {
                errors.installedDate = 'Required'
            }
            if (!values.category) {
                errors.category = 'Required'
            }
            return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
                dispatch(getAssetCodeAsync({code:values.category,data:values}))
                setSubmitting(false);
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
                    <Label
                        for="name"
                        sm={2}
                    >
                        Name
                    </Label>
                    <Col sm={5}>
                        <Input
                            id="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            placeholder={'Required'}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label
                        for="category"
                        sm={2}
                    >
                        Category
                    </Label>
                    <Col sm={5}>
                        <Input
                            id="category"
                            name="select"
                            type="select"
                            onChange={() => {
                                values.category = document.getElementById('category').value;
                                document.getElementById('installedDate-hidden').click();
                            }}
                        >
                            <option value="" selected disabled hidden>Choose here</option>
                            {props.categories.map((cat) => {
                                return (
                                    <option key={cat.id} value={cat.desc} onClick={values.categoryId = cat.id}>
                                        {cat.name}
                                    </option>)
                            })}
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label
                        for="specification"
                        sm={2}
                    >
                        Specification
                    </Label>
                    <Col sm={5}>
                        <Input
                            id="specification"
                            type="textarea"
                            rows="3"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.specification}
                            placeholder={'Required'}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label
                        for="installeddate-input"
                        sm={2}
                    >
                        Installed Date
                    </Label>
                    <Col sm={5}>
                        <Input
                            id="installeddate-input"
                            name="date"
                            type="date"
                            onChange={(target) => {
                                values.installedDate = new Date(target.target.value).toISOString();
                                document.getElementById('installedDate-hidden').click()
                            }}
                        />
                        <span id='installedDate-hidden' hidden onClick={handleChange} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label
                        for="state"
                        sm={2}
                    >
                        State
                    </Label>
                    <Col sm={5}>
                        <Input checked={true} id='state-available' value="Available" name='state' type="radio" onClick={(target) => {
                            if(values.state !== target.target.value)
                            {
                                values.state = target.target.value;
                                document.getElementById('installedDate-hidden').click()
                            }
                            
                        }} />
                        <Label for='state-available'>Available</Label>
                        <br></br>
                        <Input id='state-notavailable' value="NotAvailable" name='state' type="radio" onClick={(target) => {
                            if(values.state !== target.target.value)
                            {
                                values.state = target.target.value;
                                document.getElementById('installedDate-hidden').click()
                            }
                        }} />
                        <Label for='state-notavailable'>Not available</Label>
                    </Col>
                </FormGroup>
                {/* <button type="submit" disabled={isSubmitting}>
                    Submit
                </button> */}
                <div className='text-center'>
                    <Button
                        id='btn-save'
                        color="danger"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                    >
                        Save
                    </Button>
                    <Button
                        id='btn-cancel'
                        outline
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>

            </form>
        )}
    </Formik>)
}
