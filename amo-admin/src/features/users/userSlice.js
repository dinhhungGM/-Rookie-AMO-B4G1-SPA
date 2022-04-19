import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClientId4 from "../../api/axiosClientId4";

const initialState = {
  users: [],
  userid: "",
  updateUser: {
    email: "",
    dateOfBirth: "",
    joinedDate: "",
    gender: "",
    type: "",
  },
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    joinedDate: "",
    gender: "",
    type: "",
  },
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  loading: false,
  error: null,
  listChange: false,
  isRelatetoAssignment: false,
  filter: "",
  searchname: "",
  sort: "codeStaff",
  desc: false,
};

export const getAllUsersAsync = createAsyncThunk(
  "users/getAllUsers",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClientId4.get(`api/users`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  },
);

export const createNewUserAsync = createAsyncThunk(
  "users/createNewUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClientId4.post(`api/users`, values);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  },
);
export const getPagedUsersAsync = createAsyncThunk(
  "user/getPagedUsersAsync",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClientId4.get(`/api/users/find`, {
        params: values,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  },
);
export const disableUser = createAsyncThunk(
  "user/disableUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClientId4.delete(`/api/users/${values}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  },
);

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClientId4.get(`/api/users/${values}`);

      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  },
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUserAsync",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClientId4.put(
        `api/users/${values.Id}`,
        values,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onChangePage(state, action) {
      state.currentPage = action.payload;
    },
    setUser(state, action) {
      state.userid = action.payload;
    },
    onListChange(state) {
      state.listChange = !state.listChange;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setSearch(state, action) {
      state.searchname = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setDesc(state, action) {
      state.desc = action.payload;
    },
    setLoading(state, action) {
      state.loading = true;
    },
    setUserId(state, action) {
      state.userid = action.payload;
    },
    setSortColumn(state, action) {
      state.sortColumn = action.payload;
    },
    updateUser(state, action) {
      state.updateUser.gender = action.payload.gender;
      state.updateUser.dateOfBirth = new Date(action.payload.dateOfBirth);
      state.updateUser.joinedDate = new Date(action.payload.joinedDate);
      state.updateUser.type = action.payload.type;
    },
    resetState(state) {
      state.filter = "";
      state.searchname = "";
      state.sort = "codeStaff";
      state.desc = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewUserAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createNewUserAsync.fulfilled, (state, action) => {
        // state.users.unshift(action.payload);
        state.loading = false;
        state.error = null;
        alert("User created successfully");
      })
      .addCase(createNewUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("Error creating user");
      })
      .addCase(getPagedUsersAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPagedUsersAsync.fulfilled, (state, action) => {
        state.users = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
        state.loading = false;
      })
      .addCase(getPagedUsersAsync.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(disableUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== state.userid);
        alert("Success Delete User!!!");
      })
      .addCase(disableUser.rejected, (state, action) => {
        state.userid = null;
      })

      .addCase(getUserById.fulfilled, (state, action) => {
        state.user = action.payload;

        console.log(state.user);
      })
      .addCase(getUserById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("Error Loading user");
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        alert("Success Update User");
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        alert("Error Update user");
      });
  },
});
export const {
  onChangePage,
  setUser,
  onListChange,
  setFilter,
  setSearch,
  setUserId,
  setSort,
  setDesc,
  setSortColumn,
  updateUser,
  resetState,
  setLoading,
} = userSlice.actions;
export default userSlice.reducer;
