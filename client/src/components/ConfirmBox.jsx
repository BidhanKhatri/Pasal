import React from "react";
import { IoIosClose } from "react-icons/io";

const ConfirmBox = ({ close, cancel, confirm, categoryName = "", catType }) => {
  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 h-screen flex items-center justify-center bg-black bg-opacity-10 z-20">
      <div className="relative max-w-sm rounded-md bg-white p-4 shadow-md w-full animate-custom">
        <p className="text-center  text-wrap">
          Delete {catType ? catType : ""} Category{" "}
          <span className="font-semibold text-red-500"> {categoryName}</span> ?{" "}
        </p>
        <div className="flex gap-2 mt-4 ">
          <button
            onClick={cancel}
            className=" text-red-500 px-4 py-1.5 rounded-md flex-1 border border-red-500 hover:bg-red-600 hover:text-white transition-all duration-500 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className="hover:bg-lime-600 hover:text-white text-lime-600 border border-lime-600 px-4 py-1.5 rounded-md flex-1  transition-all duration-500 ease-in-out"
          >
            Confirm
          </button>
        </div>
        <div>
          <IoIosClose
            size={24}
            className="absolute top-2 right-2"
            onClick={close}
          />
        </div>
      </div>
    </section>
  );
};

export default ConfirmBox;
