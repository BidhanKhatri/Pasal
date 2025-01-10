import axios from "axios";
import React, { useEffect, useState } from "react";

const ProductPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  //   console.log("state ko data ", data);

  //function to get all products

  const getAllProducts = async () => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const result = await axios.post("/proxy/api/product/get-product", config);
      if (result && result.data.success) {
        if (Array.isArray(result.data.data)) {
          setData(result.data.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <section className=" min-h-screen ">
      <p className="p-4 rounded-md bg-white shadow-md w-full text-2xl  font-semibold">
        Product page
      </p>

      <div className="grid grid-cols-4 2xl:grid-cols-6 gap-6 mt-4">
        {data.map((items, index) => {
          return (
            <div
              key={items._id}
              className="  bg-lime-50 rounded-md shadow-md overflow-hidden p-4"
            >
              <div className="w-52 h-56 2xl:w-full 2xl:h-72 overflow-hidden">
                <img
                  src={items.image[0].url}
                  className="w-full h-full object-scale-down  bg-gray-50 rounded-md"
                />
              </div>
              <p className="mt-2 font-semibold text-neutral-600 text-xl">
                {" "}
                {items.name}
              </p>
              <p className=" text-neutral-600">{items.unit} Unit</p>
              <p className="text-neutral-600">Stock {items.stock}</p>
              {/* <p className="text-neutral-600">Price Rs.{items.price}</p>
              <p className="text-neutral-600">Discount Rs.{items.discount}</p> */}
              {/* <p className="text-neutral-600">
                Description: {items.description}
              </p> */}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductPage;
