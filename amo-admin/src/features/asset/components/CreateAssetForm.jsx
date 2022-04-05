import React from 'react'
import { Formik } from 'formik';
import { Input, FormGroup, Label, Col, Button } from 'reactstrap';
import { useDispatch } from "react-redux";
import { CreateAssetAsync } from '../assetSlice';
import { useHistory } from 'react-router-dom';
import { sortAssetByUpdatedDate } from '../page/ManageAsset';
export default function CreateAssetForm(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const handleCancel = () => {
        history.push("/manageasset")
    }
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
            setTimeout(async() => {
                await dispatch(CreateAssetAsync({code:values.category,data:values}))
                setSubmitting(false);
                sortAssetByUpdatedDate();
                history.push("/manageasset");
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
                                var cate = document.getElementById('category').value.split('/');
                                values.category = cate[0];
                                values.categoryId = cate[1];
                                document.getElementById('installedDate-hidden').click();
                            }}
                        >
                            <option value="" selected disabled hidden>Choose here</option>
                            {props.categories.map((cat) => {
                                return (
                                    <option key={cat.id} value={cat.desc+"/"+cat.id}>
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
                        onClick={() => handleCancel()}
                    >
                        Cancel
                    </Button>
                </div>

            </form>
        )}
    </Formik>)
}
