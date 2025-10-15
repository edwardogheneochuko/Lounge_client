import React from "react";
import useAuthStore from "../store/authStore";

const AdminSettings = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 mt-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          ⚙️ Admin Settings
        </h1>

        {/* Admin Profile Info */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Profile Information
          </h2>
          <div className="bg-gray-100 p-4 rounded-xl space-y-3">
            <p>
              <span className="font-medium text-gray-600">Name:</span>{" "}
              {user?.username || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Email:</span>{" "}
              {user?.email || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-600">Role:</span>{" "}
              {user?.role || "admin"}
            </p>
          </div>
        </div>

        {/* System Management Section */}
        <div className="border-t border-gray-200 pt-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            System Management
          </h2>
          <p className="text-gray-600">
            Manage system preferences, update admin privileges, or monitor
            server configurations (coming soon).
          </p>
        </div>

        {/* Notifications / Future Controls */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Notifications & Preferences
          </h2>
          <p className="text-gray-600">
            Control notification preferences, reports, and dashboard alerts
            (coming soon).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
