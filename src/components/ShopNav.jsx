import React, { useState } from "react";
import { ShoppingCart, LogOut, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";

const ShopNav = () => {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-600 hover:text-green-700 transition"
        >
          🛍️ MyShop
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/shop" className="hover:text-green-600 transition">
            Shop
          </Link>

          <Link to="/cart" className="relative flex items-center gap-1 hover:text-green-600 transition">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm">{user.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col gap-4 px-6 py-4">
          <Link to="/shop" className="hover:text-green-600 transition" onClick={() => setIsOpen(false)}>
            Shop
          </Link>

          <Link to="/cart" className="relative flex items-center gap-2 hover:text-green-600 transition" onClick={() => setIsOpen(false)}>
            <ShoppingCart className="w-6 h-6" />
            Cart
            {cartCount > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm">{user.email}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
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
