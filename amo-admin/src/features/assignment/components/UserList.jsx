import React, { useEffect, useState } from "react";
import SearchField from "react-search-field";
import { Button, Input } from "reactstrap";
// import userApi from "../../../../api/userApi";
import ReactTable from "../../../components/ReactTableAsignment";
import {getPagedUsersAsync} from '../../users/userSlice';
import { useDispatch, useSelector } from "react-redux";
import ParseObjectToQueryString from "../../../utils/ParseObjectToQueryString";

const UserList = ({onSelectValue, checked, onSave, currentValue, onClose}) => {
   const dispatch = useDispatch();
   const {users} = useSelector(state => state.user);
    const [listSelector, setListSelector] = useState();
    const [Params, setParams] = useState(    
    {
      propertyName: 'StaffCode',
      desc: true,
      page: 1,
      limit: 10
    });

    const capitalize1st = s => s && s[0].toUpperCase() + s.slice(1);
    
    
    useEffect(() => {
      // const getList = async() =>{
      //   setListSelector(await userApi.getAll(Params));
      // }
      // getList();
      dispatch(getPagedUsersAsync("?" + ParseObjectToQueryString(Params)));
    }, [dispatch, Params]);
    
    const handleOnSort = (e) => {
      if(e[0]) setParams({...Params, propertyName:capitalize1st(e[0].id), desc:e[0].desc });
    }

    const setInputValue = (e) =>{
      onSelectValue(e.id, e.fullName);
    }

    const onSearchSubmit = (key, value) => {
      setParams({ ...Params, search: key });
    }
    

    const columns = [
      {
        Header: " ",
        Cell: ({ row }) => {
          return  <>
          <Input type='radio' name='select' onChange = {() => setInputValue(row.original)} checked = {checked === row.original.id}/>
        </>
        },
        accessor: "id",
         
      },
      {
        Header: "Staff Code",
        accessor: "codeStaff",
      },
      {
      Header: "Full Name",
      accessor: "fullName",
      },
      {
        Header: "Type",
        accessor: "type",
      }
    ]

  return (
      users?
        <>
         <div className = "title-list-pop-up">Select User</div>
          <SearchField
            placeholder="Search..."
            onSearchClick={(key, value) => onSearchSubmit(key, value)}
            onEnter={(key, value) => onSearchSubmit(key, value)}
            classNames="search-list-pop-up"
          />
          <ReactTable 
            columns={columns} 
            data={users} 
            onSort={(e) => handleOnSort(e)}  
            onRowClick={(e) => (e)}
          />
          <div style= {{'height':'38px', marginLeft: "60%"}}>
              <Button
                color="danger"
                onClick = {onSave}
                disabled = {currentValue === checked}
                style={{marginRight: "20px"}}
                
              >
                Save
              </Button>
              <Button
                outline
                onClick = {onClose}
              >
                Cancel
              </Button>
          </div>
        </>:''
  );
};

export default UserList;