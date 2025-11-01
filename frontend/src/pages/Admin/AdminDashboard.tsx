// ...existing code...
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import AdminAppointments from "./AdminAppointments";
import AdminPatients from "./AdminPatients";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"appointments" | "patients">("appointments");
  const { token, user, signout } = useAuth();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f5f5f5]">
      {/* Animated Background (optional subtle gradient for Material style) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fce4ec]/30 via-white to-[#e3f2fd]/40"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-[#f9fafb] border-r border-gray-200 flex flex-col shadow-md">
          <div className="px-6 py-6 border-b bg-[#f44336] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">
                CL
              </div>
              <div>
                <h1 className="text-lg font-semibold">Clinic Admin</h1>
                <p className="text-xs opacity-80 truncate max-w-[12rem]">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setTab("appointments")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                tab === "appointments"
                  ? "bg-[#03a9f4]/10 border-l-4 border-[#03a9f4] text-[#0d47a1] font-medium shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Appointments</span>
            </button>

            <button
              onClick={() => setTab("patients")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                tab === "patients"
                  ? "bg-[#8bc34a]/10 border-l-4 border-[#8bc34a] text-[#33691e] font-medium shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Patients</span>
            </button>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={signout}
              className="w-full rounded-lg bg-[#f44336] text-white py-2 font-medium hover:bg-[#e53935] transition"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#212121]">Dashboard</h2>
                <p className="text-sm text-[#757575]">Overview & management</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search patients or appointments..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-72 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#03a9f4]/40"
                  />
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-sm text-gray-600">
                    Role: <span className="font-medium ml-1 text-gray-800">Admin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition">
                <div className="text-sm text-[#e91e63] font-medium">Today's Appointments</div>
                <div className="mt-2 text-3xl font-semibold text-[#212121]">12</div>
                <div className="text-xs text-[#757575] mt-1">Updated just now</div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition">
                <div className="text-sm text-[#03a9f4] font-medium">Upcoming</div>
                <div className="mt-2 text-3xl font-semibold text-[#212121]">34</div>
                <div className="text-xs text-[#757575] mt-1">Next 7 days</div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition">
                <div className="text-sm text-[#8bc34a] font-medium">Total Patients</div>
                <div className="mt-2 text-3xl font-semibold text-[#212121]">1,240</div>
                <div className="text-xs text-[#757575] mt-1">All time</div>
              </div>
            </div>
          </header>

          <section>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#212121]">
                  {tab === "appointments" ? "Manage Appointments" : "Patient Directory"}
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTab("appointments")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      tab === "appointments"
                        ? "bg-[#03a9f4] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Appointments
                  </button>
                  <button
                    onClick={() => setTab("patients")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      tab === "patients"
                        ? "bg-[#8bc34a] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Patients
                  </button>
                </div>
              </div>

              <div className="min-h-[60vh]">
                {tab === "appointments" ? (
                  <AdminAppointments search={query} />
                ) : (
                  <AdminPatients search={query} />
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
// ...existing code...
