import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

const initialState = {
  namepage: "Home",
  loading: false,
  assignments: null,
  assignmentId: null,
  listChange: true,
};
export const getListAssignment = createAsyncThunk(
  "home/getListAssignment",
  async (values, { rejectWithValue }) => {
    try {
      var user = JSON.parse(localStorage.getItem("user"));
      const response = await axiosClient.get(
        `api/assignment/users/${user.profile.sub}`,
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  },
);
export const acceptAssignment = createAsyncThunk(
  "home/acceptAssignment",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`api/assignment/accept`, {
        id: values,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  },
);
export const declineAssignment = createAsyncThunk(
  "home/declineAssignment",
  async (values, { rejectWithValue }) => {
    try {
      console.log(values);
      const response = await axiosClient.put(`api/assignment/decline`, {
        id: values,
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  },
);
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    onChangePageName(state, action) {
      state.namepage = action.payload;
    },
    setIdAssignment(state, action) {
      state.assignmentId = action.payload;
    },
    onListChange(state) {
      state.listChange = !state.listChange;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListAssignment.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListAssignment.fulfilled, (state, action) => {
        state.loading = false;

        action.payload.map((x) => {
          if (x.state === 0) {
            x.state = "Accepted";
          } else {
            x.state = "Waiting for accept";
          }
          return x;
        });
        state.assignments = action.payload;
        console.log(state.assignments);
      })
      .addCase(getListAssignment.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(acceptAssignment.fulfilled, (state, action) => {
        state.assignments.forEach((x) => {
          if (x.id === state.assignmentId) {
            x.state = "Accepted";
          }
        });
        alert("Done");
      })
      .addCase(declineAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(
          (user) => user.id !== state.assignmentId,
        );
        alert("Done");
      });
  },
});

const { reducer, actions } = homeSlice;
export const { onChangePageName, setIdAssignment, onListChange } = actions;
export default reducer;
