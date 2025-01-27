import axios from "axios";
import React from "react";
import { IoMdExit } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import isAdmin from "../utils/isAdmin";

function UserProfileModel({ close }) {
  const userData = useSelector((state) => state?.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  //function to handle logout
  const handleLogout = async () => {
    try {
      const config = {
        headers: { "content-type": "application/json" },
      };

      const result = await axios.get("/proxy/api/user/logout", config);

      if (result && result.data.success === true) {
        if (close) {
          close();
        }

        dispatch(logout());
        localStorage.clear();
        toast.success(result.data.msg);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      console.log(error);
    }
  };
  const handleClose = () => {
    if (close) {
      close();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center  gap-2 ">
          <div className="w-12 h-12 rounded-full bg-gray-200/20 flex items-center justify-center shadow-md border ring-2 ring-lime-500 overflow-hidden">
            <img src={userData.avatar} alt="img" className="w-full h-full" />
          </div>
          <div className="text-sm  rounded-md  w-fit px-2 py-1 tracking-wide font-semibold">
            ( {userData.role} )
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>User: {userData.name}</span>{" "}
          <Link onClick={handleClose} to="/dashboard/profile-desk">
            <FaExternalLinkAlt className="hover:text-lime-500 cursor-pointer transition-all duration-400 ease-in-out" />
          </Link>
        </div>
        <div className="flex  items-center justify-between">
          Status: {userData.status}
          <span>
            {userData.status === "Active" ? (
              <div className="bg-green-500 h-2 w-2  rounded-full"></div>
            ) : (
              <div className="bg-red-500 h-2 w-2  rounded-full"></div>
            )}
          </span>
        </div>
        <hr />

        {isAdmin(userData.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/dashboard/category"
              className="hover:bg-lime-200/40 p-2 rounded-md transition-all duration-300 ease-in-out"
            >
              Category
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/sub-category"
              className="hover:bg-lime-200/40 p-2 rounded-md transition-all duration-300 ease-in-out"
            >
              Sub Category
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/upload-product"
              className="hover:bg-lime-200/40 p-2 rounded-md transition-all duration-300 ease-in-out"
            >
              Upload Product
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/product"
              className="hover:bg-lime-200/40 p-2 rounded-md transition-all duration-300 ease-in-out"
            >
              Product
            </Link>
          </>
        )}

        <Link
          onClick={handleClose}
          to="/dashboard/orders"
          className="hover:bg-lime-200/40 p-2 rounded-md transition-all duration-300 ease-in-out"
        >
          My Orders
        </Link>
        <Link
          onClick={handleClose}
          to="/dashboard/save-address"
          className="hover:bg-lime-200/40 p-2 rounded-md transition-all duration-300 ease-in-out"
        >
          Save Address
        </Link>
        <div>
          <div
            onClick={handleLogout}
            className=" flex items-center justify-between  rounded-md transition-all duration-300 ease-in-out w-full divide-x-2"
          >
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-md hover:text-white w-full transition-all duration-700 hover:bg-red-500">
              <IoMdExit /> Logout
            </button>
            <button className="flex items-center gap-2  px-4 py-1.5 rounded-md hover:text-white w-full transition-all duration-700 hover:bg-gray-500">
              <IoMdExit /> Setting
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfileModel;
