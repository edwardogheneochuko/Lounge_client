import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/authSchemas";
import SubmitBtn from "../components/SubmitBtn";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const borderStyles =
    "border border-neutral-500 p-3 rounded-md bg-neutral-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500";
  const [loading, setLoading] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerMessage("");

      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setServerMessage(result.message || "Password reset link sent!");
    } catch (err) {
      setServerMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 px-4">
      <h2 className="text-4xl font-bold tracking-wide text-gray-200 mb-6">
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
            placeholder="Enter your email"
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
      <div className="mt-4 flex flex-col items-center gap-2 text-sm text-gray-400">
        <Link
          to="/login"
          className="text-pink-500 font-semibold hover:underline text-lg"
        >
          Back to Login
        </Link>

        <Link
          to="/reset-password"
          className="text-pink-500 font-semibold hover:underline text-lg"
        >
          Reset Page
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
