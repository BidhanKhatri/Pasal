import React from "react";

import DesktopBanner from "../assets/images/banner.jpg";
import { useSelector } from "react-redux";
import { validUrlConvert } from "../utils/validUrlConvert";
import { Link, useNavigate } from "react-router-dom";
import CategoryWiseProduct from "../components/CategoryWiseProduct";

function Home() {
  const categoryData = useSelector((state) => state?.product.allCategory);
  const subCategoryData = useSelector(
    (state) => state?.subcategory.subCategory
  );
  const navigate = useNavigate();
  // console.log("category data", categoryData);
  // console.log("subCategory data", subCategoryData);

  const handleRedirectProductPage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) => {
      const filteredData = sub.category.some((el) => el._id === id);
      return filteredData ? true : null;
    });
    const url = `/${validUrlConvert(cat)}-${id}/${validUrlConvert(
      subcategory.name
    )}-${subcategory._id}`;
    // console.log(url);
    navigate(url);
  };
  return (
    <section className="container mx-auto  px-4">
      <div className=" ">
        <img src={DesktopBanner} alt="banner-img" className="w-full" />
      </div>

      {/* Display all category */}
      <div className="grid grid-cols-2 md:gird-cols-4 lg:grid-cols-6 gap-2">
        {categoryData.map((cat, index) => {
          return (
            <div
              key={cat._id}
              className=" p-2 max-h-44"
              onClick={() => handleRedirectProductPage(cat._id, cat.name)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="rounded-md shadow-md w-full h-full object-scale-down"
              />
            </div>
          );
        })}
      </div>

      {/* Display Product by category for ata, rice and dal */}
      <div className="container mx-auto my-6 p-4 w-full flex flex-col gap-6">
        <div className="">
          {categoryData.map((cat, index) => {
            return <CategoryWiseProduct id={cat._id} name={cat.name} />;
          })}
        </div>
      </div>
    </section>
  );
}

export default Home;
