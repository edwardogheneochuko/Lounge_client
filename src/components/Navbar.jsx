import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  LogOut,
  User,
  Menu,
  X,
  Package,
  Settings,
} from "lucide-react";
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

  const navBg = scrolled ? "bg-gray-200 shadow-lg" : "bg-gray-100 shadow-sm";

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/shop"
          className="text-2xl font-bold text-neutral-700 hover:text-neutral-900"
        >
          MyShop
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6">

          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/settings" className="hover:text-green-600">
            <Settings />
          </Link>

          {user && (
            <Link to="/my-orders" className="flex items-center gap-1 hover:text-green-600">
              <Package className="w-5 h-5" />
              My Orders
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE */}
        <div className="md:hidden flex items-center gap-4">

          <Link to="/cart">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/settings">
            <Settings />
          </Link>

          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-6 py-4 flex flex-col gap-4">

          {user && (
            <Link
              to="/my-orders"
              onClick={closeMenu}
              className="flex items-center gap-2 hover:text-green-600"
            >
              <Package className="w-5 h-5" />
              My Orders
            </Link>
          )}

          {user ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm truncate">{user.email}</span>
              </div>

              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md w-fit mx-auto"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-center"
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