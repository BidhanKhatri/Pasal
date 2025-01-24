import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SkeletonCategory from "./SkeletonCategory";
import CategoryCard from "./CategoryCard";

const CategoryWiseProduct = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //get prduct by category

  async function fetchProductByCategory() {
    try {
      const config = {
        headers: { "content-type": "application/json" },
      };
      const body = { id: id };

      setIsLoading(true);

      const res = await axios.post(
        `/proxy/api/product/get-product-by-category`,
        body,
        config
      );
      if (res && res.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProductByCategory();
  }, []);

  const generateMultipleSkeleton = new Array(6).fill(null);

  return (
    <div>
      {data.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold tracking-wider">{name}</p>
          <Link to={""} className="text-lime-600 font-semibold">
            See All
          </Link>
        </div>
      )}

      <div className="flex gap-4 items-center">
        {isLoading ? (
          generateMultipleSkeleton.map((_, index) => {
            return (
              <div key={index}>
                <SkeletonCategory />
              </div>
            );
          })
        ) : (
          <CategoryCard data={data} />
        )}
      </div>
    </div>
  );
};

export default CategoryWiseProduct;
