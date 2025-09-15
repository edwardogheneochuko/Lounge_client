// src/components/Sidebar.jsx
import React from "react";

const Sidebar = ({ activeTab, setActiveTab, logout }) => {
  // Menu items array
  const menuItems = [
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
  ];

  return (
    <aside className="w-56 bg-neutral-900 text-white px-5 py-3 min-h-screen flex flex-col">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-200 font-mono my-5">
        Admin Panel
      </h2>

      {/* Menu */}
      <nav className="flex flex-col gap-3 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-2 text-left rounded-md transition cursor-pointer ${
              activeTab === item.id
                ? "bg-gray-700 text-white font-serif"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout button at the bottom */}
      <button
        onClick={logout}
        className="mt-6 w-full px-3 py-2 rounded-md bg-red-600 hover:bg-red-700
         text-gray-100 font-medium transition cursor-pointer">
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
