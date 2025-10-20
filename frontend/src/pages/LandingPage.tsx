import { useNavigate } from "react-router-dom";

type Doc = { id: number; name: string; specialty: string; bio: string };

const DOCTORS: Doc[] = [
  { id: 1, name: "Dr. Ayesha Khan", specialty: "Cardiologist", bio: "10+ years experience in preventive cardiology." },
  { id: 2, name: "Dr. Omar Malik", specialty: "Dermatologist", bio: "Acne, eczema, cosmetic dermatology." },
  { id: 3, name: "Dr. Sara Ahmed", specialty: "Pediatrician", bio: "Child wellness, vaccinations, growth tracking." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <header className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">CarePlus Clinic</h1>
          <nav className="flex gap-3">
            <a href="/auth" className="text-sm text-gray-700 hover:underline">Sign In</a>
            <a href="/auth" className="text-sm rounded bg-gray-900 px-3 py-1.5 text-white">Create Account</a>
          </nav>
        </div>
      </header>

      {/* intro */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-3xl font-semibold mb-2">Book your appointment</h2>
        <p className="text-gray-600 mb-8">
          Choose a doctor and pick a time that works for you.
        </p>

        {/* doctor cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {DOCTORS.map((d) => (
            <article key={d.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="h-28 w-full rounded-xl bg-gray-100 mb-4" />
              <h3 className="text-lg font-semibold">{d.name}</h3>
              <p className="text-gray-600 text-sm">{d.specialty}</p>
              <p className="text-gray-500 text-sm mt-2">{d.bio}</p>
              <button
                onClick={() => navigate(`/book?doctorId=${d.id}`)}
                className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2 text-white hover:opacity-90"
              >
                Book appointment
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
