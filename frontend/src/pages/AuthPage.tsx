import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { ApiError, get } from "../api/client";
import GoogleSignInButton from "../components/GoogleSignInButton";

type Mode = "signin" | "signup";

// shape returned by /auth/me
type Me = {
  id: number;
  full_name: string;
  email: string;
  is_admin: boolean;
};

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signin, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signin") {
        // 1) sign in (this stores the token via the hook)
        await signin(email, password);

        // 2) fetch /auth/me using the stored token to decide where to go
        const token = localStorage.getItem("token");
        if (token) {
          const me = await get<Me>("/auth/me", token);
          navigate(me.is_admin ? "/admin" : "/landing");
        } else {
          // fallback (shouldn't happen if signin succeeded)
          navigate("/landing");
        }
      } else {
        // sign up, then switch to signin tab
        await signup(fullName, email, password);
        setMode("signin");
        setSubmitting(false);
        return;
      }
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignInSuccess() {
    try {
      // After successful Google sign-in, navigate based on user role
      const token = localStorage.getItem("token");
      if (token) {
        const me = await get<Me>("/auth/me", token);
        navigate(me.is_admin ? "/admin" : "/landing");
      } else {
        navigate("/landing");
      }
    } catch (err) {
      console.error("Error after Google sign-in:", err);
      setError("Sign-in successful but navigation failed. Please refresh the page.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg border ${
              mode === "signin"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setMode("signin")}
            disabled={submitting}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 rounded-lg border ${
              mode === "signup"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setMode("signup")}
            disabled={submitting}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="grid gap-3" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Full name
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                type="text"
                placeholder="Dr. Hadi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                minLength={3}
                required
                disabled={submitting}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        {/* Social OAuth */}
        <div className="mt-6">
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>
          
          {/* Google Sign-In Button */}
          <div className="grid gap-2">
            <GoogleSignInButton 
              onError={(error) => setError(error)}
              disabled={submitting}
            />
            
            {/* Microsoft placeholder for future */}
            <button
              disabled
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 disabled:opacity-60"
              title="Coming soon"
            >
              Continue with Microsoft (coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
