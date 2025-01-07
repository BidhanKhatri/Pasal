import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import fetchUserData from "./utils/fetchUserData";

import { setUserDetails } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAddCategory, setSubCategory } from "./redux/productSlice";
import { toast } from "react-toastify";

function App() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  //fetch user details

  const fetchUser = async () => {
    const userData = await fetchUserData();
    dispatch(setUserDetails(userData.data));
  };

  //function to fetch all category
  const getAllCategory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const result = await axios.get(
        "/proxy/api/category/get-all-category",
        config
      );
      if (result && result.data.success) {
        // setAllCategoryData(result.data.data);
        dispatch(setAddCategory(result.data.data));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  //function to fetch all sub category
  const getAllSubCategory = async () => {
    try {
      const result = await axios.get(
        "/proxy/api/subcategory/get-all-subcategory"
      );
      if (result && result.data.success) {
        dispatch(setSubCategory(result.data.data));
        // console.log(result.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    getAllCategory();
    fetchUser();
    getAllSubCategory();
  }, []);

  return (
    <>
      <ToastContainer />

      <Header />
      <main className="min-h-[80vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
