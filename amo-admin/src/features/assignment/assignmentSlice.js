import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

const initialState = {
    loading: false,
    assignments: null,
    totalPages: 0,
    totalItems:0,
    params:{KeySearch:"", State:"", AssignedDate:null, OrderProperty:'asset.code', Desc:false, Page:0,Limit:10,UserId:''}

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



export const createNewAssignmentAsync = createAsyncThunk(
    "users/createNewAssignment",
    async (values, { rejectWithValue }) => {
      try {
        const response = await axiosClient.post(`api/assignment`, values);
        return response;
      } catch (error) {
      console.log(error);
        return rejectWithValue(error.response);
      }
    }
  );
export const getListAssignment = createAsyncThunk(
  "assignment/getListAssignment",
    async (values, { rejectWithValue }) => {
      try {
        const response = await axiosClient.get(`api/assignment/find`, {params:values});
        return response;
      } catch (error) {
      console.log(error);
        return rejectWithValue(error.response);
      }
    }
)
export const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers:{
    onChangePage(state, action) {
      console.log(action.payload)
        state.params.Page = action.payload;
        console.log(state.currentPage)

    },
   
    setUserId(state,action){
      state.params.UserId=action.payload;
    },
    setParams(state,action){
      console.log(action.payload.key)
      switch(action.payload.key){
        
        case "KeySearch":
          state.params.KeySearch=action.payload.value;
        case "Page":
          state.params.Page=action.payload.value;
        case "AssignedDate":
          state.params.AssignedDate=action.payload.value;
        case "OrderProperty":
          state.params.OrderProperty=action.payload.value;
        case "Desc":
          state.params.Desc=action.payload.value;
      }

    },
    setFilter(state,action){
      state.params.State=action.payload.value
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createNewAssignmentAsync.pending, (state, action) => {
      state.loading = true;
    }).addCase(createNewAssignmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        alert("Assignment Created Successfully");
    }).addCase(createNewAssignmentAsync.rejected, (state, action) => {
        state.loading = false;
        alert(action.payload.message || "Something went wrong");
    }).addCase(getListAssignment.pending, (state, action) => {
      state.loading = true;
    }).addCase(getListAssignment.fulfilled, (state, action) => {
        state.loading = false;
        
        state.totalPages = action.payload.totalPages;
        state.params.Page = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
        action.payload.items.map((x)=>{
            if (x.state === 2) {
              x.state = "Accepted";
            } else {
              x.state = "Waiting for accept";
            }
            return x;
        })  
        state.assignments =action.payload.items
        console.log(state.assignments)
    }).addCase(getListAssignment.rejected, (state, action) => {
        state.loading = false;
        alert(action.payload.message || "Something went wrong");
    })
    ;
  },
});
export const {  onChangePage, setFilter,setSearch,setUserId,setSort,setDesc,setParams} = assignmentSlice.actions;

export default assignmentSlice.reducer;
