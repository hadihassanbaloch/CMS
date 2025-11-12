import { useAuth } from "../../auth/useAuth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AdminAppointments from "./AdminAppointments";
import AdminPatients from "./AdminPatients";

export default function AdminDashboard() {
  const { token, user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current tab based on URL path
  const currentTab = location.pathname.includes('/admin/patients') ? 'patients' : 'appointments';

  if (!token) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold">Clinic Admin</h1>
          <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/admin")}
            className={`block w-full text-left px-3 py-2 rounded-lg ${
              currentTab === "appointments"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => navigate("/admin", { state: { tab: "patients" } })}
            className={`block w-full text-left px-3 py-2 rounded-lg ${
              currentTab === "patients"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Patients
          </button>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={signout}
            className="w-full rounded-lg bg-red-600 text-white py-2 hover:opacity-90"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Only show components when we're exactly on /admin path */}
        {location.pathname === "/admin" && (
          <>
            {(location.state as any)?.tab === "patients" ? <AdminPatients /> : <AdminAppointments />}
          </>
        )}
      </main>
    </div>
  );
}
