import React, { useEffect, useState } from "react";
import AddSubCategoryModel from "../components/AddSubCategoryModel";
import { useSelector } from "react-redux";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditCategoryModel from "../components/EditCategoryModel";
import EditSubCategoryModel from "../components/EditSubCategoryModel";
import ConfirmBox from "../components/ConfirmBox";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSubCategory } from "../redux/productSlice";

const SubCategory = () => {
  //function to get all the category data,
  const allSubCategoryData = useSelector(
    (state) => state?.subcategory?.subCategory
  );
  const dispatch = useDispatch();

  const [editSubCategoryData, setEditSubCategoryData] = useState({
    id: "",
    name: "",
    image: "",
    category: [],
  });
  const [deleteId, setDeleteId] = useState("");

  // console.log("state ko data ", editSubCategoryData);

  const [isAddSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [isEditSubCategoryModelOpen, setIsEditSubCategoryModelOpen] =
    useState(false);
  const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false);
  const toggleSubCategoryModel = () => {
    setIsSubCategoryOpen(!isAddSubCategoryOpen);
  };

  const toggleDeleteSubCategoryModel = () => {
    setIsDeleteBoxOpen(!isDeleteBoxOpen);
  };

  const toggleEditSubCategoryModel = (id, name, image, category) => {
    setIsEditSubCategoryModelOpen(!isEditSubCategoryModelOpen);
    setEditSubCategoryData((prev) => {
      return {
        ...prev,
        id,
        name,
        image,
        category,
      };
    });
  };

  // console.log("subcategory data", allSubCategoryData);

  //function to delelte the subcategory
  const handleSubCategoryDelete = async () => {
    try {
      const config = {
        headers: "content-type: application/json",
      };

      const result = await axios.delete(
        "/proxy/api/subcategory/delete-subcategory",
        { data: { id: deleteId } },
        config
      );

      if (result && result.data.success) {
        toast.success(result.data.msg);
        const updatedSubCategories = allSubCategoryData.filter(
          (cat) => cat._id !== deleteId
        );
        dispatch(setSubCategory(updatedSubCategories));
        toggleDeleteSubCategoryModel();
      } else {
        toast.error(result.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    setEditSubCategoryData();
  }, [allSubCategoryData]);

  return (
    <section>
      <div className="w-full shadow-md px-4 py-2 rounded-md bg-white flex items-center justify-between ">
        <p className="text-2xl font-semibold">Sub Category </p>
        <button
          onClick={toggleSubCategoryModel}
          className="border border-lime-500 hover:bg-lime-600 hover:text-white px-4 py-2 rounded-md transition-all duration-400 ease-in-out "
        >
          Add Sub Category
        </button>

        {isAddSubCategoryOpen && (
          <AddSubCategoryModel close={toggleSubCategoryModel} />
        )}
      </div>

      <table className="table-fixed w-full border-collapse border border-gray-200 shadow-sm mt-4">
        <thead className="bg-black text-white text-sm uppercase font-medium">
          <tr>
            <th className="px-4 py-2 border border-gray-200 text-left">Name</th>

            <th className="px-4 py-2 border border-gray-200 text-left">
              Created At
            </th>
            <th className="px-4 py-2 border border-gray-200 text-left">
              Updated At
            </th>
            <th className="px-4 py-2 border border-gray-200 text-left">
              Image
            </th>
            <th className="px-4 py-2 border border-gray-200 text-left">
              Category
            </th>
            <th className="px-4 py-2 border border-gray-200 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
          {allSubCategoryData.map((subcat, index) => (
            <tr
              key={index}
              className="px-4 py-2 border border-gray-200 bg-white even:bg-gray-50"
            >
              <td className="px-4 py-2 border border-gray-200 text-left">
                {subcat.name}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-left">
                {new Date(subcat.createdAt).toISOString().split("T")[0]}
              </td>
              <td className="px-4 py-2 border border-gray-200 text-left">
                {new Date(subcat.updatedAt).toISOString().split("T")[0]}
              </td>
              <td className="w-28 h-28 px-4 py-2 border border-gray-200 text-center">
                <div className="w-full h-full">
                  <img
                    src={subcat.image}
                    alt={subcat.name}
                    className="w-full h-full object-scale-down rounded-md"
                  />
                </div>
              </td>

              <td className="flex flex-wrap px-4 py-2 ">
                {subcat.category.map((cat) => cat.name).join(", ")}
              </td>
              <td className="border px-4 py-2">
                <div className=" mt-2 flex transition-transform duration-500 ease-in-out divide-x-2">
                  <button
                    onClick={() => {
                      toggleEditSubCategoryModel(
                        subcat._id,
                        subcat.name,
                        subcat.image,
                        subcat.category
                      );
                    }}
                    className="flex-1 text-lime-500 rounded-md hover:bg-lime-500 hover:text-white transition-all duration-500 ease-in-out flex items-center justify-center"
                  >
                    <LiaEditSolid size={26} />
                  </button>
                  <button
                    onClick={() => {
                      toggleDeleteSubCategoryModel();
                      setDeleteId(subcat._id);
                    }}
                    className="flex-1  text-red-500  rounded-md hover:bg-red-500  hover:text-white transition-all duration-500 ease-in-out flex items-center justify-center"
                  >
                    <RiDeleteBin6Line size={24} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Add more rows as needed */}
        </tbody>
      </table>

      {isEditSubCategoryModelOpen && (
        <EditSubCategoryModel
          close={toggleEditSubCategoryModel}
          editSubCategoryData={editSubCategoryData}
          setEditSubCategoryData={setEditSubCategoryData}
        />
      )}

      {isDeleteBoxOpen && (
        <ConfirmBox
          close={toggleDeleteSubCategoryModel}
          cancel={toggleDeleteSubCategoryModel}
          confirm={handleSubCategoryDelete}
          categoryName=""
          catType="Sub"
        />
      )}
    </section>
  );
};

export default SubCategory;
