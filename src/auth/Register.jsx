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

  const borderStyles = "border border-neutral-500 py-3 rounded-md px-3";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      // call Zustand register (sends Axios request)
      await registerUser(data.username, data.email, data.password);

      // navigate to homepage (or dashboard)
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col bg-gray-300">
      <h2 className="text-3xl font-bold mb-5 tracking-wider">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid space-y-3 w-80">
        {/* Username */}
        <label htmlFor="username" className="font-semibold text-xl">
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
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}

        {/* Email */}
        <label htmlFor="email" className="font-semibold text-xl">Email</label>
        <input
          id="email"
          type="text"
          placeholder="Email"
          className={borderStyles}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* Password */}
        <label htmlFor="password" className="font-semibold text-xl">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
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
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}

        {/* Server error */}
        {serverError && <p className="text-red-600">{serverError}</p>}

        {/* Submit button */}
        <SubmitBtn title="Register" loading={loading} />
      </form>

      <div className="mt-3 text-gray-600">
        Already have an account?
        <Link to="/login" className="ml-2 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
