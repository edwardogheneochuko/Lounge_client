import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/authSchemas";
import SubmitBtn from "../components/SubmitBtn";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";


const ForgotPassword = () => {
   const borderStyles = `border-2 border-neutral-500 p-3 rounded-md bg-neutral-800 text-gray-200 
  placeholder:text-sm placeholder:md:text-base placeholder:tracking-wider placeholder:text-white
   focus:outline-none focus:ring-2 focus:ring-pink-500`

  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
      data, 
        {
          headers: { "Content-Type": "application/json" },
        }
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 px-4">
      <Header />
      <h2 className="text-4xl font-bold tracking-wide text-gray-200 my-6">
        Forgot Password
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm grid gap-4 bg-neutral-800 p-6 rounded-xl shadow-lg"
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
            }`}
          >
            {serverMessage}
          </p>
        )}

        <SubmitBtn title="Send Reset Link" loading={loading} />
      </form>

      {/* Links */}

        <Link
          to="/login"
          className="text-pink-50 font-semibold hover:underline mt-5">
          Back to Login
        </Link>

    </div>
  );
};

export default ForgotPassword;
