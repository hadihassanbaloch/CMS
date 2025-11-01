// ...existing code...
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import PatientViewModal from "../../components/AdminComponents/patient";

type Patient = {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  dob?: string;
  notes?: string;
  photo?: string;
};

type UpsertPatient = {
  full_name: string;
  phone_number: string;
};

type Mode = "create" | "edit" | null;

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

function avatarUrl(name: string, id: number) {
  const nm = encodeURIComponent(name);
  const bg = "ef4444";
  const color = "ffffff";
  return `https://ui-avatars.com/api/?name=${nm}&background=${bg}&color=${color}&size=128`;
}

export default function AdminPatients({ search = "" }: { search?: string }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      full_name: "Ali Khan",
      phone_number: "03001234567",
      email: "ali.khan@example.com",
      dob: "1990-04-02",
      notes: "Diabetic — needs follow-up.",
      photo: avatarUrl("Ali Khan", 1),
    },
    {
      id: 2,
      full_name: "Sara Ahmed",
      phone_number: "03007654321",
      email: "sara.ahmed@example.com",
      dob: "1985-11-12",
      notes: "Allergic to penicillin.",
      photo: avatarUrl("Sara Ahmed", 2),
    },
    {
      id: 3,
      full_name: "Omar Farooq",
      phone_number: "03009871234",
      email: "omar.farooq@example.com",
      dob: "1995-07-22",
      notes: "Recovering from surgery.",
      photo: avatarUrl("Omar Farooq", 3),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [form, setForm] = useState<UpsertPatient>({
    full_name: "",
    phone_number: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const [viewedPatient, setViewedPatient] = useState<Patient | null>(null);

  const nameValid = form.full_name.trim().length >= 4;
  const phoneValid = /^\d{11}$/.test(form.phone_number);
  const formValid = nameValid && phoneValid;

  useEffect(() => {
    // noop - hard-coded demo
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
    if (!formValid) {
      alert("Please enter a name (≥ 4 chars) and an 11-digit phone number.");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        const nextId = Math.max(0, ...patients.map((p) => p.id)) + 1;
        setPatients((prev) => [
          ...prev,
          {
            id: nextId,
            ...form,
            email: "",
            dob: "",
            notes: "",
            photo: avatarUrl(form.full_name, nextId),
          },
        ]);
      } else if (mode === "edit" && editId != null) {
        setPatients((prev) =>
          prev.map((p) => (p.id === editId ? { ...p, ...form, photo: p.photo ?? avatarUrl(form.full_name, p.id) } : p))
        );
      }
      closeModal();
    } catch (e) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this patient?")) return;
    setDeletingId(id);
    try {
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  function handleView(p: Patient) {
    setViewedPatient(p);
  }

  function goToHistory(p: Patient) {
    // navigate to patient history page, passing patient in navigation state
    navigate(`/admin/patient/${p.id}/history`, { state: { patient: p } });
  }

  const sorted = useMemo(
    () => [...patients].sort((a, b) => (a.full_name || "").localeCompare(b.full_name || "")),
    [patients]
  );

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((p) => {
      return (
        (p.full_name || "").toLowerCase().includes(q) ||
        (p.phone_number || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q) ||
        String(p.id).includes(q)
      );
    });
  }, [search, sorted]);

  return (
    <div className="max-w-5xl mx-auto bg-[#F5F5F5] min-h-screen p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#212121]">Patient Directory</h2>
          <p className="text-sm text-[#757575]">Manage patient records</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="rounded-lg bg-[#F44336] text-white px-4 py-2 hover:bg-[#E53935] shadow-sm transition"
          >
            New Patient
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-[#757575]">Loading…</div>
      ) : err ? (
        <div className="rounded-lg border border-[#ffcdd2] bg-[#ffebee] px-3 py-2 text-sm text-[#C62828]">
          {err}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-[#757575] shadow-sm">
          No patients match your search.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F5F5F5] text-left">
              <tr>
                <th className="px-4 py-2 font-medium text-[#212121]">Name</th>
                <th className="px-4 py-2 font-medium text-[#212121]">Phone</th>
                <th className="px-4 py-2 font-medium text-[#212121]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-200 hover:bg-[#FFF3E0] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photo ?? avatarUrl(p.full_name, p.id)}
                        alt={p.full_name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <div className="text-sm font-medium text-[#212121]">{p.full_name}</div>
                        <div className="text-xs text-[#757575]">ID • {p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#424242]">{p.phone_number}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-[#424242] hover:bg-[#F5F5F5] transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="rounded-md px-3 py-1 bg-[#FFEBEE] text-[#D32F2F] border border-[#E57373] hover:bg-[#FFCDD2] disabled:opacity-60 transition"
                      >
                        {deletingId === p.id ? "Deleting…" : "Delete"}
                      </button>

                      <button
                        onClick={() => handleView(p)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-[#424242] hover:bg-[#F5F5F5] transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => goToHistory(p)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-[#424242] bg-white hover:bg-[#F5F5F5] transition"
                        title="Patient History"
                      >
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-[#212121]">
                {mode === "create" ? "New Patient" : "Edit Patient"}
              </h3>
              <button onClick={closeModal} className="rounded-md px-2 py-1 text-[#757575] hover:bg-[#F5F5F5] transition">✕</button>
            </div>
            <form onSubmit={handleSave} className="grid gap-4 p-4">
              <div>
                <label className="block text-sm text-[#212121] mb-1">Full name</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#03A9F4]"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                  minLength={4}
                />
                {!nameValid && form.full_name.length > 0 && (
                  <p className="mt-1 text-xs text-[#F44336]">Enter at least 4 characters.</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-[#212121] mb-1">Phone number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#03A9F4]"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone_number: digitsOnly(e.target.value).slice(0, 11),
                    })
                  }
                  placeholder="03XXXXXXXXX"
                  required
                  pattern="^\d{11}$"
                />
                {!phoneValid && form.phone_number.length > 0 && (
                  <p className="mt-1 text-xs text-[#F44336]">Phone must be exactly 11 digits.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border px-4 py-2 hover:bg-[#F5F5F5] disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formValid}
                  className="rounded-lg bg-[#F44336] text-white px-4 py-2 hover:bg-[#D32F2F] disabled:opacity-60"
                >
                  {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewedPatient && (
        <PatientViewModal patient={viewedPatient} onClose={() => setViewedPatient(null)} />
      )}
    </div>
  );
}
// ...existing code...
