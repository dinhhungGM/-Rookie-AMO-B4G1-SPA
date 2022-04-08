import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
// import assignmentApi from '../../../api/assignmentApi';
import { ParseDateTime } from '../../../utils/ParseDateTime';

import AssignmentForm from '../components/AssignmentForm';
import {createNewAssignmentAsync} from '../assignmentSlice';
import { onChangePageName } from '../../home/homeSlice';

const AddEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const isAddMode = !id;

    const convertDate = (date) => date.split('/').reverse().join('-');

    function getFormattedDate(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year + '-' + month + '-' + day ;
      }

            


    const [inputValue, setInputValue] = useState({
        UserId: '',
        AssetId: '',
        UserFullName: '',
        AssetName:'',
        AssignedDate: getFormattedDate(new Date()),
        Note:''
    });
    const [initialValues, setInitialValue] = useState({
        UserId: '',
        AssetId: '',
        UserFullName: '',
        AssetName:'',
        AssignedDate: getFormattedDate(new Date()),
        Note:''
    });
    const handleSubmit = async (values) => {
        const {AssetName, UserFullName, ...postValue} = values;
        console.log('submit')
        console.log(postValue);
        if(isAddMode){
            dispatch(createNewAssignmentAsync(postValue));
            dispatch(onChangePageName('Manage Assignment'));
            history.push('/manageassignment');
        }
        
        // try {
        //     if(isAddMode){
        //         console.log(values);
        //         await  assignmentApi.post(postValue);

        //     } else{
        //         try{
        //             await  assignmentApi.put(assignmentId, values);
        //             alert("Update assignment success")
        //         }catch(error) {
        //             alert(error)
        //         }
        //     }
        //     dispatch(onOrderChange('updatedDate'));     
        //     dispatch(onDescChange(true));      
        //     history.push('/assignmentmanager');
        // } catch (error) {
        //     console.log('Failed to post assignment: ', error);
        // }
    }

    useEffect( () => {
        const fetchUserList = async () => {
            // if (!isAddMode) {
            //     const response = await assignmentApi.get(assignmentId);
            //     setInputValue({
            //         UserID: response.userID,
            //         AssetID:  response.assetID,
            //         UserFullName: response.assignedTo,
            //         AssetName: response.asset.name,
            //         AssignedDate: convertDate(response.assignedDate),
            //         Note:  response.note
            //     });
            //     setInitialValue({
            //         UserID: response.userID,
            //         AssetID:  response.assetID,
            //         UserFullName: response.assignedTo,
            //         AssetName: response.asset.name,
            //         AssignedDate: convertDate(response.assignedDate),
            //         Note:  response.note
            //     });
            // }
        }
        fetchUserList();
    }, [isAddMode,id])
    return (
        <div id = 'assignment-form' style={{
            width: '594px',
        }}>
            <div className="titleview mb-3">{isAddMode?'Create New Assignment':'Edit Assignment'}</div>
            <AssignmentForm
                isAddMode={isAddMode}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                setInputValue = {setInputValue}
                setInitialValue = {setInitialValue}
                inputValue = {inputValue}
            />
        </div>
    )
}

export default AddEdit
