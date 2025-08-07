import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch(
          "https://building-management-server-woad-two.vercel.app/api/users/role",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setUserRole(data.role);
      } catch (err) {
        console.error("Role fetch error:", err);
      } finally {
        setCheckingRole(false);
      }
    };

    if (requiredRole) {
      fetchRole();
    } else {
      setCheckingRole(false);
    }
  }, [user, requiredRole]);

  if (loading || checkingRole) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect even if user is logged in but role does not match
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
