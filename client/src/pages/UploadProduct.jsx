import React, { useState } from "react";
import { IoIosClose, IoIosCloudUpload } from "react-icons/io";
import { useSelector } from "react-redux";
import AddMoreProductFields from "../components/AddMoreProductFields";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUpload } from "react-icons/fa";

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

  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [loading, setLoading] = useState(false);

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

  //toogle add field
  const toogleAddField = () => setIsAddFieldOpen(!isAddFieldOpen);

  //function to handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value, // Update the specific field
        // more_details: {
        //   ...prev.more_details,
        // },
      };
    });
  };

  const handleAddFieldSubmit = () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: "",
        },
      };
    });

    setFieldName("");
    toogleAddField();
  };

  //function to upload product

  const uploadProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("unit", data.unit);
      formData.append("stock", data.stock);
      formData.append("price", data.price);
      formData.append("discount", data.discount);
      formData.append("description", data.description);

      // Safely handle arrays
      (data.image || []).forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        } else {
          console.error("Invalid file format:", img);
        }
      });

      (data.category || []).forEach((cat) =>
        formData.append("category", cat._id)
      );
      (data.subcategory || []).forEach((subcat) =>
        formData.append("subcategory", subcat._id)
      );

      setLoading(true);

      const result = await axios.post(
        "/proxy/api/product/add-product",
        formData
      );

      if (result && result.data.success) {
        Swal.fire({
          title: result?.data?.msg || "Product Added",
          // text: "You clicked the button!",
          icon: "success",
          confirmButtonColor: "#65A30D",
        });
        setData({
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
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="">
      <div className="w-full p-4 bg-white shadow-md flex items-center justify-between rounded-md">
        <h2 className="font-semibold text-2xl">Upload Product</h2>
      </div>
      <div className=" gird mt-4">
        <form onSubmit={uploadProduct} className="px-0">
          <div className="grid">
            <label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={data.name}
              name="name"
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
              placeholder="Enter product name"
              autoFocus
              onChange={handleChange}
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
              name="description"
              value={data.description}
              onChange={handleChange}
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
              <option value={""}>Select Sub Category </option>

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
              type="text"
              id="unit"
              value={data.unit}
              name="unit"
              onChange={handleChange}
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
              placeholder="Enter numbers of unit"
            />
          </div>
          <div className="grid mt-4">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              id="stock"
              value={data.stock}
              name="stock"
              onChange={handleChange}
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
              placeholder="Enter numbers of stock"
            />
          </div>
          <div className="grid mt-4">
            <label htmlFor="price">Price: (Rs)</label>
            <input
              type="number"
              id="price"
              value={data.price}
              name="price"
              onChange={handleChange}
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
              placeholder="Enter price of product"
            />
          </div>
          <div className="grid mt-4">
            <label htmlFor="discount">Discount:</label>
            <input
              type="number"
              id="discount"
              value={data.discount}
              name="discount"
              onChange={handleChange}
              className="rounded-md outline-none p-2 border focus:border-lime-500 bg-gray-50 "
              placeholder="Enter discount amount"
            />
          </div>
          <div>
            {Object.keys(data.more_details).map((key, index) => (
              <div className="grid mt-4" key={index}>
                {/* Label */}
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </label>

                {/* Input */}
                <input
                  type="text"
                  id={key}
                  name={key} // Match `name` to key for proper updates
                  value={data.more_details[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key}`}
                  className="rounded-md outline-none p-2 border border-gray-300 focus:border-lime-500 bg-gray-50 focus:ring-2 focus:ring-lime-500"
                />
              </div>
            ))}
          </div>

          <div>
            <button
              onClick={toogleAddField}
              type="button"
              className="hover:bg-lime-600 hover:text-white px-4 py-1 rounded-md mt-4  border border-lime-600"
            >
              Add Field
            </button>
          </div>

          <button className="bg-lime-600 w-full p-2 rounded-md font-semibold text-white tracking-wider mt-4 hover:bg-opacity-90 transition-all duration-500 ease-in-out">
            {loading ? (
              "Uploading product..."
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaUpload size={16} /> Upload Product{" "}
              </div>
            )}
          </button>
        </form>
      </div>

      {isAddFieldOpen && (
        <AddMoreProductFields
          isVisible={isAddFieldOpen}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddFieldSubmit}
          close={() => setIsAddFieldOpen(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
