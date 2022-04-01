import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    categories: [],
    loading: false,
    error: null
};

export const getAllCategoriesAsync = createAsyncThunk(
    "category/getAllCategories",
    async (values, { rejectWithValue }) => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL_END_POINT + "api/category");
            return response;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategoriesAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
                state.categories = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllCategoriesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }});

const { reducer, actions } = categorySlice;
export const { onChangePageName } = actions;
export default reducer;