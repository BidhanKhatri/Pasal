import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";
import UserProfileMobile from "../pages/UserProfileMobile";
import Dashboard from "../layouts/Dashboard";
import ProfilePage from "../pages/ProfilePage";
import MyOrders from "../pages/MyOrders";
import SaveAddress from "../pages/SaveAddress";
import Category from "../adminpages/Category";
import SubCategory from "../adminpages/SubCategory";
import AdminPermission from "../layouts/AdminPermission";
import UploadProduct from "../adminpages/UploadProduct";
import ProductPage from "../adminpages/ProductPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "otp-verify",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "profile-mob",
        element: <UserProfileMobile />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile-desk",
            element: <ProfilePage />,
          },
          {
            path: "orders",
            element: <MyOrders />,
          },
          {
            path: "save-address",
            element: <SaveAddress />,
          },
          {
            path: "category",
            element: (
              <AdminPermission>
                <Category />
              </AdminPermission>
            ),
          },
          {
            path: "sub-category",
            element: (
              <AdminPermission>
                <SubCategory />
              </AdminPermission>
            ),
          },

          {
            path: "upload-product",
            element: (
              <AdminPermission>
                <UploadProduct />
              </AdminPermission>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermission>
                <ProductPage />
              </AdminPermission>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
