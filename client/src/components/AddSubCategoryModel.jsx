import axios from "axios";
import React, { useState } from "react";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSubCategory } from "../redux/productSlice";

const AddSubCategoryModel = ({ close }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: [],
  });

  const [loading, setLoading] = useState(false);

  const allCategoryData = useSelector((state) => state?.product?.allCategory);
  const allSubCategoryData = useSelector(
    (state) => state?.subcategory.subCategory
  );
  const dispatch = useDispatch();
  // console.log("all cat data", allCategoryData);

  // console.log(subCategoryData);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setSubCategoryData((prev) => {
      if (type === "file") {
        const file = files[0];
        return {
          ...prev,
          [name]: files[0],
          previewImg: file ? URL.createObjectURL(file) : "",
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  //function to handle select option value change
  const handleOptionChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = allCategoryData.find(
      (cat) => cat._id === selectedCategoryId
    );

    if (!selectedCategory) {
      console.log("category not found");
      return;
    }

    // console.log(selectedCategory);
    setSubCategoryData((prev) => {
      const isDuplicate = prev.category.some(
        (cat) => cat._id === selectedCategory._id
      );

      if (!isDuplicate) {
        return { ...prev, category: [...prev.category, selectedCategory] };
      }

      return prev;
    });
  };

  //function to remove the selected category
  const handleRemoveSelectedCategory = (id) => {
    setSubCategoryData((prev) => {
      return {
        ...prev,
        category: prev.category.filter((cat) => cat._id !== id),
      };
    });
  };

  //function to add the subCategory
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("name", subCategoryData.name);
      formData.append("image", subCategoryData.image);

      subCategoryData.category.forEach((cat) => {
        formData.append("category", cat._id);
      });

      setLoading(true);

      const result = await axios.post(
        "/proxy/api/subcategory/add-subcategory",
        formData
      );

      if (result && result.data.success) {
        toast.success(result.data.msg);
        // console.log("easo ayo ", result.data.data);
        const isArrayData = Array.isArray(result.data.data)
          ? result.data.data
          : [result.data.data];
        const updatedSubCategories = [...allSubCategoryData, ...isArrayData];
        dispatch(setSubCategory(updatedSubCategories));
        close();
      } else {
        toast.error(result.data.msg || "Unable to upload subcategory");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black bg-opacity-10 z-20 fixed h-screen top-0 right-0 bottom-0 left-0 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="relative max-w-xl mx-auto rounded-md bg-white px-6 py-4 shadow-md w-full grid animate-custom"
      >
        <p className="font-semibold text-xl">Add Sub Category</p>

        <div className="grid mt-2">
          <label htmlFor="category">Name:</label>
          <input
            type="text"
            placeholder="Enter sub category name"
            className="p-2 rounded-md outline-none border focus:border-lime-500"
            name="name"
            onChange={handleChange}
            autoFocus
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
              <img
                src={subCategoryData.previewImg}
                alt="preview-img"
                className="w-full h-full flex items-center justify-center text-neutral-400"
                name="image"
              />

              {/* <p className="text-gray-500 text-center p-4 text-sm">
                  No Image
                </p> */}
            </div>
          </div>
        </div>

        {/* section to select multiple categories */}
        <div className="grid mt-4">
          <label htmlFor="category">Select Category:</label>

          {/* Display the selected category */}

          {subCategoryData.category.length > 0 && (
            <div className="bg-lime-100 flex gap-2 flex-wrap p-2 rounded-md">
              {subCategoryData.category.map((selCat, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white px-2 py-1 rounded-md text-xs shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      {selCat?.name}{" "}
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
            className="p-2 rounded-md outline-none border focus:border-lime-500 mt-2"
            onChange={handleOptionChange}
          >
            <option value="">Select Category</option>

            {allCategoryData.map((category, index) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          //   disabled={!isAllFieldsAvailable}
          className={`mt-4 bg-lime-600  hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-all duration-400 ease-in font-semibold`}
        >
          {loading ? "Uploading..." : "Add Sub Category"}
        </button>
      </form>
    </section>
  );
};

export default AddSubCategoryModel;
