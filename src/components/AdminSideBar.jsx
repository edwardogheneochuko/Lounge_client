import { LogOut, Menu, X, Settings, ShoppingBag, Package } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ logout }) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: "products", label: "Products", path: "/admin", icon: <Package className="w-4 h-4" /> },
    { id: "orders", label: "Orders", path: "/admin/orders", icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "settings", label: "Settings", path: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const base =
    "px-3 py-2 rounded-md transition flex items-center gap-2";

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-neutral-900 text-white border border-gray-700"
      >
        {open ? <X /> : <Menu />}
      </button>

      <div
        className={`fixed bottom-0 left-0 w-full md:hidden z-40 transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-4 mb-6 backdrop-blur-xl bg-neutral-900/90 border border-neutral-700 rounded-2xl shadow-2xl p-5">
          <div className="grid grid-cols-3 gap-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${base} ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}

            <button
              onClick={logout}
              className="px-3 py-2 rounded-md text-red-500 border border-red-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <aside className="hidden md:flex w-56 fixed top-0 left-0 h-screen bg-neutral-900 text-white flex-col p-5">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-3 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `${base} ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-auto bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;