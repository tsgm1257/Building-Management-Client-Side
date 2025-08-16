import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // If no role is required, no need to check
    if (!requiredRole) {
      setCheckingRole(false);
      return;
    }

    // If user isn't ready or not logged in yet, don't start role check
    if (!user) {
      setCheckingRole(false);
      return;
    }

    // We have a user and a required role → check role
    const fetchRole = async () => {
      try {
        setCheckingRole(true);
        if (!API_URL) throw new Error("VITE_API_URL is not defined");

        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/api/user/role`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setUserRole(data.role);
      } catch (err) {
        console.error("Role fetch error:", err);
        setUserRole(null);
      } finally {
        setCheckingRole(false);
      }
    };

    fetchRole();
  }, [user, requiredRole]);

  // Wait for Firebase auth to resolve, and (if needed) role check
  if (loading || checkingRole) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // If not logged in, bounce to login and remember where we came from
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required, verify it (string or array supported)
  if (requiredRole) {
    const ok =
      (Array.isArray(requiredRole) && requiredRole.includes(userRole)) ||
      (!Array.isArray(requiredRole) && userRole === requiredRole);

    if (!ok) {
      // Not authorized for this route
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
