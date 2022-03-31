import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import UserForm from '../components/UserForm';
import {createNewUserAsync} from '../userSlice';
//import {onParamsChange} from '../userSlice';

const AddEdit = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const { userId } = useParams();
    //const Params = useSelector(state => state.user.Params); 
    const isAddMode = !userId;
    const [user, setUser] = useState()
    const { loading, error } = useSelector(state => state.user);
    const initialValues = isAddMode
        ? {
            FirstName: '',
            LastName: '',
            Email:'',
            DateOfBirth: null,
            JoinedDate: null,
            Gender: '',
            Type:'Staff'
        }
        : user;

        const handleSubmit = async (values) => {
            // try {
            //     if(isAddMode){
            //         await  userApi.post(values);
            //     } else{
            //         await  userApi.put(userId, values);
            //     }
            //     //dispatch(onParamsChange({...Params, propertyName: 'LastModified'}));
            //     history.push('/manageuser');
            // } catch (error) {
            //     console.log('Failed to post user: ', error);
            // }
            

            if(isAddMode){
                console.log('Add mode');
                dispatch(createNewUserAsync(values));
                history.push('/manageuser');
            } else{
                console.log('Edit mode');
            }
        }
    
    const convertDate = (date) => date.split('/').reverse().join('-');

    
    
    // useEffect( () => {
    //     const fetchUserList = async () => {
    //         if (!isAddMode) {
    //             const response = await userApi.get(userId);
    //             setUser({
    //                 FirstName: response.firstName,
    //                 LastName:  response.lastName,
    //                 DateOfBirth: convertDate(response.dateOfBirth),
    //                 JoinedDate: convertDate(response.joinedDate),
    //                 Gender:  response.gender,
    //                 Type: response.type,
    //                 UserName: response.userName,
    //                 Email: response.email,
    //             })
    //         }
    //     }
    //     fetchUserList();
    // }, [isAddMode,userId])
    return (
        <div id = 'user-form' style={{
            paddingLeft: '10%',
            paddingRight: '30%'
        }}>
            <div className="titleview mb-3">{isAddMode?'Create New User':'Edit User'}</div>

            <UserForm
                isAddMode={isAddMode}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            />
        </div>
    )
}

export default AddEdit
