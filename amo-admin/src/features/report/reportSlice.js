import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

const initialState = {
  reports: [],
  loading: false,
  error: null,
};

export const getReportListAsync = createAsyncThunk(
  "report/getReportList",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("api/category/report");
      console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getReportListAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getReportListAsync.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getReportListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const { reducer, actions } = reportSlice;
export default reducer;
