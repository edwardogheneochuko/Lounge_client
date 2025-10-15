import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Sidebar from "../components/AdminSideBar";

const AdminLayout = () => {
  const { logout, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto md:ml-56">
        <Outlet context={{ activeTab, setActiveTab, user }} />
      </main>
    </div>
  );
};

export default AdminLayout;
