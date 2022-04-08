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
    const [Params, setParams] = useState(    
    {
      OrderProperty: 'code',
      Desc: true,
      Page: 1,
      Limit: 1000000,
      State: ASSET_AVAILABLE
    });

    
    useEffect(() => {
      // const getList = async() =>{
      //   try {
      //     const response = await assetApi.findAll(Params);
      //     setListSelector(response);       
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
      // getList();
      dispatch(getAssetListAsync(Params));
    }, [dispatch, Params]);
    console.log(listSelector);
    const handleOnSort = (e) => {
      if(e[0]) {
        if(e[0].desc == Params.Desc){
          setParams({...Params, OrderProperty: e[0].id, Desc:e[0].desc });          
        }
        else{
          setParams({...Params, OrderProperty: e[0].id, Desc:!e[0].desc });

        }
      }
    }

    const setInputValue = (e) =>{
      onSelectValue(e.id, e.name);
    }

    const onSearchSubmit = (key, value) => {
      setParams({ ...Params, KeySearch: key });
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
        Header: "Asset Code",
        accessor: "code",
      },
      {
        Header: "Asset Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "category.name",
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