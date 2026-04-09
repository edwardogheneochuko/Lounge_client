import { Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Sidebar from "../components/AdminSideBar";

const AdminLayout = () => {
  const { logout, user } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gray-100">

      <Sidebar 
        currentPath={location.pathname} 
        logout={logout} 
      />

      <main className="flex-1 p-8 overflow-y-auto md:ml-56">
        <Outlet context={{ user }} />
      </main>

    </div>
  );
};

export default AdminLayout;