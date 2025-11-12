import { useState, useEffect, createContext, useContext } from "react";
import { post, get } from "../api/client";

// Types
interface User {
  id: number;
  full_name: string;
  email: string;
  is_admin: boolean;
  google_id?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (full_name: string, email: string, password: string) => Promise<void>;
  googleSignin: (googleToken: string) => Promise<void>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState<boolean>(true);

  // fetch current user if token present
  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const u = await get<User>("/auth/me", token);
        setUser(u);
      } catch (err) {
        console.warn("Token invalid, clearing.");
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  // signin
  async function signin(email: string, password: string) {
    const data = await post<{ access_token: string }>("/auth/signin", {
      email,
      password,
    });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    const me = await get<User>("/auth/me", data.access_token);
    setUser(me);
  }

  // signup
  async function signup(full_name: string, email: string, password: string) {
    await post("/auth/signup", { full_name, email, password });
    // you can automatically signin here if desired
  }

  // Google sign-in
  async function googleSignin(googleToken: string) {
    const data = await post<{ access_token: string }>("/auth/google-signin", {
      google_token: googleToken,
    });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    const me = await get<User>("/auth/me", data.access_token);
    setUser(me);
  }

  function signout() {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signin, signup, googleSignin, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
