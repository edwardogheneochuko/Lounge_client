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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 px-4">

    {/* background glow */}
    <div className="absolute w-[500px] h-[500px] bg-pink-500/20 blur-[120px] rounded-full top-10 left-10" />
    <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full bottom-10 right-10" />

    {/* card */}
    <div className="relative w-full max-w-md">

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white">
            Reset Password
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Enter your email and we’ll send a reset link
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* email */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="text"
              placeholder="you@example.com"
              className="
                w-full mt-1 px-4 py-3 rounded-xl
                bg-white/5 border border-white/10
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-pink-500
                transition
              "
              {...register("email")}
            />

            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* server message */}
          {serverMessage && (
            <div
              className={`text-sm p-3 rounded-xl text-center border
                ${
                  serverMessage.toLowerCase().includes("sent")
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }
              `}
            >
              {serverMessage}
            </div>
          )}

          {/* submit */}
          <SubmitBtn title="Send Reset Link" loading={loading} />
        </form>

        {/* footer */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-pink-400 hover:text-pink-300 transition font-medium"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  </div>
);
};

export default ForgotPassword;
