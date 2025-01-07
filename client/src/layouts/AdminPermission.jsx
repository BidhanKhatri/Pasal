import React from "react";
import { useSelector } from "react-redux";
import isAdmin from "../utils/isAdmin";
import { IoIosAlert } from "react-icons/io";

const AdminPermission = ({ children }) => {
  const userData = useSelector((state) => state?.user);
  return (
    <div>
      {isAdmin(userData.role) ? (
        children
      ) : (
        <p className=" bg-lime-100 w-full p-4  font-semibold flex items-center justify-center gap-2"><IoIosAlert size={24} /> No Permssion</p>
      )}
    </div>
  );
};

export default AdminPermission;
