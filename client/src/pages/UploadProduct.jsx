import React, { useState } from "react";
import { IoIosClose, IoIosCloudUpload } from "react-icons/io";
import { useSelector } from "react-redux";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subcategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
    previewImage: [],
  });

  console.log("state ko data", data);

  const allCategoryData = useSelector((state) => state?.product?.allCategory);
  const allSubCategoryData = useSelector(
    (state) => state?.subcategory?.subCategory
  );
  //   console.log("all category data", allCategoryData);
  //   console.log("all subcategory data", allSubCategoryData);

  //function to handle image changes
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image, file],
        previewImage: file
          ? [...prev.previewImage, URL.createObjectURL(file)]
          : null,
      };
    });
  };

  //handle remove preview image
  const handleDeletePreviewImage = (index) => {
    data.previewImage.splice(index, 1);
    data.image.splice(index, 1);

    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  //handle option change for category
  const handleOptionChange = (e) => {
    const optionId = e.target.value;
    const foundedCategory = allCategoryData.find((el) => el._id === optionId);

    setData((prev) => {
      return {
        ...prev,
        category: [...prev.category, foundedCategory],
      };
    });
  };

  //handle option change for subcategory
  const handleSubCategoryOptionChange = (e) => {
    const optionId = e.target.value;
    const subCategory = allSubCategoryData.find((el) => el._id === optionId);

    setData((prev) => {
      return {
        ...prev,
        subcategory: [...prev.subcategory, subCategory],
      };
    });
  };

  //handle delete choose category
  const handleDeleteChoosedCategory = (id) => {
    setData((prev) => {
      return {
        ...prev,
        category: prev.category.filter((el) => el._id !== id),
      };
    });
  };

  //handle delete choose subcategory
  const handleDeleteChoosedSubCategory = (id) => {
    setData((prev) => {
      return {
        ...prev,
        subcategory: prev.subcategory.filter((el) => el._id !== id),
      };
    });
  };

  return (
    <section className="">
      <div className="w-full p-4 bg-white shadow-md flex items-center justify-between rounded-md">
        <h2 className="font-semibold text-2xl">Upload Product</h2>
      </div>
      <div className=" gird mt-4">
        <form className="px-0">
          <div className="grid">
            <label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
              placeholder="Enter product name"
              autoFocus
            />
          </div>
          <div className="grid mt-4">
            <label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              className="rounded-md outline-none p-2 border focus:border-lime-500 resize-none bg-gray-50"
              placeholder="Enter description..."
              rows={2}
              maxLength={200}
            />
          </div>
          <div className="grid mt-4">
            <label htmlFor="image">
              <div className="bg-gray-50 py-6 flex items-center justify-center gap-4 cursor-pointer rounded-md border-dashed border border-lime-500 focus:border-lime-600 text-neutral-600">
                Add Images <IoIosCloudUpload size={32} />
              </div>
            </label>
            <input
              type="file"
              id="image"
              className="rounded-md outline-none p-2 border focus:border-lime-500 resize-none bg-gray-50"
              rows={2}
              maxLength={200}
              hidden
              onChange={handleImageChange}
            />
          </div>

          <div className="flex gap-2 mt-2 flex-wrap">
            {/* Preview Images */}
            {data.previewImage &&
              data.previewImage.map((image, index) => (
                <div
                  key={index}
                  className="w-24 h-24 bg-gray-50 rounded-md shadow-sm relative"
                >
                  <img
                    src={image}
                    alt={image + "img"}
                    className="w-full h-full object-scale-down"
                  />
                  <div
                    className="absolute top-0 right-0  bg-red-500 text-white rounded cursor-pointer hover:opacity-80 transition-all duration-500 ease-in-out"
                    onClick={() => handleDeletePreviewImage(index)}
                  >
                    <IoIosClose size={24} />
                  </div>
                </div>
              ))}
          </div>
          <div className="grid mt-4">
            <label htmlFor="category" className="cursor-pointer">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50"
              id="category"
              onChange={handleOptionChange}
            >
              <option value={""}>Select Category </option>

              {allCategoryData.map((cat, index) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {/* Display Selected Categories */}

          {data.category.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-md flex flex-wrap gap-2">
              {data.category.length > 0 &&
                data.category.map((cat, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded-md text-xs flex items-center gap-2 "
                  >
                    {cat.name}{" "}
                    <IoIosClose
                      size={18}
                      className="hover:text-red-500 cursor-pointer"
                      onClick={() => handleDeleteChoosedCategory(cat._id)}
                    />
                  </div>
                ))}
            </div>
          )}

          <div className="grid mt-4">
            <label htmlFor="category" className="cursor-pointer">
              Sub Category <span className="text-red-500">*</span>
            </label>
            <select
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50"
              id="category"
              onChange={handleSubCategoryOptionChange}
            >
              <option value={""}>Select Sub Category  </option>

              {allSubCategoryData.map((cat, index) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display sub Selected Categories */}

          {data.subcategory.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-md flex flex-wrap gap-2">
              {data.subcategory.length > 0 &&
                data.subcategory.map((cat, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded-md text-xs flex items-center gap-2 "
                  >
                    {cat.name}{" "}
                    <IoIosClose
                      size={18}
                      className="hover:text-red-500 cursor-pointer"
                      onClick={() => handleDeleteChoosedSubCategory(cat._id)}
                    />
                  </div>
                ))}
            </div>
          )}
          <div className="grid mt-4">
            <label htmlFor="stock">Unit:</label>
            <input
              type="number"
              id="unit"
              value={data.unit}
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
            />
          </div>
          <div className="grid mt-4">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              id="stock"
              value={data.stock}
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
            />
          </div>
          <div className="grid mt-4">
            <label htmlFor="price">Price: (Rs)</label>
            <input
              type="number"
              id="price"
              value={data.price}
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
            />
          </div>
          <div className="grid mt-4">
            <label htmlFor="discount">Discount:</label>
            <input
              type="number"
              id="discount"
              value={data.discount}
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadProduct;
