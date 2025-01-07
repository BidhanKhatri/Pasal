import React, { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice";
import fetchUserData from "../utils/fetchUserData";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  function togglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //find if all value are available or not for enabling the register button

  const isAllFieldsAvailable = Object.values(data).every((el) => el);

  //function for handling the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!data.email || !data.password) {
        return toast.error("All fields are required");
      }

      const config = {
        headers: { "content-type": "application/json" },
      };

      const sendingData = {
        email: data.email,
        password: data.password,
      };

      const result = await axios.post(
        "/proxy/api/user/login",
        sendingData,
        config
      );

      if (result && result.data.success === true) {
        toast.success(result.data.msg);
        localStorage.setItem("authToken", result.data.data.accesstoken);
        navigate("/");
        const userData = await fetchUserData();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white py-4 my-4 w-full max-w-md mx-auto rounded-md p-4 shadow-md">
        <p className="text-3xl  text-center">Login to Pasal</p>

        <form className="grid gap-2 mt-6" onSubmit={handleSubmit}>
          <div className="grid">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              className="p-2 rounded-md border outline-none focus:border-lime-500"
              value={data.email}
              onChange={handleChange}
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">Password:</label>
            <div className="p-2 rounded-md border  focus:border-lime-500 flex item-center">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                id="password"
                className="w-full gap-2 outline-none bg-transparent"
                placeholder="Enter your password"
              />
              <span
                onClick={togglePasswordVisibility}
                className="cursor-pointer flex items-center"
              >
                {isPasswordVisible ? <FaEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            <Link
              to="/forgot-password"
              className=" inline-block text-right py-0.5 hover:text-lime-700 transition-all duration-400 ease-in-out hover:underline"
            >
              Forgot passsword
            </Link>
          </div>
          <button
            disabled={!isAllFieldsAvailable}
            className={`${
              isAllFieldsAvailable
                ? "bg-lime-600 hover:bg-lime-700 tranisition-all duration-700"
                : "bg-gray-500"
            } text-white w-full  py-2 rounded-md font-semibold tracking-wider mt-4 `}
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/register"
            className="text-lime-800 font-semibold hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
