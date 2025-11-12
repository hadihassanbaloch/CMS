import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import type { ReactNode } from "react";

import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import UserProfile from "./pages/UserProfile";
import MyAppointments from "./pages/MyAppointments";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminAppointments from "./pages/Admin/AdminAppointments";
import AdminPatients from "./pages/Admin/AdminPatients";
import PatientHistory from "./pages/Admin/PatientHistory";
import VisitDetails from "./pages/Admin/VisitDetails";

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
        {/* Public auth page - main entry point */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected landing page - shown after login */}
        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        {/* User profile (requires sign-in) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* My Appointments (requires sign-in) */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        {/* Admin routes with nested layout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminAppointments />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="patients/:patientId" element={<PatientHistory />} />
          <Route path="patients/:patientId/visit/:visitId" element={<VisitDetails />} />
        </Route>

        {/* Main entry point - redirect to auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
