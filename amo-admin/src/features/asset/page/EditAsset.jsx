import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditAssetForm from "../components/EditAssetForm";
import { getAllCategoriesAsync } from "../../category/categorySlice";
const EditAsset = () => {
  const { categories, loading, error } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCategoriesAsync());
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
