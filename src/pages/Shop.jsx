import React, { useState, useEffect } from "react";
import { ShoppingCart, LogOut, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";

const ShopNav = () => {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white z-50 transition-shadow ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-600 hover:text-green-700 transition"
        >
          🛍️ MyShop
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1 hover:text-green-600 transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* My Orders (only when logged in) */}
          {user && (
            <Link
              to="/my-orders"
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              My Orders
            </Link>
          )}

          {/* Optional: Admin link */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              Admin Panel
            </Link>
          )}

          {/* User info + Logout */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 cursor-pointer
                 text-white hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/cart"
            className="relative flex items-center hover:text-green-600 transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="text-gray-700 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md flex flex-col gap-4 px-6 py-4 animate-fadeIn">
          {user ? (
            <>
              <div className="flex items-center gap-2 p-3 rounded-md bg-gray-100">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm truncate">
                  {user.email}
                </span>
              </div>

              {/* My Orders link */}
              <Link
                to="/my-orders"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition text-center"
              >
                My Orders
              </Link>

              {/* Optional: Admin link */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition text-center"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-600
                text-white hover:bg-red-700 transition mt-1 w-fit mx-auto cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-md bg-green-600 text-white
               hover:bg-green-700 transition text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default ShopNav;
