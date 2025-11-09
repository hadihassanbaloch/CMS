import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type Patient = {
  id: number;
  full_name: string;
  phone_number?: string;
  email?: string;
  dob?: string;
  photo?: string;
};

type RecordItem = {
  id: number;
  date: string;
  doctor: string;
  disease: string;
  prescription: string; 
  prescription_file?: string; 
};

export default function PatientHistory() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams<{ id: string }>();
  const patient: Patient | undefined = state?.patient;

  const fallbackPatient: Patient = useMemo(
    () => ({
      id: Number(params.id) || 0,
      full_name: "Unknown Patient",
      phone_number: "—",
      email: "—",
      dob: "—",
      photo: undefined,
    }),
    [params]
  );

  const current = patient ?? fallbackPatient;

  const [records, setRecords] = useState<RecordItem[]>([
    {
      id: 1,
      date: "2025-10-01",
      doctor: "Dr. Ahmad",
      disease: "Hypertension",
      prescription: "Amlodipine 5mg once daily",
      prescription_file: undefined,
    },
    {
      id: 2,
      date: "2025-09-07",
      doctor: "Dr. Fatima",
      disease: "Type 2 Diabetes",
      prescription: "Metformin 500mg, 1 tab twice daily",
      // sample data URL PDF/text could be used; leave undefined for demo
      prescription_file: undefined,
    },
    {
      id: 3,
      date: "2025-06-22",
      doctor: "Dr. Salman",
      disease: "URI",
      prescription: "Amoxicillin 500mg, 3 times daily for 7 days",
      prescription_file: undefined,
    },
  ]);

  // Edit modal state
  const [editing, setEditing] = useState<RecordItem | null>(null);

  function handleDeleteRecord(id: number) {
    if (!confirm("Delete this record?")) return;
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  function handleEditRecordOpen(id: number) {
    const r = records.find((x) => x.id === id);
    if (!r) return;
    setEditing({ ...r });
  }

  function handleEditSave(updated: RecordItem) {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditing(null);
  }

  // download prescription file if available, otherwise generate text file from prescription string
  async function downloadPrescription(rec: RecordItem) {
    try {
      if (rec.prescription_file) {
        // try fetching remote/file url
        const res = await fetch(rec.prescription_file);
        if (!res.ok) throw new Error("Failed to fetch file");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prescription-${rec.id}${guessFileExt(blob.type)}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }

      // fallback: create a .txt containing prescription text
      const content = `Prescription for ${current.full_name} (${current.id})\nDate: ${rec.date}\nDoctor: ${rec.doctor}\nDisease: ${rec.disease}\n\nPrescription:\n${rec.prescription}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescription-${rec.id}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed");
      console.error(err);
    }
  }

  function guessFileExt(mime: string) {
    if (!mime) return ".bin";
    if (mime.includes("pdf")) return ".pdf";
    if (mime.includes("jpeg") || mime.includes("jpg")) return ".jpg";
    if (mime.includes("png")) return ".png";
    if (mime.includes("text")) return ".txt";
    return ".bin";
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white shadow-md overflow-hidden flex items-center justify-center">
              {current.photo ? (
                <img src={current.photo} alt={current.full_name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-[#e53935] flex items-center justify-center text-white font-semibold text-lg">
                  {(current.full_name || "PN")
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{current.full_name}</h1>
              <p className="text-sm text-gray-500">Patient ID • {current.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextId = Math.max(0, ...records.map((r) => r.id)) + 1;
                const newRec: RecordItem = {
                  id: nextId,
                  date: new Date().toISOString().slice(0, 10),
                  doctor: "Dr. New",
                  disease: "New diagnosis",
                  prescription: "Prescription details...",
                };
                setRecords((prev) => [newRec, ...prev]);
              }}
              className="rounded-md bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm transition shadow-sm"
            >
              Add Record
            </button>

            <button
              onClick={() => navigate(-1)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>

        {/* History card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Patient History</h2>
            <p className="text-sm text-gray-500 mt-1">Medical records overview</p>
          </div>

          <div className="p-4">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-gray-700">Doctor</th>
                  <th className="px-4 py-2 text-left text-gray-700">Disease</th>
                  <th className="px-4 py-2 text-left text-gray-700">Prescription</th>
                  <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50 transition-all">
                    <td className="px-4 py-2 align-top">{r.date}</td>
                    <td className="px-4 py-2 align-top">{r.doctor}</td>
                    <td className="px-4 py-2 align-top">{r.disease}</td>
                    <td className="px-4 py-2 align-top">
                      <div className="text-gray-700">{r.prescription}</div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => downloadPrescription(r)}
                          className="rounded-md px-3 py-1 text-sm text-gray-700 border border-gray-300 hover:bg-gray-100"
                          title="Download prescription"
                        >
                          Download
                        </button>
                        {r.prescription_file && (
                          <span className="text-xs text-gray-500 self-center">file attached</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-2 align-top">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRecordOpen(r.id)}
                          className="rounded-md border border-gray-400 px-3 py-1 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteRecord(r.id)}
                          className="rounded-md px-3 py-1 text-red-600 bg-red-50 border border-red-300 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {records.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                      No history records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">Edit Record</h3>
              <button onClick={() => setEditing(null)} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editing) handleEditSave(editing);
              }}
              className="p-4 grid gap-3"
            >
              <div>
                <label className="block text-sm text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Doctor</label>
                <input
                  value={editing.doctor}
                  onChange={(e) => setEditing({ ...editing, doctor: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Disease</label>
                <input
                  value={editing.disease}
                  onChange={(e) => setEditing({ ...editing, disease: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Prescription (text)</label>
                <textarea
                  value={editing.prescription}
                  onChange={(e) => setEditing({ ...editing, prescription: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Prescription file URL (optional)</label>
                <input
                  value={editing.prescription_file ?? ""}
                  onChange={(e) => setEditing({ ...editing, prescription_file: e.target.value || undefined })}
                  placeholder="https://... or data:..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                <p className="text-xs text-gray-400 mt-1">Provide URL to an existing file to enable direct download.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-[#e53935] text-white px-4 py-2 hover:opacity-95">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
