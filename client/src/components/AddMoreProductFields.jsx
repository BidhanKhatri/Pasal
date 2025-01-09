import React from "react";
import { IoIosRemove, IoMdClose } from "react-icons/io";

const AddMoreProductFields = ({ isVisible, close, value, onChange, submit }) => {
  if (!isVisible) return null;
  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 h-screen flex items-center justify-center bg-black bg-opacity-10 z-20">
      <form className="max-w-md w-full bg-white p-4 shadow-md grid relative rounded-md">
        <p className="font-semibold grid">Add Field</p>
        <label htmlFor="fieldName" className="mt-2">
          Field Name
        </label>
        <input
          type="text"
          name="fieldName"
          id="fieldName"
          className="border border-gray-400 p-2 rounded-md w-full focus:border-lime-500 outline-none"
          placeholder="Enter field name"
          autoFocus
          value={value}
          onChange={onChange}
        />
        <IoMdClose
          size={32}
          className="absolute top-2 right-2 p-2 cursor-pointer"
          onClick={close}
        />
        <button onClick={submit} className="bg-lime-600 text-white p-2 rounded-md mt-2 font-semibold tracking-wider">
          Add
        </button>
      </form>
    </section>
  );
};

export default AddMoreProductFields;
