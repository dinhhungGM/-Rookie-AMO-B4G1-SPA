import React, { useEffect } from "react";
import SearchField from "react-search-field";
import { Button, Input } from "reactstrap";
// import userApi from "../../../../api/userApi";
import ReactTable from "../../../components/ReactTableAsignment";
import {getPagedUsersAsync, setSearch, setSort, setDesc} from '../../users/userSlice';
import { useDispatch, useSelector } from "react-redux";


const UserList = ({onSelectValue, checked, onSave, currentValue, onClose}) => {
   const dispatch = useDispatch();
   
    const {preUser} = useSelector(state => state.assignment);
    const {
      users,
      searchname: name,
      sort,
      desc
      
    } = useSelector((state) => state.user);

    useEffect(() => {
      dispatch(getPagedUsersAsync({
        page: 1,
        limit: 1000000,
        sort,
        desc,
        name,
      }));
    }, [dispatch, desc, name, sort]);
    
    const handleOnSort = (e) => {
      console.log(e);
      
      if (e[0]) {
          dispatch(setSort(e[0].id));
          dispatch(e[0].desc !== desc ? setDesc(e[0].desc): setDesc(!e[0].desc));
      }
    }
  
    const setInputValue = (e) =>{
      onSelectValue(e.id, e.fullName);
    }

    const onSearchSubmit = (key, value) => {
      dispatch(setSearch(key));
    }

    const setCancelModal = () => {
      onSelectValue(preUser === null ? "" : preUser.id, preUser === null ? "" : preUser.name);
      onClose();
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
            tableName="users"
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
                onClick = {setCancelModal}
              >
                Cancel
              </Button>
          </div>
        </>:''
  );
};

export default UserList;