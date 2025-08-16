import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(!!requiredRole);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user || !requiredRole) return;
      try {
        if (!API_URL) throw new Error("VITE_API_URL is not defined");
        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/api/users/role`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "");
          throw new Error("Expected JSON, got: " + text);
        }

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

  if (loading || checkingRole) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if logged in but role doesn't match the requirement
  if (
    requiredRole &&
    !(
      (Array.isArray(requiredRole) && requiredRole.includes(userRole)) ||
      (!Array.isArray(requiredRole) && userRole === requiredRole)
    )
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
