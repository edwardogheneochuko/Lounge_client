import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/authSchemas";
import SubmitBtn from "../components/SubmitBtn";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMediaQuery } from "../utils/useMediaQuery";

const ForgotPassword = () => {
  const isMdUp = useMediaQuery("(min-width: 768px)");

  const borderStyles = `border-2 border-neutral-500 p-3 rounded-md bg-neutral-800 text-gray-200 
    placeholder:text-sm placeholder:md:text-base placeholder:tracking-wider placeholder:text-white
    focus:outline-none focus:ring-2 focus:ring-pink-500
    transition-all duration-300 hover:border-pink-400 hover:ring-pink-500`;

  const textStyle = `
    bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
    bg-clip-text text-transparent
    font-bold
    hover:drop-shadow-[0_0_16px_rgba(168,85,247,0.9)]
    transition-all duration-300
    hover:scale-105
  `;

  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      setServerMessage(res.data.message || "Password reset link sent!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      setServerMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 px-4">

      {/* Title */}
      <h2 className={`text-6xl font-extrabold tracking-wide my-6 text-center drop-shadow-lg ${textStyle}`}>
        Forgot Password
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md grid gap-5 bg-neutral-800 p-8 rounded-2xl 
          shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)]
          transition-shadow duration-500"
      >
        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="font-semibold text-gray-200 mb-1">
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="your-email@gmail.com"
            className={borderStyles}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Server messages */}
        {serverMessage && (
          <p
            className={`text-center font-medium ${
              serverMessage.toLowerCase().includes("sent")
                ? "text-green-600"
                : "text-red-600"
            } animate-shake`}
          >
            {serverMessage}
          </p>
        )}

        {/* Submit */}
        <SubmitBtn title="Send Reset Link" loading={loading} />
      </form>

      {/* Links */}
      <Link
        to="/login"
        className={`mt-6 text-sm font-semibold ${isMdUp ? textStyle : "text-pink-500"} hover:underline`}
      >
        Back to Login
      </Link>

    </div>
  );
};

export default ForgotPassword;
