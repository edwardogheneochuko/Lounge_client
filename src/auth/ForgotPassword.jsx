import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/authSchemas";
import SubmitBtn from "../components/SubmitBtn";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const borderStyles = "border border-neutral-500 py-3 rounded-md px-3 w-full";
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
    <div className="flex items-center justify-center h-screen flex-col bg-gray-300">
      <h2 className="text-3xl font-bold mb-5 tracking-wider">
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid space-y-3 w-80">
        {/* Email */}
        <label htmlFor="email" className="font-semibold text-xl">
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
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* Server messages */}
        {serverMessage && (
          <p className="text-center text-blue-600">{serverMessage}</p>
        )}

        <SubmitBtn title="Send Reset Link" loading={loading} />
      </form>

      {/* Links */}
      <div className="mt-3 flex flex-col items-center gap-1">
        <Link
          to="/reset-password"
          className="text-neutral-800 text-lg font-semibold hover:underline"
        >
          Reset Page
        </Link>

        <p className="text-neutral-700">
          Go back to
          <Link
            to="/login"
            className="hover:underline text-neutral-800 font-semibold ml-1 text-lg"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
