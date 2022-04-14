import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditAssetForm from "../components/EditAssetForm";
import { getAssetDetailAsync } from "../assetSlice";
import { getAllCategoriesAsync } from "../../category/categorySlice";
import { Redirect, useParams } from "react-router-dom";
const EditAsset = () => {
  const { id } = useParams();
  const { categories } = useSelector((state) => state.category);
  const { assetDetail, loading } = useSelector((state) => state.asset);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCategoriesAsync());
    dispatch(getAssetDetailAsync({ id: id }));
  }, [dispatch, id]);
  if (loading)
    return (
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    );
  if (assetDetail.state === 2 && assetDetail.id === id)
    return <Redirect to="/manageasset" />;
  if (
    assetDetail.state !== 2 &&
    assetDetail.state !== undefined &&
    assetDetail.state !== null
  )
    return (
      <div>
        <EditAssetForm categories={categories} />
      </div>
    );
  return <></>;
};

export default EditAsset;
