import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../schemas/authSchemas";
import SubmitBtn from "../components/SubmitBtn";
import Header from "../components/Header";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState("");

  const borderStyles = "border border-neutral-500 p-3 rounded-md bg-neutral-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerMessage("");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        data,{
          headers: { "Content-Type": "application/json" },
        }
      );

      setServerMessage(res.data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
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
        Reset Password
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm grid gap-4 bg-neutral-800 p-6 rounded-xl shadow-lg"
      >
        {/* New Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="font-semibold text-gray-200 mb-1">
            New Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="New Password"
            className={borderStyles}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="font-semibold text-gray-200 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className={borderStyles}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Server messages */}
        {serverMessage && (
          <p
            className={`text-center font-medium ${
              serverMessage.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {serverMessage}
          </p>
        )}

        {/* Submit button */}
        <SubmitBtn title="Reset Password" loading={loading} />
      </form>

      {/* Back to login */}
      <Link
        to="/login"
        className="mt-4 text-pink-500 font-semibold hover:underline text-lg"
        >
        Back to Login
      </Link>
    </div>
  );
};

export default ResetPassword;
