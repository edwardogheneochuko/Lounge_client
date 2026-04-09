import React from "react";
import "../App.css";

const SubmitBtn = ({ children, title, loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`
        relative w-full py-3 px-6 rounded-2xl
        font-semibold text-sm tracking-wide
        transition-all duration-300 cursor-pointer
        overflow-hidden

        ${
          loading
            ? "bg-white/10 text-white/60 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:scale-[1.02] active:scale-[0.98]"
        }

        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-pink-400/50
      `}
    >
      {/* subtle glow layer */}
      <span
        className={`
          absolute inset-0 opacity-0 transition-opacity duration-300
          ${!loading ? "hover:opacity-20 bg-white" : ""}
        `}
      />

      {/* content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Processing...
          </>
        ) : (
          children || title
        )}
      </span>
    </button>
  );
};

export default SubmitBtn;