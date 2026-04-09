import React from "react";
import useAuthStore from "../store/authStore";

const Settings = () => {
  const { user } = useAuthStore();

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between border-b py-2">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-800">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 mt-10">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            ⚙️ Account Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Profile Information
          </h2>

          <div className="bg-gray-50 rounded-xl p-4">
            <InfoRow label="Name" value={user?.username} />
            <InfoRow label="Email" value={user?.email} />
            <InfoRow label="Role" value={user?.role || "user"} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Account Actions
          </h2>

          <div className="flex flex-col gap-3">

            <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
              Edit Profile
            </button>

            <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
               Change Password
            </button>

            <button className="w-full text-left px-4 py-3 rounded-lg bg-red-800 text-red-200 hover:bg-red-900 transition">
               Delete Account
            </button>

          </div>
        </div>

        {/* FUTURE FEATURES */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Preferences
          </h2>

          <p className="text-gray-500 text-sm">
            Notification settings, theme control, and privacy options will appear here.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Settings;