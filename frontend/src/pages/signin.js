import React, { useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  // ============= Initial State Start here =============
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [erremail, setErremail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  // ============= Event Handler Start here =============
  const handleemail = (e) => {
    setEmail(e.target.value);
    setErremail("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  // ============= Event Handler End here ===============
  const handleSingIn = async (e) => {
    e.preventDefault();

    if (!email) {
      setErremail("Enter your email");
    }

    if (!password) {
      setErrPassword("Create a password");
    }
    // ============== Getting the value ==============
    if (email && password) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/auth/login",
          {
            email,
            password,
          }
        );
        if (
          response.status === 404 ||
          response.status === 400 ||
          response.status === 500
        ) {
          const responseData = await response.data;
          alert(JSON.stringify(responseData));
        } else if (response.status === 200) {
          let responseData;
          try {
            responseData = await response.data;
          } catch (error) {
            console.error("Error parsing JSON response:", error);
            // Handle the non-JSON response here
            return;
          }

          // Proceed with parsing JSON response data and further processing
          const { accessToken, user } = responseData;
          console.log(accessToken, user);
          setSuccessMsg(
            `Hello dear, Thank you for your attempt. We are processing to validate your access. Till then stay connected and additional assistance will be sent to you by your mail at ${email}`
          );
        }
      } catch (error) {
        console.log(error);
      }

      setSuccessMsg("");

      setEmail("");
      setPassword("");
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full lgl:w-1/2 h-full flex items-center justify-center">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/signup">
              <button
                className="w-full h-10 bg-primeColor text-gray-200 rounded-md text-base font-titleFont font-semibold 
            tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                Sign in
              </h1>
              <div className="flex flex-col gap-3">
                {/* email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Email
                  </p>
                  <input
                    onChange={handleemail}
                    value={email}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="Enter your Email"
                  />
                  {erremail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {erremail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Enter your password"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSingIn}
                  className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                >
                  Sign In
                </button>
                <p className="text-sm text-center font-titleFont font-medium">
                  Don't have an Account?{" "}
                  <Link to="/signup">
                    <span className="hover:text-blue-600 duration-300">
                      Sign up
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
