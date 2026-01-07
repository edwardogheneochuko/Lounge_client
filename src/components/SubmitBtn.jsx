import "../App.css"
import React from 'react';

const SubmitBtn = ({ children, title, loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`
        relative overflow-hidden bg-pink-100 text-black 
        py-3 px-6 rounded-3xl text-lg shadow-md cursor-pointer
        transition-all duration-300
        ${loading 
          ? "opacity-70 cursor-not-allowed" 
          : "hover:shadow-lg group"
        }
      `}
    >
      {/* Pink Blob Animation */}
      {!loading && (
        <span className="pink-blob absolute"></span>
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-neutral-900"
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
          </>
        ) : (
          children || title
        )}
      </span>
    </button>
  );
};

export default SubmitBtn;
