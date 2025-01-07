import React, { useState } from "react";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const AddCategoryModel = ({ close, getAllCategory }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  let isAllFieldsAvailable = Object.values(categoryData).every((el) => el);
  console.log(isAllFieldsAvailable);

  const preViewImage = categoryData.image
    ? URL.createObjectURL(categoryData.image)
    : null;

  //   console.log(categoryData);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setCategoryData((prev) => {
      if (type === "file") {
        return { ...prev, [name]: files[0] };
      }
      return { ...prev, [name]: value };
    });
  };

  //function to add the category

  const addCategory = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          authorization: `Bearer ${localStorage?.getItem("authToken")}`,
        },
      };

      const formData = new FormData();
      formData.append("name", categoryData.name);
      formData.append("image", categoryData.image);

      setLoading(true);
      const result = await axios.post(
        "/proxy/api/category/add-category",
        formData,
        config
      );

      if (result && result.data.success) {
        toast.success(result.data.msg);
        getAllCategory();
        close();
      }
    } catch (error) {
      console.log(error);
      toast.error(result.data.msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-30 flex items-center justify-center">
      <form
        onSubmit={addCategory}
        className="relative max-w-xl mx-auto rounded-md bg-white px-6 py-4 shadow-md w-full grid animate-custom"
      >
        <p className="font-semibold text-xl">Category</p>

        <div className="grid mt-2">
          <label htmlFor="category">Name:</label>
          <input
            type="text"
            name="name"
            id="category"
            placeholder="Enter category name"
            className="p-2 rounded-md outline-none border focus:border-lime-500"
            autoFocus
            onChange={handleChange}
          />
          <span
            className="w-fit absolute top-2 right-2 text-2xl cursor-pointer "
            onClick={close}
          >
            <IoMdClose />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 items-center">
          {/* Upload Button */}
          <label htmlFor="img" className="col-span-1">
            <div className="border border-dashed border-gray-400 p-4 rounded-md cursor-pointer hover:border-lime-500 hover:bg-lime-50 transition-all duration-500 ease-in-out flex items-center gap-2 justify-center w-full">
              {preViewImage ? "Change Image" : "Add Image"} <IoMdCloudUpload />
            </div>
          </label>

          {/* Hidden Input */}
          <input
            type="file"
            name="image"
            id="img"
            className="hidden"
            onChange={handleChange}
          />

          {/* Preview Image */}
          <div className="flex justify-center col-span-1">
            <div className="relative w-32 h-32 bg-gray-200 border border-gray-300 rounded-md overflow-hidden">
              {preViewImage ? (
                <img
                  src={preViewImage}
                  alt="preview-img"
                  className="w-full h-full "
                />
              ) : (
                <p className="text-gray-500 text-center p-4 text-sm">
                  No Image
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          disabled={!isAllFieldsAvailable}
          className={`mt-4  ${
            isAllFieldsAvailable
              ? "bg-lime-600  hover:bg-opacity-90 "
              : "bg-gray-500"
          } text-white px-4 py-2 rounded-md transition-all duration-400 ease-in`}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryModel;
