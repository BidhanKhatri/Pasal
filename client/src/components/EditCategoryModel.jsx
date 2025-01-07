import axios from "axios";
import React, { useState } from "react";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";
import { toast } from "react-toastify";

const EditCategoryModel = ({
  close,
  editCategoryData,
  setEditCategoryData,
  getAllCategory,
}) => {
  const [loading, setLoading] = useState(false);
  console.log(editCategoryData);

  //   isAllFieldsAvailable = Object.values(data).every((el) => el);

  //function to handle the popup close and reset edit category data
  const handleClose = () => {
    if (close) {
      setEditCategoryData({
        ...editCategoryData,
        id: "",
        name: "",
        image: "",
        previewImage: null,
      });
      close();
    }
  };

  //function to handle the value change in the form
  const handleChange = (e) => {
    try {
      const { name, value, files, type } = e.target;

      setEditCategoryData((prev) => {
        if (type === "file") {
          const file = files[0];
          return {
            ...prev,
            [name]: file,
            previewImage: file ? URL.createObjectURL(file) : null,
          };
        }
        return { ...prev, [name]: value };
      });
    } catch (error) {
      console.log(error);
    }
  };

  //function to update the category
  const updateCategory = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("id", editCategoryData.id);
      formData.append("name", editCategoryData.name);
      formData.append("image", editCategoryData.image);

      setLoading(true);

      const result = await axios.put(
        "/proxy/api/category/update-category",
        formData
      );
      if (result && result.data.success) {
        toast.success(result.data.msg);
        getAllCategory();
        setEditCategoryData({
          ...editCategoryData,
          id: "",
          name: "",
          image: "",
          previewImage: null,
        });
        close();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed bg-black bg-opacity-20 top-0 left-0 right-0 bottom-0 z-20 flex items-center justify-center">
      <form
        onSubmit={updateCategory}
        className="relative max-w-xl mx-auto rounded-md bg-white px-6 py-4 shadow-md w-full grid animate-custom"
      >
        <p className="font-semibold text-xl">Update Category</p>

        <div className="grid mt-2">
          <label htmlFor="category">Name:</label>
          <input
            type="text"
            name="name"
            id="category"
            placeholder="Enter category name"
            className="p-2 rounded-md outline-none border focus:border-lime-500"
            autoFocus
            value={editCategoryData.name}
            onChange={handleChange}
          />
          <span
            className="w-fit absolute top-2 right-2 text-2xl cursor-pointer "
            onClick={handleClose}
          >
            <IoMdClose />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 items-center">
          {/* Upload Button */}
          <label htmlFor="img" className="col-span-1">
            <div className="border border-dashed border-gray-400 p-4 rounded-md cursor-pointer hover:border-lime-500 hover:bg-lime-50 transition-all duration-500 ease-in-out flex items-center gap-2 justify-center w-full">
              {/* {preViewImage ? "Change Image" : "Add Image"} <IoMdCloudUpload /> */}{" "}
              Change Image <IoMdCloudUpload />
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
              {editCategoryData.image ? (
                <img
                  src={editCategoryData.previewImage || editCategoryData.image}
                  alt="preview-img"
                  className="w-full h-full "
                  name="image"
                  onChange={handleChange}
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
          //   disabled={!isAllFieldsAvailable}
          className={`mt-4  bg-lime-600  hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-all duration-400 ease-in`}
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </section>
  );
};

export default EditCategoryModel;
