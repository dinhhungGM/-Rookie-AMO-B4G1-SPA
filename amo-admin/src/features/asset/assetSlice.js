import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import axiosClient from "../../api/axiosClient";

const initialState = {
    assets: { items: [] },
    assetDetail: {
        category: {}
    },
    direction: "none",
    loading: false,
    error: null
};

export const CreateAssetAsync = createAsyncThunk(
    "asset/createAsset",
    async (values, { rejectWithValue }) => {
        try {
            const user = localStorage.getItem("user");
            const response = await axiosClient.post("api/asset/code",
                {
                    "code": values.code
                });
            const asset = await axiosClient.post("api/asset",
                {
                    "code": response,
                    "name": values.data.name,
                    "location": "HN",
                    "state": values.data.state,
                    "specification": values.data.specification,
                    "installedDate": values.data.installedDate,
                    "creatorId": JSON.parse(user).sub,
                    "categoryId": values.data.categoryId
                });
            alert("Create asset successfull !");
            return asset;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
export const getAssetDetailAsync = createAsyncThunk(
    "asset/getAssetDetail",
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("api/asset/" + values.id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
export const getAssetListAsync = createAsyncThunk(
    "asset/getAssetList",
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('api/asset/search',{
                params: values,
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
export const updateAssetDetailAsync = createAsyncThunk(
    "asset/updateAssetDetail",
    async (values, { rejectWithValue, dispatch }) => {
        try {
            await axiosClient.put("api/asset/", {
                id: values.id,
                name: values.name,
                state: parseInt(values.state),
                specification: values.specification,
                installedDate: new Date(values.installedDate).toISOString(),
            });

            dispatch(getAssetDetailAsync({ id: values.id }));
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
export const deleteAssetAsync = createAsyncThunk(
    "asset/deleteAsset",
    async (values, { rejectWithValue }) => {
        try {
            await axiosClient.put("api/asset/delete", {
                id: values.id
            });
            alert("Delete asset successfully !");
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
const assetSlice = createSlice({
    name: "asset",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(CreateAssetAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(CreateAssetAsync.fulfilled, (state, action) => {

                state.loading = false;
                state.error = null;
            })
            .addCase(CreateAssetAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAssetListAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAssetListAsync.fulfilled, (state, action) => {
                state.assets = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAssetListAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAssetDetailAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAssetDetailAsync.fulfilled, (state, action) => {
                state.assetDetail = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAssetDetailAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAssetDetailAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateAssetDetailAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateAssetDetailAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAssetAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteAssetAsync.fulfilled, (state, action) => {

                state.loading = false;
                state.error = null;
            })
            .addCase(deleteAssetAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }

});

const { reducer, actions } = assetSlice;
export const { onChangePageName, onChangeParam, onListChange } = actions;
export default reducer;