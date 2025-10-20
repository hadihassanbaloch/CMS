// pages/Admin/AdminPatients.tsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { get, post, put, del, ApiError } from "../../api/client";

type Patient = {
  id: number;
  full_name: string;
  phone_number: string;
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

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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
    setErr(null);
    try {
      const data = await get<Patient[]>("/patients", token);
      setPatients(data ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load patients");
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

  const sorted = useMemo(
    () => [...patients].sort((a, b) => (a.full_name || "").localeCompare(b.full_name || "")),
    [patients]
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Patients</h2>
          <p className="text-sm text-gray-500">Manage patient records</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:opacity-90"
        >
          New Patient
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : err ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
          No patients yet. Click <span className="font-medium">New Patient</span> to add one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">{p.full_name}</td>
                  <td className="px-4 py-3">{p.phone_number}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100 disabled:opacity-60"
                      >
                        {deletingId === p.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">
                {mode === "create" ? "New Patient" : "Edit Patient"}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="grid gap-4 p-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full name</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                  minLength={4}
                />
                {!nameValid && form.full_name.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">Enter at least 4 characters.</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                  <p className="mt-1 text-xs text-red-600">Phone must be exactly 11 digits.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formValid}
                  className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
