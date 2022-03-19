import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    namepage: "Home"
  }
  
const homeSlice = createSlice({
    name: 'pagename',
    initialState,
    reducers: {
        onChangePageName(state, action) {
            state.namepage = action.payload;
        }
    }
});

const { reducer, actions } = homeSlice;
export const { onChangePageName } = actions;
export default reducer;