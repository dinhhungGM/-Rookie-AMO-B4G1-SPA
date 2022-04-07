import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClientId4 from "../../api/axiosClientId4";

const initialState = {
  users: [],
  userid:'',
  updateUser:{ email:'', dateOfBirth:'', joinedDate:'', gender:'', type:'' },
  user:{id:'',firstName:'', lastName:'', email:'', dateOfBirth:'', joinedDate:'', gender:'', type:'' },
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  loading: false,
  error: null,
  listChange: false,
  isRelatetoAssignment:false,
  filter:'',
  searchname:'',
  sort:'codeStaff',
  desc:false,
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
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (values,{ rejectWithValue }) => {
    try {
      const response = await axiosClientId4.get(`/api/users/${values}`);
    
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);


export const updateUserAsync = createAsyncThunk(
  "user/updateUserAsync",
  async (values,{ rejectWithValue }) => {
    try {
      const response = await axiosClientId4.put(`api/users/${values.Id}`, values);
            return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
const convertString =(date)=>{
  var day = date.slice(0,2);
  var month = date.slice(3,5);
  var year = date.slice(6,10);
  return year + "-" + month + "-" + day;

}
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
    },
    setSort(state,action){
      state.sort=action.payload;
    },
    setDesc(state,action){
      state.desc=action.payload;
    },
    setUserId(state,action){
      state.userid=action.payload;
    },
    setSortColumn(state,action){
      console.log("AAAAA")
      state.sortColumn=action.payload;
      
    },
    updateUser(state,action){
      state.updateUser.gender=action.payload.gender
      state.updateUser.dateOfBirth= new Date(action.payload.dateOfBirth)
      state.updateUser.joinedDate=new Date(action.payload.joinedDate)
      state.updateUser.type=action.payload.type
    }

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
        state.loading = true
      })
      .addCase(getPagedUsersAsync.fulfilled, (state, action) => {
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
    })
    .addCase(getUserById.fulfilled, (state,action)=>{
      state.user=action.payload;

      console.log(state.user)
    })
    .addCase(getUserById.pending, (state,action)=>{
      state.loading=true;
    })
    .addCase(getUserById.rejected, (state,action)=>{
         state.loading = false;
        state.error = action.payload;
        alert("Error Loading user");
    })
    .addCase(updateUserAsync.fulfilled, (state,action)=>{
      alert("Success Update User");
    })
    .addCase(updateUserAsync.rejected, (state,action)=>{
         state.loading = false;
        state.error = action.payload;
        alert("Error Update user");
    });
  },
});
export const {  onChangePage,setUser,onListChange ,setFilter,setSearch,setUserId,setSort,setDesc,setSortColumn, updateUser} = userSlice.actions;
export default userSlice.reducer;
