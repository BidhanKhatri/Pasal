import axios from "axios";
import React, { useState } from "react";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSubCategory } from "../redux/productSlice";

const EditSubCategoryModel = ({
  close,
  editSubCategoryData,
  setEditSubCategoryData,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //get all of category using the redux prodytSlice
  const allCategoryData = useSelector((state) => state?.product?.allCategory);
  // console.log("edit sub ma ako redux ko all category data", allCategoryData);

  console.log("editSubCategoryData", editSubCategoryData);

  //function to handle change
  const handleChange = (e) => {
    const { value, name, files, type } = e.target;

    setEditSubCategoryData((prev) => {
      if (type === "file") {
        const file = files[0];

        return {
          ...prev,
          [name]: file,
          previewChangedImg: file ? URL.createObjectURL(file) : null,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  //function to handle popup close and also to clear the previewImage state
  const handleClose = () => {
    if (close) {
      close();
    }

    setEditSubCategoryData((prev) => {
      return { ...prev, previewChangedImg: "" };
    });
  };

  //function to handle the option change to manupulate the array
  const handleOptionChange = (e) => {
    const selectedOptionId = e.target.value;
    const findTheIdInAllCategoryData = allCategoryData.find(
      (el) => el._id === selectedOptionId
    ); //return the object which matches with that id

    if (!findTheIdInAllCategoryData) {
      console.log("Id is not defined");
      return;
    }

    //check in the duplicate value already exist on the state (setEditSubCategoryData)
    const isDuplicate = editSubCategoryData.category.some(
      (el) => el._id === findTheIdInAllCategoryData._id
    );

    setEditSubCategoryData((prev) => {
      if (!isDuplicate) {
        return {
          ...prev,
          category: [...prev.category, findTheIdInAllCategoryData],
        };
      }

      return prev;
    });
  };

  //remove the selected category
  const handleRemoveSelectedCategory = (id) => {
    setEditSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat._id !== id),
    }));
  };

  //function to fetch the updated state of subCategory
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

  //function to update sub category
  const updateSubCategory = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("name", editSubCategoryData.name);
      formData.append("image", editSubCategoryData.image);
      formData.append("id", editSubCategoryData.id);

      editSubCategoryData.category.map((cat) => {
        formData.append("category", cat._id);
      });

      setLoading(true);

      const result = await axios.put(
        "/proxy/api/subcategory/update-subcategory",
        formData
      );

      if (result && result.data.success) {
        toast.success(result.data.msg);
        await getAllSubCategory();
        close();
        setEditSubCategoryData((prev) => {
          return {
            ...prev,
            previewChangedImg: "",
          };
        });
      } else {
        toast.error(result.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed bg-black bg-opacity-20 top-0 left-0 right-0 bottom-0 z-20 flex items-center justify-center">
      <form
        onSubmit={updateSubCategory}
        className="relative max-w-xl mx-auto rounded-md bg-white px-6 py-4 shadow-md w-full grid animate-custom"
      >
        <p className="font-semibold text-xl">Update Sub Category</p>

        <div className="grid mt-2">
          <label htmlFor="subcategory">Name:</label>
          <input
            type="text"
            name="name"
            id="subcategory"
            placeholder="Enter sub category name"
            className="p-2 rounded-md outline-none border focus:border-lime-500"
            autoFocus
            value={editSubCategoryData.name}
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
              {editSubCategoryData.image ? (
                <img
                  src={
                    editSubCategoryData?.previewChangedImg ||
                    editSubCategoryData.image
                  }
                  alt="preview-img"
                  className="w-full h-full "
                  name="image"
                />
              ) : (
                <p className="text-gray-500 text-center p-4 text-sm">
                  No Image
                </p>
              )}
            </div>
          </div>
        </div>

        {/* section to select multiple categories */}
        <div className="grid mt-4">
          <label htmlFor="category">Select Category:</label>

          {/* Display the selected category */}

          {editSubCategoryData.category.length > 0 && (
            <div className="bg-lime-100 flex gap-2 flex-wrap p-2 rounded-md">
              {editSubCategoryData.category.map((selCat, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white px-2 py-1 rounded-md text-xs shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      {selCat.name}{" "}
                      <span
                        className="cursor-pointer hover:text-red-500 transition-all duration-500 ease-in-out"
                        onClick={() =>
                          handleRemoveSelectedCategory(selCat?._id)
                        }
                      >
                        <IoMdClose />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <select
            onChange={handleOptionChange}
            className="p-2 rounded-md outline-none border focus:border-lime-500 mt-2"
          >
            <option value="">Select Category</option>
            {allCategoryData.length > 0 &&
              allCategoryData.map((allCat, index) => {
                return (
                  <option key={allCat._id} value={allCat._id}>
                    {allCat.name}
                  </option>
                );
              })}
          </select>
        </div>

        <button
          //   disabled={!isAllFieldsAvailable}
          className={`mt-4  bg-lime-600  hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-all duration-400 ease-in`}
        >
          {loading ? "Updating...." : "Update Sub Category"}
        </button>
      </form>
    </section>
  );
};

export default EditSubCategoryModel;
