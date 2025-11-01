// ...existing code...
import React, { useMemo, useState } from "react";
import { format } from "date-fns";

type Appt = {
  id: number;
  patient_name: string;
  doctor: string;
  start_at: string;
  end_at: string;
};

export default function AdminAppointments({ search = "" }: { search?: string }) {
  const [appts, setAppts] = useState<Appt[]>([
    {
      id: 1,
      patient_name: "Ali Khan",
      doctor: "Dr. Ahmad",
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 30 * 60000).toISOString(),
    },
    {
      id: 2,
      patient_name: "Sara Ahmed",
      doctor: "Dr. Fatima",
      start_at: new Date(Date.now() + 3600 * 1000).toISOString(),
      end_at: new Date(Date.now() + 3600 * 1000 + 30 * 60000).toISOString(),
    },
  ]);

  const [editing, setEditing] = useState<Appt | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function openEdit(a: Appt) {
    setEditing(a);
  }

  function closeEdit() {
    setEditing(null);
  }

  function saveEdit(updated: Appt) {
    setAppts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    closeEdit();
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this appointment?")) return;
    setDeletingId(id);
    setTimeout(() => {
      setAppts((prev) => prev.filter((a) => a.id !== id));
      setDeletingId(null);
    }, 300);
  }

  const sorted = useMemo(() => [...appts].sort((a, b) => a.start_at.localeCompare(b.start_at)), [appts]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((a) => {
      const startStr = new Date(a.start_at).toLocaleString().toLowerCase();
      const endStr = new Date(a.end_at).toLocaleString().toLowerCase();
      return (
        (a.patient_name || "").toLowerCase().includes(q) ||
        (a.doctor || "").toLowerCase().includes(q) ||
        startStr.includes(q) ||
        endStr.includes(q) ||
        String(a.id).includes(q)
      );
    });
  }, [search, sorted]);

  return (
    <div className="max-w-5xl mx-auto bg-[#F5F5F5] min-h-screen p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#212121]">Appointments</h2>
          <p className="text-sm text-[#757575]">Manage hospital appointments (demo)</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F5F5F5] text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-[#212121]">Patient</th>
              <th className="px-4 py-3 font-medium text-[#212121]">Doctor</th>
              <th className="px-4 py-3 font-medium text-[#212121]">Start</th>
              <th className="px-4 py-3 font-medium text-[#212121]">End</th>
              <th className="px-4 py-3 font-medium text-[#212121]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr
                key={a.id}
                className="border-t border-gray-200 hover:bg-[#FFF3E0] transition-colors"
              >
                <td className="px-4 py-3 text-[#424242]">{a.patient_name}</td>
                <td className="px-4 py-3 text-[#424242]">{a.doctor}</td>
                <td className="px-4 py-3 text-[#616161]">{format(new Date(a.start_at), "PPpp")}</td>
                <td className="px-4 py-3 text-[#616161]">{format(new Date(a.end_at), "PPpp")}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(a)}
                      className="rounded-md border border-gray-300 bg-[#03A9F4] text-white px-3 py-1 hover:bg-[#0288D1] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deletingId === a.id}
                      className="rounded-md px-3 py-1 bg-[#F44336] text-white hover:bg-[#D32F2F] transition-colors disabled:opacity-60"
                    >
                      {deletingId === a.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-[#757575]">
                  No appointments match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editing && (
        <EditAppointmentModal appt={editing} onClose={closeEdit} onSave={(u) => saveEdit(u)} />
      )}
    </div>
  );
}

function EditAppointmentModal({
  appt,
  onClose,
  onSave,
}: {
  appt: Appt;
  onClose: () => void;
  onSave: (u: Appt) => void;
}) {
  const [form, setForm] = useState(appt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-[0_2px_5px_rgba(0,0,0,0.1)] border border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-[#F44336] text-white rounded-t-lg">
          <h3 className="text-lg font-semibold">Edit Appointment</h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 hover:bg-[#E53935]">✕</button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="p-4 grid gap-4"
        >
          <div>
            <label className="block text-sm text-[#212121] mb-1">Patient</label>
            <input
              className="w-full rounded-md border border-gray-300 bg-[#FAFAFA] px-3 py-2 text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#03A9F4]"
              value={form.patient_name}
              onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-[#212121] mb-1">Doctor</label>
            <input
              className="w-full rounded-md border border-gray-300 bg-[#FAFAFA] px-3 py-2 text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#03A9F4]"
              value={form.doctor}
              onChange={(e) => setForm({ ...form, doctor: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-[#424242] hover:bg-[#EEEEEE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#F44336] text-white px-4 py-2 hover:bg-[#D32F2F] transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ...existing code...
