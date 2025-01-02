import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { updateAvatar } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const UpdateProfilePicModel = ({ close = () => {} }) => {
  const userData = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  // Function to upload or update the image
  const uploadImage = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      setLoading(true);

      const token = localStorage.getItem("authToken"); // Replace with your actual token logic
      const result = await axios.put(
        "/proxy/api/user/upload-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (result?.data?.success) {
        toast.success(
          result.data.msg || "Profile picture updated successfully."
        );
        console.log("Avatar URL:", result.data.data.avatar);
        dispatch(updateAvatar(result.data.data.avatar));
      } else {
        toast.error("Failed to upload the image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error?.response?.data?.msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white mx-auto max-w-md p-6 rounded-md shadow-md animate-custom w-full flex flex-col items-center justify-center gap-4">
        <div className="bg-gray-50 w-24 h-24 border ring-2 ring-lime-500 shadow-md rounded-full overflow-hidden flex items-center justify-center mt-4">
          <img
            src={userData?.avatar || "default-avatar-path.jpg"}
            alt={userData?.name || "User Avatar"}
            className="w-full h-full"
          />
        </div>

        <div className="mt-0">
          <form onSubmit={uploadImage} className="flex gap-2 items-center">
            <label htmlFor="uploadFile" className="cursor-pointer">
              <div className="px-4 py-1.5 rounded-md  bg-lime-600 text-white w-fit transition-all hover:bg-lime-700 hover:scale-105 duration-700 ease-in-out select-none">
                {file ? "Change File" : "Choose File"}
              </div>
            </label>
            <input
              type="file"
              id="uploadFile"
              name="avatar"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-blue-600 text-white w-fit transition-all hover:bg-blue-700 hover:scale-105 duration-700 ease-in-out"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        <div
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={close}
        >
          <IoMdClose size={28} />
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePicModel;
