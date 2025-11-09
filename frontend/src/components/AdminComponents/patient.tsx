import React from "react";

type Patient = {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  dob?: string;
  notes?: string;
  photo?: string;
};

export default function PatientViewModal({
  patient,
  onClose,
}: {
  patient: Patient;
  onClose: () => void;
}) {
  const initials = (patient.full_name || "")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg transform rounded-2xl bg-[#fcfcfc] shadow-xl border border-gray-200 ring-1 ring-gray-100 transition-all duration-200 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b px-6 py-4 bg-gray-50/60 rounded-t-2xl">
          <div className="flex items-center gap-4">
            {patient.photo ? (
              <img
                src={patient.photo}
                alt={patient.full_name}
                className="h-14 w-14 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#e53935] text-white text-lg font-semibold shadow-sm">
                {initials || "PN"}
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {patient.full_name}
              </h3>
              <p className="text-sm text-gray-500">Patient ID • {patient.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(patient.phone_number || "");
              }}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              title="Copy phone"
            >
              Copy
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Phone</div>
              <div className="mt-1 text-sm font-medium text-gray-800">
                {patient.phone_number}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Email</div>
              <div className="mt-1 text-sm font-medium text-gray-800">
                {patient.email ?? "—"}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Date of Birth</div>
              <div className="mt-1 text-sm font-medium text-gray-800">
                {patient.dob ?? "—"}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Recent Visits</div>
              <div className="mt-1 text-sm text-gray-700">
                3 in last 6 months
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Notes</div>
            <div className="rounded-lg border border-gray-100 bg-white p-3 text-sm text-gray-700 min-h-[60px]">
              {patient.notes ?? "No notes available."}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-gray-50/70 rounded-b-2xl">
          <button
            onClick={() => alert("Open edit flow (not implemented in demo)")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-[#e53935] px-4 py-2 text-sm font-medium text-white hover:opacity-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
