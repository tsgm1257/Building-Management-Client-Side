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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res;
  };

  const login = async (email, password) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  };

  // NEW: Google sign-in (popup)
  const loginWithGoogle = async () => {
    setLoading(true);
    const res = await signInWithPopup(auth, googleProvider);
    return res;
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
  };

  const updateUserProfile = async ({ displayName, photoURL }) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: displayName ?? auth.currentUser.displayName ?? "",
      photoURL: photoURL ?? auth.currentUser.photoURL ?? "",
    });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const authInfo = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
