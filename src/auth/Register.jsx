import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/authSchemas";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import SubmitBtn from "../components/SubmitBtn";

const Register = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);

  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");

  const borderStyles =
    "border border-neutral-500 p-3 rounded-md bg-neutral-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      await registerUser(data.username, data.email, data.password);
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 px-4">
      <h2 className="text-4xl font-bold tracking-wide text-gray-200 mb-6">
        Register
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm grid gap-4 bg-neutral-800 p-6 rounded-xl shadow-lg"
      >
        {/* Username */}
        <div className="flex flex-col">
          <label htmlFor="username" className="font-semibold text-gray-200 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className={borderStyles}
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="font-semibold text-gray-200 mb-1">
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            className={borderStyles}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="font-semibold text-gray-200 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
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

        {/* Server error */}
        {serverError && (
          <p className="text-red-600 text-center font-medium">{serverError}</p>
        )}

        {/* Submit button */}
        <SubmitBtn title="Register" loading={loading} />
      </form>

      {/* Links */}
      <div className="mt-4 text-gray-400 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-pink-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
