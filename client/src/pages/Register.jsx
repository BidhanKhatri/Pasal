import React, { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const navigate = useNavigate();

  function togglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  function toggleConfirmPasswordVisibility() {
    setIsConfirmPasswordVisible((prev) => !prev);
  }

  //   console.log(data);

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
      if (data.password !== data.confirmPassword) {
        return toast.error("Password and confirm password does not match");
      }

      const config = {
        headers: { "content-type": "application/json" },
      };

      const sendingData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const result = await axios.post(
        "/proxy/api/user/register",
        sendingData,
        config
      );

      if (result && result.data.success === true) {
        toast.success(result.data.msg);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white py-4 my-4 w-full max-w-md mx-auto rounded-md p-4 shadow-md">
        <p className="text-3xl  text-center">Register to Pasal</p>

        <form className="grid gap-2 mt-6" onSubmit={handleSubmit}>
          <div className="grid">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              autoFocus
              className=" p-2 rounded-md border outline-none focus:border-lime-500"
              value={data.name}
              onChange={handleChange}
              id="name"
              placeholder="Enter your name"
            />
          </div>
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
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">Confirm Password:</label>
            <div className="p-2 rounded-md border  focus:border-lime-500 flex item-center">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                id="confirmPassword"
                className="w-full gap-2 outline-none bg-transparent"
                placeholder="Enter confirm password"
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                className="cursor-pointer flex items-center"
              >
                {isConfirmPasswordVisible ? <FaEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            <button
              disabled={!isAllFieldsAvailable}
              className={`${
                isAllFieldsAvailable
                  ? "bg-lime-600 hover:bg-lime-700 tranisition-all duration-700"
                  : "bg-gray-500"
              } text-white w-full  py-2 rounded-md font-semibold tracking-wider mt-6 `}
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-lime-800 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
