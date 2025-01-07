import { createSlice } from "@reduxjs/toolkit";

let initalValue = {
  allCategory: [],
  subCategory: [],
  product: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: initalValue,
  reducers: {
    setAddCategory: (state, action) => {
      state.allCategory = [...action.payload];
    },
    setSubCategory: (state, action)=>{
      state.subCategory = [...action.payload];
    }
  },
});

export const { setAddCategory, setSubCategory } = productSlice.actions;
export default productSlice.reducer;
