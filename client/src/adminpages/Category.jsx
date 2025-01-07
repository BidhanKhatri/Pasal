import React, { useEffect, useState } from "react";
import AddCategoryModel from "../components/AddCategoryModel";
import axios from "axios";
import { toast } from "react-toastify";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditCategoryModel from "../components/EditCategoryModel";
import ConfirmBox from "../components/ConfirmBox";
import { useSelector } from "react-redux";

const Category = () => {
  const allCategoryStateData = useSelector(
    (state) => state?.product.allCategory
  );

  // console.log("productData", productData);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [deleteId, setDeleteId] = useState({});
  // console.log("deleted state", deleteId);
  const [isEditCategoryModelOpen, setIsEditCategoryModelOpen] = useState(false);
  const [isDeleteCategoryModelOpen, setIsDeleteCategoryModelOpen] =
    useState(false);

  //manage the state for name, image, and id of the category to be edited or deleted
  const [editCategoryData, setEditCategoryData] = useState({
    id: "",
    name: "",
    image: "",
  });

  // console.log(editCategoryData);

  //function to toggle the category model
  const toggleCategoryModel = () => setIsCategoryOpen(!isCategoryOpen);
  const toggleDeleteCategoryModel = () =>
    setIsDeleteCategoryModelOpen(!isDeleteCategoryModelOpen);

  //function to toggle the edit category model
  const toggleEditCategoryModel = (id, name, image) => {
    setIsEditCategoryModelOpen(!isEditCategoryModelOpen);
    setEditCategoryData((prev) => {
      return { ...prev, id, name, image };
    });
  };

  //function to delete the category
  const handleDeleteCategory = async (e) => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const result = await axios.delete(
        `/proxy/api/category/delete-category`,
        { data: { id: deleteId._id } },
        config
      );
      if (result && result.data.success) {
        toast.success(result.data.msg);
        getAllCategory();
        toggleDeleteCategoryModel();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  //function to fetch all category
  const getAllCategory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const result = await axios.get(
        "/proxy/api/category/get-all-category",
        config
      );
      if (result && result.data.success) {
        setAllCategoryData(result.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAllCategoryData(allCategoryStateData);
  }, [allCategoryStateData]);

  return (
    <section>
      <div className="w-full shadow-md px-4 py-2 rounded-md bg-white flex items-center justify-between ">
        <p className="text-2xl font-semibold">Category </p>
        <button
          onClick={toggleCategoryModel}
          className="border border-lime-500 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-md transition-all duration-400 ease-in "
        >
          Add Category
        </button>

        {isCategoryOpen && (
          <AddCategoryModel
            close={toggleCategoryModel}
            getAllCategory={getAllCategory}
          />
        )}
      </div>

      {loading && <div>Fetching Category....</div>}

      {allCategoryData.length <= 0 && (
        <div className="text-center mt-4"> No Category Available </div>
      )}

      <div className="grid lg:grid-cols-4 2xl:grid-cols-6 gap-4 mt-4 w-full">
        {allCategoryData.length > 0 &&
          allCategoryData.map((category, index) => (
            <div
              key={index}
              className="p-4 rounded-md shadow-md bg-lime-50 group cursor-pointer hover:bg-lime-100 transition-all duration-500 ease-in-out"
            >
              <div className="w-full h-48 2xl:h-64 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              </div>
              <p className="2xl:text-xl text-center mt-2">{category.name}</p>
              <div className=" mt-2 flex transition-transform duration-500 ease-in-out divide-x-2">
                <button
                  onClick={() =>
                    toggleEditCategoryModel(
                      category._id,
                      category.name,
                      category.image
                    )
                  }
                  className="flex-1 text-lime-500 rounded-md hover:bg-lime-500 hover:text-white transition-all duration-500 ease-in-out flex items-center justify-center"
                >
                  <LiaEditSolid size={26} />
                </button>
                <button
                  onClick={() => {
                    setDeleteId(category);
                    toggleDeleteCategoryModel();
                  }}
                  className="flex-1  text-red-500  rounded-md hover:bg-red-500  hover:text-white transition-all duration-500 ease-in-out flex items-center justify-center"
                >
                  <RiDeleteBin6Line size={24} />
                </button>
              </div>
              {isEditCategoryModelOpen && (
                <EditCategoryModel
                  close={toggleEditCategoryModel}
                  editCategoryData={editCategoryData}
                  setEditCategoryData={setEditCategoryData}
                  getAllCategory={getAllCategory}
                />
              )}

              {isDeleteCategoryModelOpen && (
                <ConfirmBox
                  confirm={handleDeleteCategory}
                  cancel={toggleDeleteCategoryModel}
                  close={toggleDeleteCategoryModel}
                  categoryName={deleteId.name}
                />
              )}
            </div>
          ))}
      </div>
    </section>
  );
};

export default Category;
