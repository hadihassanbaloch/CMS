import { useAuth } from "../../auth/useAuth";
import { Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const { token, user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) return <Navigate to="/auth" replace />;

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (location.pathname.includes('/admin/patients')) return 'patients';
    return 'appointments';
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-[color:var(--color-cream-100)]">
      {/* Top Navigation */}
      <header className="bg-gradient-to-br from-[color:var(--color-primary-500)] to-[color:var(--color-primary-600)] border-b-2 border-[color:var(--color-primary-700)] shadow-lg text-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          {/* Left: Logo, Title and Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white m-0">Clinic Admin</h1>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <div
                onClick={() => navigate("/admin")}
                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  activeTab === "appointments" 
                    ? "text-white bg-white/10" 
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="relative">
                  Appointments
                  {activeTab === "appointments" && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </span>
              </div>
              <div
                onClick={() => navigate("/admin/patients")}
                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  activeTab === "patients" 
                    ? "text-white bg-white/10" 
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="relative">
                  Patients
                  {activeTab === "patients" && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
                  )}
                </span>
              </div>
            </nav>
          </div>

          {/* Right: User Info and Sign Out */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-white/90 font-medium">{user?.email}</span>
            </div>
            <button
              onClick={signout}
              className="bg-[#554640] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm hover:bg-[#6b5a4f] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#554640]/25 focus:outline-none focus:ring-2 focus:ring-[#554640]/50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-8 overflow-y-auto bg-[color:var(--color-cream-100)]">
        <Outlet />
      </main>
    </div>
  );
}