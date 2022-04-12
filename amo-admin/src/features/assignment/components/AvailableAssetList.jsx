import React, { useEffect, useState } from "react";
import SearchField from "react-search-field";
import { Button, Input } from "reactstrap";

import ReactTable from "../../../components/ReactTableAsignment";
import { useDispatch, useSelector } from "react-redux";
import {getAssetListAsync} from '../../asset/assetSlice';
import {ASSET_AVAILABLE} from '../../../constants/AssetState';

const AvailableAssetList = ({onSelectValue, checked, onSave, currentValue, onClose}) => {
   const dispatch = useDispatch();
   const {assets} = useSelector(state => state.asset);
    const [listSelector, setListSelector] = useState();
    const {location} =  JSON.parse(localStorage.getItem('user')).profile;
    const [Params, setParams] = useState(    
    {
      orderProperty: 'Code',
      Desc: true,
      page: 1,
      limit: 1000000,
      state: ASSET_AVAILABLE,
      keySearch: '',
      direction: 'ASC',
      location: location
    });

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    useEffect(() => {
      dispatch(getAssetListAsync({
        ...Params,
        orderProperty: capitalizeFirstLetter(Params.orderProperty)
      }));
    }, [dispatch, Params]);
    console.log(listSelector);
    const handleOnSort = (e) => {
      if(e[0]) {
        if(e[0].desc === Params.Desc){
          setParams({...Params, orderProperty: e[0].id, Desc:e[0].desc, direction: 'DESC' });          
        }
        else{
          setParams({...Params, orderProperty: e[0].id, Desc:!e[0].desc, direction: 'ASC' });
        }
      }
    }

    const setInputValue = (e) =>{
      onSelectValue(e.id, e.name);
    }

    const onSearchSubmit = (key, value) => {
      setParams({ ...Params, keySearch: key });
    }

    const columns = [
      {
        Header: " ",
        Cell: ({ row }) => (
          <>
            <Input type='radio' name='select' onChange = {() => setInputValue(row.original)} checked = {checked === row.original.id}/>
          </>
        ),
      },
      {
        id: "Code",
        Header: "Asset Code",
        accessor: "code",
        sortDirection: Params.direction
      },
      {
        Header: "Asset Name",
        accessor: "name",
        id: "Name",
        sortDirection: Params.direction
      },
      {
        Header: "Category",
        id: "Category",
        accessor: "category.name",
        sortDirection: Params.direction
      }
    ]

  return (
    assets ?
        <>
         <div className = "title-list-pop-up">Select Asset</div>
          <SearchField
            placeholder="Search..."
            onSearchClick={(key, value) => onSearchSubmit(key, value)}
            onEnter={(key, value) => onSearchSubmit(key, value)}
            classNames="search-list-pop-up"
          />
          <ReactTable 
            columns={columns} 
            data={assets.items} 
            onSort={(e) => handleOnSort(e)}  
            onRowClick={(e) => (e)}
            tableName="assets"
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

export default AvailableAssetList;