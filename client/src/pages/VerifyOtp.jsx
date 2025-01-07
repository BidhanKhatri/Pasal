import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  //converting array otp to string
  const otp = data.join("");
  console.log(otp);

  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const navigate = useNavigate();

  //find if all value are available or not for enabling the register button

  const isAllFieldsAvailable = data.every((el) => el);

  console.log(data);

  //function for handling the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: { "content-type": "application/json" },
      };

      const sendingData = {
        email: location.state.email,
        otp: otp,
      };

      const result = await axios.put(
        "/proxy/api/user/verify-otp",
        sendingData,
        config
      );

      if (result && result.data.success === true) {
        toast.success(result.data.msg);
        navigate("/reset-password", {
          state: {
            data: result.data,
            email: location.state.email,
          },
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
        <p className="text-3xl  text-center">Enter OTP</p>

        <form className="grid gap-2 mt-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between w-full gap-2">
            {data.map((items, index) => (
              <div key={index} className="w-full  ">
                <input
                  type="text"
                  className="p-2 w-full rounded-md border outline-none focus:border-lime-500 text-center font-semibold"
                  maxLength={1}
                  value={items}
                  onChange={(e) => {
                    setData((prev) => {
                      const newData = [...prev];
                      newData[index] = e.target.value;
                      return newData;
                    });
                  }}
                  placeholder=""
                />
              </div>
            ))}
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

export default VerifyOtp;
