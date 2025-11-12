// pages/Admin/AdminPatients.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { get, post, put, del, ApiError } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { Eye, User, Phone, Plus, Edit, Trash2, Search } from "lucide-react";

type Patient = {
  id: number;
  full_name: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
};

type UpsertPatient = {
  full_name: string;
  phone_number: string;
};

type Mode = "create" | "edit" | null;

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

export default function AdminPatients() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [mode, setMode] = useState<Mode>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [form, setForm] = useState<UpsertPatient>({
    full_name: "",
    phone_number: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // Derived validity
  const nameValid = form.full_name.trim().length >= 4;
  const phoneValid = /^\d{11}$/.test(form.phone_number);
  const formValid = nameValid && phoneValid;

  async function fetchPatients() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await get<Patient[]>("/patients", token);
      setPatients(data ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function openCreate() {
    setForm({ full_name: "", phone_number: "" });
    setEditId(null);
    setMode("create");
  }

  function openEdit(p: Patient) {
    setForm({ full_name: p.full_name || "", phone_number: p.phone_number || "" });
    setEditId(p.id);
    setMode("edit");
  }

  function closeModal() {
    if (saving) return;
    setMode(null);
    setEditId(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    // Guard on our side to prevent 422s
    if (!formValid) {
      alert("Please enter a name (≥ 4 chars) and an 11-digit phone number.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        await post<Patient>("/patients", form, token);
      } else if (mode === "edit" && editId != null) {
        await put<Patient>(`/patients/${editId}`, form, token);
      }
      await fetchPatients();
      closeModal();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Save failed";
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!confirm("Delete this patient?")) return;
    setDeletingId(id);
    try {
      await del(`/patients/${id}`, token);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Delete failed";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  }

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone_number.includes(searchTerm) ||
    patient.id.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="bg-[color:var(--color-cream-100)] min-h-screen p-6 animate-[fade-in_0.5s_ease-in-out]">
      <div className="w-full mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:scale-[1.02] transition-transform duration-200">
          <div className="bg-gradient-to-br from-[color:var(--color-primary-500)] to-[color:var(--color-primary-600)] text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-3">
                  <User className="h-7 w-7" />
                  Patient Management
                </h1>
                <p className="mt-2 opacity-90 text-[24px]"> Total Patients: {filteredPatients.length}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary-500)] focus:border-[color:var(--color-primary-500)] bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={openCreate}
                  className="bg-white text-[color:var(--color-primary-600)] px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-all duration-200 hover:bg-gray-50 hover:-translate-y-0.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg animate-[fade-in_0.3s_ease-in-out]">
            {error}
          </div>
        )}

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-300px)] flex flex-col">
          <div className="bg-white rounded-b-lg flex-1 overflow-hidden flex flex-col">
            {filteredPatients.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center p-12">
                <div>
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[color:var(--color-dark-900)] mb-2">
                    {searchTerm ? "No patients match your search" : "No patients registered"}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Try adjusting your search terms" : "Patient records will appear here when they are added."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#554640] border-b-2 border-[color:var(--color-primary-500)] sticky top-0">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">ID</th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Patient</th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Contact</th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Registration</th>
                        <th className="px-8 py-4 text-center text-sm font-medium text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 w-full mx-auto">
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="transition-colors duration-200 hover:bg-[color:var(--color-primary-50)]">
                          <td className="px-8 py-6 text-base text-[color:var(--color-dark-900)]">
                            <div className="text-lg font-bold text-[color:var(--color-primary-600)]">
                              {patient.id}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-base text-[color:var(--color-dark-900)]">
                            <div className="flex items-center">
                             
                              <div>
                                <div className="text-base font-medium text-gray-900">
                                  {patient.full_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-base text-[color:var(--color-dark-900)]">
                            <div className="flex items-center">
                              <Phone className="h-5 w-5 text-gray-400 mr-3" />
                              <span className="text-base">{patient.phone_number}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-base text-gray-500">
                            {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-8 py-6 text-base text-[color:var(--color-dark-900)]">
                            <div className="flex items-center justify-center space-x-3">
                              <button
                                onClick={() => setSelectedPatient(patient)}
                                className="bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)] px-4 py-2 text-sm rounded-lg font-medium inline-flex items-center gap-2 transition-all duration-200 hover:bg-[color:var(--color-primary-100)]"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                              <button
                                onClick={() => openEdit(patient)}
                                className="bg-gray-50 text-gray-700 px-4 py-2 text-sm rounded-lg font-medium inline-flex items-center gap-2 transition-all duration-200 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(patient.id)}
                                disabled={deletingId === patient.id}
                                className="bg-red-50 text-red-700 px-4 py-2 text-sm rounded-lg font-medium inline-flex items-center gap-2 transition-all duration-200 hover:bg-red-100 disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                {deletingId === patient.id ? "..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {mode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-[color:var(--color-dark-900)]">
              {mode === "create" ? "Add New Patient" : "Edit Patient"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[color:var(--color-primary-500)] focus:border-[color:var(--color-primary-500)]"
                  placeholder="Enter patient's full name"
                  autoFocus
                />
                {!nameValid && form.full_name.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">Name must be at least 4 characters</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: digitsOnly(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[color:var(--color-primary-500)] focus:border-[color:var(--color-primary-500)]"
                  placeholder="Enter 11-digit phone number"
                  maxLength={11}
                />
                {!phoneValid && form.phone_number.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">Phone number must be exactly 11 digits</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formValid || saving}
                  className="flex-1 bg-[color:var(--color-primary-500)] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-[color:var(--color-primary-600)] disabled:opacity-50"
                >
                  {saving ? "Saving..." : (mode === "create" ? "Add Patient" : "Update Patient")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[color:var(--color-dark-900)]">Patient Details</h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-[color:var(--color-cream-100)] p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-[color:var(--color-primary-600)] mr-2" />
                  <span className="font-medium text-[color:var(--color-dark-900)]">Patient Information</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">ID:</span> #{selectedPatient.id}</div>
                  <div><span className="font-medium">Name:</span> {selectedPatient.full_name}</div>
                  <div><span className="font-medium">Phone:</span> {selectedPatient.phone_number}</div>
                  {selectedPatient.created_at && (
                    <div><span className="font-medium">Registered:</span> {new Date(selectedPatient.created_at).toLocaleString()}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    openEdit(selectedPatient);
                  }}
                  className="bg-[color:var(--color-primary-500)] text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-all duration-200 hover:bg-[color:var(--color-primary-600)]"
                >
                  <Edit className="h-4 w-4" />
                  Edit Patient
                </button>
                <button
                  onClick={() => navigate(`/admin/patients/${selectedPatient.id}`)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors duration-200 hover:bg-gray-200"
                >
                  <Eye className="h-4 w-4" />
                  View History
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this patient?")) {
                      handleDelete(selectedPatient.id);
                      setSelectedPatient(null);
                    }
                  }}
                  disabled={deletingId === selectedPatient.id}
                  className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors duration-200 hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === selectedPatient.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
