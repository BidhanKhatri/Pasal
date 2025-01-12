import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

const ProductPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotaPages] = useState(0);
  const [search, setSearch] = useState("");
  //   console.log(data);
  console.log(search);

  // Function to fetch products
  const getAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const payload = {
        page: page,
        search: search,
      };
      const result = await axios.post(
        `/proxy/api/product/get-product`,
        payload,
        config
      );
      if (result && result.data.success) {
        setTotaPages(result.data.totalNumberOfPages);
        if (Array.isArray(result.data.data)) {
          setData(result.data.data);
        }
      }
    } catch (error) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  //function to handle the search change
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    getAllProducts();
  }, [page]);

  useEffect(() => {
    getAllProducts();
  }, [search]);

  return (
    <section className="min-h-screen ">
      <div className=" bg-white shadow-md rounded-md px-4 py-2 mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 ">Product Page</h1>{" "}
        <div className=" flex items-center gap-2 rounded-md group">
          <div className="flex items-center gap-2 border p-2 rounded-md focus-within:border-lime-500">
            <IoIosSearch
              size={28}
              className="group-focus-within:text-lime-500"
            />
            <input
              type="search"
              className=" px-2 rounded-md w-full focus:border-lime-500 outline-none"
              placeholder="Search Product..."
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-center bg-red-100 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="loader border-t-4 animate-spin border-lime-500 rounded-full h-12 w-12 mx-auto my-2"></div>
      )}

      {data.length === 0 && (
        <div className="text-center bg-red-100 text-red-600 p-4 rounded-md mb-6">
          No Product Found
        </div>
      )}

      <div className="min-h-[60vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-6 ">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-md shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 "
            >
              <div className="w-full h-28 bg-gray-200 flex items-center justify-center overflow-hidden p-4">
                <img
                  src={item.image[0]?.url || "placeholder-image.png"}
                  alt={item.name}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-gray-800 truncate">
                  {item.name}
                </h2>
                <div className="flex items-center gap-2 0 flex-wrap mt-2">
                  {" "}
                  <p className="text-xs text-gray-600 bg-gray-100 px-2 rounded-md">
                    {item.unit} Unit
                  </p>
                  <p className="text-xs  bg-lime-600 px-2 rounded-md text-white ">
                    Stock: {item.stock}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6 items-center">
        <button
          className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        {loading ? (
          <div className="text-center mx-4">
            <div className="loader border-t-4 border-lime-500 w-10 h-10 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <span className="mx-4 text-gray-600">
            Page {page} / {totalPages}
          </span>
        )}

        <button
          className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 disabled:opacity-50"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductPage;
