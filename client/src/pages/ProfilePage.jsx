import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UpdateProfilePicModel from "../components/UpdateProfilePicModel";
import { toast } from "react-toastify";
import axios from "axios";
import fetchUserData from "../utils/fetchUserData";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice";

const ProfilePage = () => {
  const userData = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  //   console.log(userData);

  const [isUploadPicModelOpen, setIsUploadPicModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpenUploadPicModel = () =>
    setIsUploadPicModelOpen((prev) => !prev);

  const handleCloseUploadPicModel = () => setIsUploadPicModelOpen(false);

  //managing the state
  const [data, setData] = useState({
    name: userData.name,
    email: userData.email,
    mobile: userData?.mobile || "",
  });

  //useEffect to set the initial state
  useEffect(() => {
    setData({
      name: userData.name,
      email: userData.email,
      mobile: userData?.mobile || "",
    });
  }, [userData]);

  //function to handle the value change tin the form
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  //function to update the user profile
  const updateUserProfile = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      setLoading(true);
      const result = await axios.put(
        "/proxy/api/user/update-user",
        data,
        config
      );
      if (result && result.data) {
        toast.success(result.data.msg || "Profile Updated");
        const callUserData = await fetchUserData();
        dispatch(setUserDetails(callUserData.data));
      } else {
        toast.error(result.data.msg || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-10 ">
      {/* <p className="text-2xl font-semibold tracking-wider">Profile Page</p> */}

      <div className="">
        <div className="bg-gray-50 w-24 h-24  border ring-2 ring-lime-500 shadow-md rounded-full overflow-hidden flex items-center justify-center mt-4">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="w-full h-full"
          />
        </div>

        <div className="mt-4">
          <label>
            <div
              onClick={handleOpenUploadPicModel}
              className="px-4 py-1.5 rounded-md border border-lime-700 bg-transparent hover:text-white w-fit transition-all hover:bg-lime-700 hover:scale-105 duration-700 ease-in-out cursor-pointer "
            >
              Upload Pic
            </div>
          </label>

          {/* print name, email mobile */}

          <form onSubmit={updateUserProfile} className="grid mt-4 gap-2">
            <div className="grid">
              <label htmlFor="name" className="font-semibold">
                Name:
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={data.name}
                className="mt-2 rounded-md p-2 outline-none focus:border-lime-500 border bg-lime-100/40"
                onChange={handleFormChange}
              />
            </div>
            <div className="grid">
              <label htmlFor="email" className="font-semibold">
                Email:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={data.email}
                onChange={handleFormChange}
                className="mt-2 rounded-md p-2 outline-none focus:border-lime-500 border bg-lime-100/40"
              />
            </div>
            <div className="grid">
              <label htmlFor="mobile" className="font-semibold">
                Mobile Number:
              </label>
              <input
                id="mobile"
                type="text"
                name="mobile"
                value={data?.mobile}
                className="mt-2 rounded-md p-2 outline-none focus:border-lime-500 border bg-lime-100/40"
                onChange={handleFormChange}
              />
            </div>
            <button className="bg-gray-500 text-white border border-lime-600 hover:bg-lime-600  font-bold px-4 py-2 rounded-md mt-4 hover:bg-opacity-90 transition-all duration-400 ease-in-out">
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {isUploadPicModelOpen && (
          <UpdateProfilePicModel close={handleCloseUploadPicModel} />
        )}
      </div>
    </section>
  );
};

export default ProfilePage;
