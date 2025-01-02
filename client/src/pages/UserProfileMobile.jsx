import React from "react";
import UserProfileModel from "../components/UserProfileModel";
import { FaCross } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const UserProfileMobile = () => {
  return (
    <section className="px-4 min-h-screen ">
      <span
        className=" block w-fit ml-auto my-2"
        onClick={() => window.history.back()}
      >
        <IoMdClose size={24} />
      </span>
      <div className="bg-gray-200/40 p-2 rounded-md shadow-md">
        <UserProfileModel />
      </div>
    </section>
  );
};

export default UserProfileMobile;
