import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="flex-grow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default UserLayout;