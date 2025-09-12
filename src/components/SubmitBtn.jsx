import React from 'react';

const SubmitBtn = ({ children, title, loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`
        w-full 
        bg-pink-500 
        text-white 
        p-3 
        rounded-lg 
        text-xl 
        font-semibold 
        transition-all 
        duration-300 
        shadow-md 
        ${loading 
          ? "opacity-70 cursor-not-allowed" 
          : "hover:bg-pink-600 hover:shadow-lg"
        }
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children || title
      )}
    </button>
  );
};

export default SubmitBtn;
