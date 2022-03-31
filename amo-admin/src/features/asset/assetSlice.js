import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    assets: [],
    code: "",
    loading: false,
    error: null
};

export const getAssetCodeAsync = createAsyncThunk(
    "asset/getAssetCode",
    async (values, { rejectWithValue }) => {
        try {
            const user = localStorage.getItem("user");
            const response = await axios.post(process.env.REACT_APP_API_URL_END_POINT + "api/asset/code",
                {
                    "code": values.code
                },
                {
                    headers: {
                        'Authorization': `Basic ${JSON.parse(user).access_token}`
                    }
                });
            
            await axios.post(process.env.REACT_APP_API_URL_END_POINT + "api/asset",
            {
                "code": response.data,
                "name": values.data.name,
                "location": "HN",
                "state": values.data.state,
                "specification": values.data.specification,
                "installedDate": values.data.installedDate,
                "creatorId": JSON.parse(user).sub,
                "categoryId": values.data.categoryId
            },
            {
                headers: {
                    'Authorization': `Basic ${JSON.parse(user).access_token}`
                }
            });
            alert("Create asset successfull !");
            return response;
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
            .addCase(getAssetCodeAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAssetCodeAsync.fulfilled, (state, action) => {
                state.code = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAssetCodeAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

const { reducer, actions } = assetSlice;
export const { onChangePageName } = actions;
export default reducer;