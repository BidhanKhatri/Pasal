import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";

function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();

  const [isSearchPage, setIsSearchPage] = useState(false);

  const redirectToSearchPage = (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
      navigate("/search");
    }
  };

  const navigatePreviousPage = (e) => {
    e.stopPropagation(); // Prevent event propagation to the parent <div>
    navigate(-1);
  };

  useEffect(() => {
    const isSearchLocation = location.pathname === "/search";
    setIsSearchPage(isSearchLocation);
  }, [location]);

  return (
    <div
      className="min-w-[300px]  lg:min-w-[400px] border border-neutral-200 text-neutral-500 rounded-md h-12 flex items-center px-4 gap-4 bg-slate-50 group focus-within:border-lime-500"
      onClick={redirectToSearchPage}
    >
      {isMobile && isSearchPage ? (
        <button
          className="group-focus-within:text-lime-500 bg-white p-1.5 rounded-full shadow-md"
          onClick={navigatePreviousPage}
        >
          <FaArrowLeft size={20} />
        </button>
      ) : (
        <button className="group-focus-within:text-lime-500">
          <FaSearch size={20} />
        </button>
      )}

      {isSearchPage ? (
        <div className="w-full h-full flex items-center">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full outline-none bg-transparent"
            autoFocus
          />
        </div>
      ) : (
        <>
          <div>
            <TypeAnimation
              sequence={[
                'Search "Hoodie"',
                1000,
                'Search "Electronics"',
                1000,
                'Search "Shoes"',
                1000,
                'Search "Pants"',
                1000,
                'Search "Accessories"',
                1000,
                'Search "Jackets"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: "1em", display: "inline-block" }}
              repeat={Infinity}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Search;
