import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

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
      if (!data.email) {
        return toast.error("Email is required");
      }

      const config = {
        headers: { "content-type": "application/json" },
      };

      const sendingData = {
        email: data.email,
      };

      const result = await axios.put(
        "/api/user/forgot-password",
        sendingData,
        config
      );

      if (result && result.data.success === true) {
        toast.success(result.data.msg);
        navigate("/otp-verify", {
          state: {
            email: data.email,
          },
        });
        setData({
          email: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white py-4 my-4 w-full max-w-md mx-auto rounded-md p-4 shadow-md">
        <p className="text-3xl  text-center">Forgot Password</p>

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
          <button
            disabled={!isAllFieldsAvailable}
            className={`${
              isAllFieldsAvailable
                ? "bg-lime-600 hover:bg-lime-700 tranisition-all duration-700"
                : "bg-gray-500"
            } text-white w-full  py-2 rounded-md font-semibold tracking-wider mt-4 `}
          >
            Send OTP
          </button>
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

export default ForgotPassword;
