import { Routes, Route } from "react-router-dom";

// Public
import Landing from "./pages/Landing";

// Auth
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

// User
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import MyOrders from "./components/MyOrder";
import Settings from "./pages/Settings";
import UserLayout from "./layout/UserLayout";

// Admin
import Admin from "./pages/Admin";
import AdminLayout from "./layout/AdminLayout";
import AdminSettings from "./pages/AdminSettings";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        element={
          <ProtectedRoute role="user">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route
        path="*"
        element={
          <h1 className="text-center mt-20 text-2xl">
            404 - Page Not Found
          </h1>
        }
      />

    </Routes>
  );
};

export default App;