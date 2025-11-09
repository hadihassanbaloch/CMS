import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { get, post, ApiError } from "../api/client";
import Contact  from "../components/UserComponents/Contact";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/UserComponents/Navbar";
import Footer from "../components/UserComponents/Footer";
import WhatsAppButton from "../components/UserComponents/WhatsAppButton";
// ...existing code...

type Appt = { doctor_id: number; start_at: string; end_at: string };

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// Format a Date to "YYYY-MM-DDTHH:MM:SS±HH:MM" using *local* time + offset
function toLocalISOWithOffset(dt: Date) {
  const y = dt.getFullYear();
  const m = pad(dt.getMonth() + 1);
  const d = pad(dt.getDate());
  const hh = pad(dt.getHours());
  const mm = pad(dt.getMinutes());
  const ss = pad(dt.getSeconds());

  const offsetMin = dt.getTimezoneOffset(); // minutes behind UTC (+ for west of UTC)
  const sign = offsetMin <= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const oh = pad(Math.floor(abs / 60));
  const om = pad(abs % 60);

  return `${y}-${m}-${d}T${hh}:${mm}:${ss}${sign}${oh}:${om}`;
}

// Check if two intervals [aStart, aEnd) and [bStart, bEnd) overlap
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart;
}

// Return true if `t` is on the same calendar day as `d`
function sameDay(t: Date, d: Date) {
  return (
    t.getFullYear() === d.getFullYear() &&
    t.getMonth() === d.getMonth() &&
    t.getDate() === d.getDate()
  );
}

export default function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const doctorId = Number(searchParams.get("doctorId") || 1);

  const [start, setStart] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const navigate = useNavigate();
  const { token } = useAuth();

  // Busy intervals (for this doctor)
  const [busy, setBusy] = useState<{ start: Date; end: Date }[]>([]);

  // Load existing appts for this doctor (protected endpoint)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) return;
      try {
        const appts = await get<Appt[]>("/appointments", token);
        if (!alive) return;
        const mine = appts
          .filter((a) => a.doctor_id === doctorId)
          .map((a) => ({ start: new Date(a.start_at), end: new Date(a.end_at) }));
        setBusy(mine);
      } catch {
        // ignore for now; could surface an error banner
      }
    })();
    return () => {
      alive = false;
    };
  }, [doctorId, token]);

  // Disable a time if it would overlap any busy interval (for the selected day)
  const filterTime = (time: Date) => {
    if (!start) return true; // until a date is chosen, allow picker to render
    // ensure we compare within the same day as currently chosen date
    if (!sameDay(time, start)) return true;

    const tStart = time;
    const tEnd = new Date(time.getTime() + 30 * 60000);
    const clash = busy.some((b) => overlaps(tStart, tEnd, b.start, b.end));
    return !clash; // return true if time is selectable
  };

  // Min/max clinic hours (example 08:00–20:00)
  const minTime = useMemo(() => new Date(0, 0, 0, 8, 0), []);
  const maxTime = useMemo(() => new Date(0, 0, 0, 20, 0), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("You must be signed in");
      return;
    }
    if (!start) {
      setError("Pick a date & time");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const end = new Date(start.getTime() + 30 * 60000);
      const startISO = toLocalISOWithOffset(start);
      const endISO = toLocalISOWithOffset(end);

      await post(
        "/appointments",
        {
          doctor_id: doctorId,
          start_at: startISO,
          end_at: endISO,
          reason,
        },
        token
      );

      setSuccessOpen(true); // show modal instead of alert
    } catch (err: any) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background (matching LandingPage) */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-white to-primary-100/30"></div>
        <div className="absolute top-0 left-0 w-[800px] h-[800px] blob blob-1"></div>
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] blob blob-2"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] blob blob-3"></div>
        <div className="absolute top-2/3 right-0 w-[900px] h-[900px] blob blob-4"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <main className="py-12 px-4">
          <div className="mt-5">
            <Contact/>
          </div>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>

      {/* Success Modal */}
      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Appointment booked!</h3>
            <p className="text-gray-600 mb-4">
              Your appointment has been scheduled successfully.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="rounded-lg border px-4 py-2"
                onClick={() => setSuccessOpen(false)}
              >
                Stay
              </button>
              <button
                className="rounded-lg bg-primary-900 text-white px-4 py-2"
                onClick={() => navigate("/landing")}
              >
                Go to Landing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}