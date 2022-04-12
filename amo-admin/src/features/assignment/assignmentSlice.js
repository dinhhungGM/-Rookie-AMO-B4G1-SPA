import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

const initialState = {
  loading: false,
  assignments: [],
  totalPages: 0,
  totalItems: 0,
  params: {
    KeySearch: "",
    State: "",
    AssignedDate: null,
    OrderProperty: "asset.code",
    Desc: false,
    Page: 0,
    Limit: 10,
    UserId: "",
  },
  assignment: null,
  assignmentIdToDelete: null,
  preAsset: null,
  preUser: null,
};
const mapState = (object) => {
  if (object) {
    const listItem = object.map((x) => {
      if (x.state === 2) {
        x.state = "Accepted";
      } else {
        x.state = "Waiting for accept";
      }
      return x;
    });

    return { ...object, object: listItem };
  }
  return null;
};

export const updateAssignmentAsync = createAsyncThunk(
  "assignment/updateAssignment",
  async (assignment, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        `api/assignment/${assignment.AssignmentId}`,
        assignment,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getAssignmentById = createAsyncThunk(
  "assignment/getAssignmentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`api/assignment/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createNewAssignmentAsync = createAsyncThunk(
  "assignment/createNewAssignment",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`api/assignment`, values);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  },
);
export const getListAssignment = createAsyncThunk(
  "assignment/getListAssignment",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`api/assignment/find`, {
        params: values,
      });
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  },
);

export const deleteAssignmentAsync = createAsyncThunk(
  "assignment/deleteAssignment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(`api/assignment/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    onChangePage(state, action) {
      console.log(action.payload);
      state.params.Page = action.payload;
      console.log(state.currentPage);
    },

    setUserId(state, action) {
      state.params.UserId = action.payload;
    },
    setPreAsset(state, action) {
      state.preAsset = {
        ...state.preAsset,
        id: action.payload.id,
        name: action.payload.name
      }
    },
    setPreUser(state, action) {
      state.preUser = {
        ...state.preUser,
        id: action.payload.id,
        name: action.payload.name
      }
    },
    setParams(state, action) {
      console.log(action.payload.key);
      switch (action.payload.key) {
        case "KeySearch":
          state.params.KeySearch = action.payload.value;
          break;
        case "Page":
          state.params.Page = action.payload.value;
          break;
        case "AssignedDate":
          state.params.AssignedDate = action.payload.value;
          break;
        case "OrderProperty":
          state.params.OrderProperty = action.payload.value;
          break;
        case "Desc":
          state.params.Desc = action.payload.value;
          break;
        default:
      }
    },
    setFilter(state, action) {
      state.params.State = action.payload.value;
    },
    setAssignmentIdToDelete(state, action) {
      state.assignmentIdToDelete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewAssignmentAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createNewAssignmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        alert("Assignment Created Successfully");
      })
      .addCase(createNewAssignmentAsync.rejected, (state, action) => {
        state.loading = false;
        alert(action.payload.message || "Something went wrong");
      })
      .addCase(getListAssignment.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.totalPages = action.payload.totalPages;
        state.params.Page = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
        action.payload.items.map((x) => {
          if (x.state === 0) {
            x.state = "Accepted";
          } else {
            x.state = "Waiting for accept";
          }
          return x;
        });
        state.assignments = action.payload.items;
        console.log(state.assignments);
      })
      .addCase(getListAssignment.rejected, (state, action) => {
        state.loading = false;
        alert(action.payload.message || "Something went wrong");
      })
      .addCase(getAssignmentById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.assignment = action.payload;
      })
      .addCase(getAssignmentById.rejected, (state, action) => {
        state.loading = false;
        alert(action.payload.message || "Something went wrong");
      })
      .addCase(updateAssignmentAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateAssignmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.assignment = action.payload;
        alert("Assignment Updated Successfully");
      })
      .addCase(updateAssignmentAsync.rejected, (state, action) => {
        state.loading = false;
        alert(action.payload.message || "Something went wrong");
      })
      .addCase(deleteAssignmentAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteAssignmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        console.log(state.assignmentIdToDelete);
        state.assignments = state.assignments.filter(
          (x) => x.id !== state.assignmentIdToDelete,
        );
        state.assignmentIdToDelete = null;
        alert("Assignment deleted Successfully");
      })
      .addCase(deleteAssignmentAsync.rejected, (state, action) => {
        state.loading = false;
        alert(action.payload.message || "Something went wrong");
      });
  },
});
export const {
  onChangePage,
  setFilter,
  setSearch,
  setUserId,
  setSort,
  setDesc,
  setParams,
  setAssignmentIdToDelete,
  setPreAsset,
  setPreUser
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
