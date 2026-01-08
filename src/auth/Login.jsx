import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchemas";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import SubmitBtn from "../components/SubmitBtn";
import { useMediaQuery } from "../utils/useMediaQuery";


const Login = () => {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [visible, setVisible] = useState(false);
  const isMdUp = useMediaQuery("(min-width: 768px)"); 


  const borderStyles = `border-2 border-neutral-500 p-3 rounded-md bg-neutral-800 text-gray-200 
    placeholder:text-sm placeholder:md:text-base placeholder:tracking-wider placeholder:text-white
    focus:outline-none focus:ring-2 focus:ring-pink-500
    transition-all duration-300
    hover:border-pink-400 hover:ring-pink-500`;

  const textStyle = `
  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
  bg-clip-text text-transparent
  font-bold
  hover:drop-shadow-[0_0_16px_rgba(168,85,247,0.9)]
  transition-all duration-300
  hover:scale-105
`;


  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <div
      className="flex flex-col items-center justify-center min-h-screen
     bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 px-4">
      <h2 className={`text-8xl font-extrabold tracking-wide 
        my-6 text-center drop-shadow-lg ${textStyle}`}>
        Login
      </h2>
  
       
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg grid gap-5 bg-neutral-800 p-8 rounded-2xl 
          shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)]
          transition-shadow duration-500"
      >
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
            className="absolute right-3 top-9 text-xl cursor-pointer animate-pulse hover:scale-110"
          >
            {visible ? "🙈" : "👁️"}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-red-600 text-center font-medium animate-shake">{serverError}</p>
        )}

        <SubmitBtn title="Login" loading={loading} />
      </form>

      <div className="mt-6 text-gray-400 text-xs flex 
       gap-2 sm:gap-4 justify-center items-center">
        <span>Don&apos;t have an account?</span>
        <Link className={textStyle} to="/register">
          Register
        </Link>
      </div>

      <Link
  to="/forgot-password"
  className={`
    mt-4 inline-block text-gray-50 text-xs font-bold relative
    hover:underline
    ${isMdUp ? textStyle : ""}
    forgot-slash
  `}
>
  Forgot Password?
</Link>

    </div>
  );
};

export default Login;
