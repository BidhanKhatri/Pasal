import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  _id: "",
  name: "",
  email: "",
  avatar: "",
  last_login_date: "",
  status: "",
  address_details: [],
  shopping_cart: [],
  orderHistory: [],
  role: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {
    setUserDetails: (state, action) => {
      state._id = action.payload?._id;
      state.name = action.payload?.name;
      state.email = action.payload?.email;
      state.avatar = action.payload?.avatar;
      state.last_login_date = action.payload?.last_login_date;
      state.status = action.payload?.status;
      state.address_details = action.payload?.address_details;
      state.shopping_cart = action.payload?.shopping_cart;
      state.orderHistory = action.payload?.orderHistory;
      state.role = action.payload?.role;
      state.mobile = action.payload?.mobile;
    },
    updateAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    logout: (state, action) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.avatar = "";
      state.last_login_date = "";
      state.status = "";
      state.mobile = "";
      state.address_details = [];
      state.shopping_cart = [];
      state.orderHistory = [];
      state.role = "";
    },
  },
});

export const { setUserDetails, logout, updateAvatar } = userSlice.actions;

export default userSlice.reducer;