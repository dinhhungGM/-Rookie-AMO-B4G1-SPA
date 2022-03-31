import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClientId4 from "../../api/axiosClientId4";

const initialState = {
  users: [],
  userid:null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  loading: false,
  error: null,
  listChange: false,
  isRelatetoAssignment:false,
  filter:'',
  searchname:'',
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
  }
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
  }
);
export const getPagedUsersAsync = createAsyncThunk(
  "user/getPagedUsersAsync",
  async (values,{ rejectWithValue }) => {
    try {
      const response = await axiosClientId4.get(`/api/users/find${values}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const disableUser = createAsyncThunk(
  "user/disableUser",
  async (values,{ rejectWithValue }) => {
    try {
      const response = await axiosClientId4.delete(`/api/users/${values}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const checkUserIsRelatoAssignment = createAsyncThunk(
  "user/checkUserIsRelatoAssignment",
  async (values,{ rejectWithValue }) => {
    try {
      //Đợi khi nào có api get assignment thì bổ sung vào 
      return false;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onChangePage(state, action) {
      console.log(action.payload)
        state.currentPage = action.payload;
        console.log(state.currentPage)

    },
    setUser(state,action){
      console.log(action.payload)
      state.userid = action.payload;
    },
    onListChange(state){
      state.listChange = !state.listChange;
    },
    setFilter(state,action){
      state.filter = action.payload;
    },
    setSearch(state,action){
      state.searchname = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewUserAsync.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createNewUserAsync.fulfilled, (state, action) => {
        state.users.push(action.payload.data);
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
        state.loading = true
      })
      .addCase(getPagedUsersAsync.fulfilled, (state, action) => {
        console.log(action.payload.items);
        state.users = action.payload.items;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
        state.loading = false
      })
      .addCase(getPagedUsersAsync.rejected, (state, action) => {
        state.loading = false})
      .addCase(disableUser.fulfilled, (state, action) => {
        console.log(state.user);
        state.users = state.users.filter(
          (user) => user.id !== state.userid
        )
        alert("Success Delete User!!!");

    })
      .addCase(disableUser.rejected, (state, action) => {
          state.userid = null;
      })
      .addCase(checkUserIsRelatoAssignment.fulfilled, (state, action) => {
        state.isRelatetoAssignment = action.payload;
    });
  },
});
export const {  onChangePage,setUser,onListChange ,setFilter,setSearch} = userSlice.actions;
export default userSlice.reducer;
