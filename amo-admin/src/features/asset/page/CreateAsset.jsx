import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoriesAsync } from "../../category/categorySlice";
import CreateAssetForm from "../components/CreateAssetForm";
const CreateAsset = () => {
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCategoriesAsync());
  }, [dispatch]);
  return (
    <div>
      <CreateAssetForm categories={categories} />
    </div>
  );
};

export default CreateAsset;
