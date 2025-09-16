import { LogOut, Menu, X } from "lucide-react";
import React, { useState } from "react";

const Sidebar = ({ activeTab, setActiveTab, logout }) => {
  const menuItems = [
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
  ];
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="border-2 border-gray-700 p-2 fixed bottom-6 right-6 z-50 text-gray-400
          rounded-3xl bg-neutral-900 hover:bg-neutral-600 cursor-pointer md:hidden"
        aria-label="Toggle Menu"
        onClick={toggleMenu}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed bottom-0 left-0 w-full md:hidden z-40 transition-transform duration-300
          ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-4 mb-6 backdrop-blur-xl border border-neutral-500 rounded-3xl
          shadow-2xl py-5 px-6">
          <div className="grid grid-cols-3 gap-4">
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
            <button onClick={logout}
             className="px-3 py-2 text-left rounded-md transition cursor-pointer
            hover:bg-red-700 hover:text-white text-red-700 font-serif flex border border-red-800">
             <LogOut className="mr-2"/> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-neutral-900 text-white px-5 py-3 min-h-screen flex-col fixed top-0 left-0">
        <h2 className="text-xl font-bold text-gray-200 font-mono my-5">
          Admin Panel
        </h2>

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

        <button
          onClick={logout}
          className="mt-6 w-full px-3 py-2 rounded-md bg-red-600 hover:bg-red-700
           text-gray-100 font-medium transition cursor-pointer">
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
