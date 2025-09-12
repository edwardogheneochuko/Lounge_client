import React from 'react'

const SubmitBtn = ({ children, title, loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full bg-blue-500 text-white p-3 rounded text-xl font-semibold transition-colors cursor-pointer
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"}
      `}
    >
      {loading ? "Loading..." : (children || title)}
    </button>
  )
}

export default SubmitBtn
