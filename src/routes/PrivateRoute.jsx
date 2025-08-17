import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const fetchRole = async (forceRefresh = false) => {
      try {
        if (!API_URL) throw new Error("VITE_API_URL is not defined");
        if (!user) return;

        // forceRefresh=true on first try to avoid stale/expired tokens
        const token = await user.getIdToken(forceRefresh);
        const res = await fetch(`${API_URL}/api/users/role`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 && !forceRefresh) {
          // try once more with a fresh token
          return fetchRole(true);
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setUserRole(data.role);
      } catch (err) {
        console.error("Role fetch error:", err);
      } finally {
        if (mounted) setCheckingRole(false);
      }
    };

    if (requiredRole && user) {
      fetchRole(true);
    } else {
      // no role required OR no user yet
      setCheckingRole(false);
    }

    return () => {
      mounted = false;
    };
  }, [user, requiredRole]);

  // still resolving Firebase auth state
  if (loading || checkingRole) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // not logged in → go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // role-gated routes
  if (requiredRole) {
    const ok =
      (Array.isArray(requiredRole) && requiredRole.includes(userRole)) ||
      (!Array.isArray(requiredRole) && userRole === requiredRole);

    if (!ok) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
