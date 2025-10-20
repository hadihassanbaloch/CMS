import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import type { ReactNode } from "react";

import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

/** Protected pages (needs token) */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!token) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

/** Public-only pages (redirect if already signed in) */
function PublicRoute({ children }: { children: ReactNode }) {
  const { token, loading, user } = useAuth();
  if (loading) return null;
  if (token) return <Navigate to={user?.is_admin ? "/admin" : "/landing"} replace />;
  return <>{children}</>;
}

/** Admin-only guard */
function AdminRoute({ children }: { children: ReactNode }) {
  const { token, loading, user } = useAuth();
  if (loading) return null;
  if (!token) return <Navigate to="/auth" replace />;
  if (!user?.is_admin) return <Navigate to="/landing" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth page */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Public landing (anyone can view) */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Patient: book appointment (requires sign-in) */}
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard (requires admin) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* defaults */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
