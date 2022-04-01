import React from 'react'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoriesAsync } from '../../category/categorySlice';
import CreateAssetForm from '../components/CreateAssetForm'
const CreateAsset = () => {
    const {categories,loading,error} = useSelector((state)=> state.category)
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getAllCategoriesAsync());
    },[])
    return (
        <div>
            <h5>Create New Asset</h5>
            <br></br>
            <CreateAssetForm categories={categories} />
        </div>
    )
}

export default CreateAsset
