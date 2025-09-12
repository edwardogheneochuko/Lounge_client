import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../schemas/authSchemas";
import SubmitBtn from "../components/SubmitBtn";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [serverMessage, setServerMessage] = React.useState("");
  const borderStyles = "border border-neutral-500 py-3 rounded-md px-3 w-full";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerMessage("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Something went wrong");

      setServerMessage(result.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setServerMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col bg-gray-300">
      <h2 className="text-3xl font-bold mb-5 tracking-wider">Reset Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid space-y-3 w-80">
        {/* New Password */}
        <label htmlFor="password" className="font-semibold text-xl">
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
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" className="font-semibold text-xl">
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
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Server messages */}
        {serverMessage && (
          <p
            className={`text-center ${
              serverMessage.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {serverMessage}
          </p>
        )}

        <SubmitBtn title="Reset Password" loading={loading} />
      </form>

      <Link
        to="/login"
        className="hover:underline text-neutral-800 font-semibold mt-3 text-lg"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default ResetPassword;
