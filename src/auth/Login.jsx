import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchemas"; // your Zod schema
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import SubmitBtn from "../components/SubmitBtn";

const Login = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState("");

  const borderStyles = "border border-neutral-500 py-3 rounded-md px-3";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      // Call Zustand login
      await loginUser(data.email, data.password);

      // Get logged-in user from Zustand
      const { user } = useAuthStore.getState();

      // Redirect based on role
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    } catch (err) {
      setServerError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col bg-gray-300">
      <h2 className="text-3xl font-bold mb-5 tracking-wider">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid space-y-3 w-80">
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

        {/* Server error */}
        {serverError && <p className="text-red-600">{serverError}</p>}

        {/* Submit button */}
        <SubmitBtn title="Login" loading={loading} />
      </form>

      {/* Links */}
      <div className="mt-3 text-gray-600">
        Don&apos;t have an account?
        <Link to="/register" className="ml-2 hover:underline">
          Register
        </Link>
      </div>

      <Link
        to="/forgot-password"
        className="mt-1 text-neutral-900 hover:underline"
      >
        Forgot Password?
      </Link>
    </div>
  );
};

export default Login;
