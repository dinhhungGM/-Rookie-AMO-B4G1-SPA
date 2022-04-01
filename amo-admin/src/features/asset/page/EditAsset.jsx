import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditAssetForm from "../components/EditAssetForm";
import { getAssetDetailAsync } from "../assetSlice";
import { getAllCategoriesAsync } from '../../category/categorySlice';
import { useParams } from "react-router-dom";
const EditAsset = () => {
  const { id } = useParams();
  const { categories, loading, error } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCategoriesAsync());
    dispatch(getAssetDetailAsync({id:id}));
  }, []);
  return (
    <div>
      <h5>Edit Asset</h5>
      <br></br>
      <EditAssetForm categories={categories} />
    </div>
  );
};

export default EditAsset;
