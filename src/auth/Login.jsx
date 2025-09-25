import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchemas"; 
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import SubmitBtn from "../components/SubmitBtn";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [visible, setVisible] = useState(false)

  const borderStyles = `border-2 border-neutral-500 p-3 rounded-md bg-neutral-800 text-gray-200 
  placeholder:text-sm placeholder:md:text-base placeholder:tracking-wider placeholder:text-white
   focus:outline-none focus:ring-2 focus:ring-pink-500`

  const {
    register, handleSubmit, formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");
      await loginUser(data.email, data.password);

      const { user } = useAuthStore.getState();
      if (user?.role === "admin") navigate("/admin");
      else navigate("/shop");
      
    } catch (err) {
      setServerError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen
     bg-neutral-900 px-4">
      <Header />

      <h2 className="text-4xl font-bold tracking-wide text-gray-200 my-5">
        Login
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

        {/* Password */}
       {/* Password */}
<div className="flex flex-col relative">
  <label htmlFor="password" className="font-semibold text-gray-200 mb-1">
    Password
  </label>
  <input
    id="password"
    type={visible ? "text" : "password"}
    placeholder="Password"
    className={borderStyles}
    {...register("password")}
  />
  <button
    type="button"
    onClick={() => setVisible(!visible)}
    className="absolute right-3 top-9 text-xl cursor-pointer"
  >
    {visible ? "🙈" : "👁️"}
  </button>
  {errors.password && (
    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
  )}
</div>


        {/* Server error */}
        {serverError && (
          <p className="text-red-600 text-center font-medium">{serverError}</p>
        )}

        {/* Submit button */}
        <SubmitBtn title="Login" loading={loading} />
      </form>

      {/* Links */}
      <div className="mt-4 text-gray-400 text-sm">
        Don&apos;t have an account ?{" "}
        <Link to="/register" className="text-pink-500 hover:underline">
          Register
        </Link>
      </div>

      <Link
        to="/forgot-password"
        className="mt-1 text-pink-500 text-sm hover:underline"
      >
        Forgot Password?
      </Link>
    </div>
  );
};

export default Login;
