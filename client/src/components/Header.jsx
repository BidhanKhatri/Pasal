import React, { useState } from "react";
import Search from "./Search";
import { Link, useLocation } from "react-router-dom";
import { FaCartPlus, FaRegUser, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import UserProfileModel from "./UserProfileModel";
import { useNavigate } from "react-router-dom";
import PasalLogo from "../assets/images/pasal-logo.png";

const Header = () => {
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isUserProfileActive, setIsUserProfileActive] = useState(false);
  const navigate = useNavigate();

  const checkSearchpage = location.pathname === "/search";

  //using react redux
  const user = useSelector((state) => state?.user);
  // console.log("user from store", user);

  //function to close the user profile model when logout
  const handleCloseUserProfileModel = () => setIsUserProfileActive(false);

  //function for handling mobile menu
  const handleMobileMenu = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/profile-mob");
  };

  return (
    <header className="w-full sticky top-0  shadow-md lg:flex lg:items-center lg:justify-between px-6 lg:px-10  py-2 bg-white z-30">
      {/* desktop version */}
      <div className="flex items-center justify-between  w-full  ">
        {/* logo section */}
        <Link to="/">
          <div className=" w-32 h-12">
            <img
              src={PasalLogo}
              alt="pasal-logo"
              className="w-full h-full object-cover -ml-5"
            ></img>
          </div>
        </Link>

        {/* search section */}
        <div className="hidden lg:block">
          <Search />
        </div>

        {/* login and cart section */}
        <div className=" ">
          <button
            className="text-neutral-500 lg:hidden"
            onClick={handleMobileMenu}
          >
            <FaRegUser size={24} />
          </button>
          <div className="hidden  lg:flex lg:items-center lg:gap-4">
            {user?._id ? (
              <>
                <div className="relative">
                  <div
                    onClick={() => setIsUserProfileActive((prev) => !prev)}
                    className=" bg-gray-500/80 flex items-center gap-2 px-4 py-1.5 text-white rounded-md cursor-pointer"
                  >
                    <span>
                      <FaUser />
                    </span>{" "}
                    {isUserProfileActive ? (
                      <IoIosArrowUp size={24} />
                    ) : (
                      <IoIosArrowDown size={24} />
                    )}
                  </div>

                  {isUserProfileActive && (
                    <div className="absolute bg-white top-12 -right-20 w-62 p-4 rounded-md lg:shadow-md animate-custom">
                      <UserProfileModel close={handleCloseUserProfileModel} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-lime-500 px-4 py-1.5 text-white rounded-md"
              >
                Login
              </Link>
            )}

            <button className="relative bg-lime-500 px-4 py-1.5 text-white rounded-md flex items-center gap-2 transition-all hover:scale-105 duration-700 ease-in-out hover:bg-lime-600">
              <FaCartPlus size={24} />
              <span className="absolute bg-red-500 w-5 h-5 rounded-full flex items-center justify-center top-0 right-0 -translate-y-1/2 text-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* mobile version */}
      <div className="container mx-auto px-2 mt-2 lg:mt-0 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;
