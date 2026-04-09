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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 px-4">

    {/* background glow */}
    <div className="absolute w-[500px] h-[500px] bg-pink-500/20 blur-[120px] rounded-full top-10 left-10" />
    <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full bottom-10 right-10" />

    {/* card */}
    <div className="relative w-full max-w-md">

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Sign in to continue to your dashboard
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

          {/* password */}
          <div className="relative">
            <label className="text-gray-300 text-sm">Password</label>

            <input
              type={visible ? "text" : "password"}
              placeholder="••••••••"
              className="
                w-full mt-1 px-4 py-3 rounded-xl
                bg-white/5 border border-white/10
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-pink-500
                transition
              "
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-3 top-10 text-gray-400 hover:text-white transition"
            >
              {visible ? "🙈" : "👁️"}
            </button>

            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* server error */}
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl text-center">
              {serverError}
            </div>
          )}

          <div className="pt-2">
            <SubmitBtn title="Login" loading={loading} />
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400 space-y-3">

          <div className="flex justify-center gap-2">
            <span>Don’t have an account?</span>
            <Link className="text-pink-400 hover:text-pink-300 font-medium" to="/register">
              Register
            </Link>
          </div>

          <Link
            to="/forgot-password"
            className="text-gray-400 hover:text-white text-xs transition"
          >
            Forgot Password?
          </Link>

        </div>

      </div>
    </div>
  </div>
);
};

export default Login;
