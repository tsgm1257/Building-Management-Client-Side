import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const API_URL = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "admin" | "member" | "user" | null
  const [loading, setLoading] = useState(true);

  // --- Helpers ---
  const fetchRole = async (firebaseUser) => {
    try {
      if (!firebaseUser || !API_URL) {
        setRole(null);
        return;
      }
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${API_URL}/api/users/role`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Role fetch failed: ${res.status}`);
      const data = await res.json();
      // Expecting { role: "admin" | "member" | "user" }
      const r = (data?.role || "user").toLowerCase();
      setRole(r);
      // optional cache so Navbar still works on reload before fetch completes
      localStorage.setItem("role", r);
    } catch (e) {
      console.error("fetchRole error:", e);
      // fallback – most limited view
      const cached = localStorage.getItem("role");
      setRole(cached || "user");
    }
  };

  // --- Auth API ---
  const register = async (email, password) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await fetchRole(res.user);
    return res;
  };

  const login = async (email, password) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    await fetchRole(res.user);
    return res;
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const res = await signInWithPopup(auth, googleProvider);
    await fetchRole(res.user);
    return res;
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem("role");
    setRole(null);
    await signOut(auth);
  };

  const updateUserProfile = async ({ displayName, photoURL }) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: displayName ?? auth.currentUser.displayName ?? "",
      photoURL: photoURL ?? auth.currentUser.photoURL ?? "",
    });
  };

  // --- Observe auth state ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchRole(currentUser);
      } else {
        setRole(null);
        localStorage.removeItem("role");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const authInfo = {
    user,
    role, // <— expose role to consumers (Navbar)
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    refreshRole: () => fetchRole(user),
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
