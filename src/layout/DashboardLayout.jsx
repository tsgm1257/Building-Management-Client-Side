import { useContext, useEffect, useState } from "react";
import { Outlet, Link, useLocation, Navigate, useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";

// React Icons
import {
  FaUser,
  FaBullhorn,
  FaMoneyCheckAlt,
  FaHistory,
  FaUserShield,
  FaFileSignature,
  FaUsersCog,
  FaTags,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(
          `https://building-management-server-woad-two.vercel.app/api/users/role`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const contentType = res.headers.get("content-type");
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error("Expected JSON but got: " + text);
        }

        const data = await res.json();
        setRole(data.role || "user");
      } catch (err) {
        console.error("Role fetch error:", err);
        setRole("user");
      }
    };

    if (user) fetchRole();
  }, [user]);

  if (loading || (user && !role)) {
    return <p className="text-center mt-20">Loading dashboard...</p>;
  }

  if (location.pathname === "/dashboard") {
    return (
      <Navigate
        to={
          role === "admin"
            ? "/dashboard/admin-profile"
            : "/dashboard/my-profile"
        }
        replace
      />
    );
  }

  const activeColor =
    role === "admin"
      ? "bg-red-200"
      : role === "member"
      ? "bg-green-200"
      : "bg-blue-200";

  const menuItem = (path, label, Icon) => (
    <li key={path}>
      <Link
        to={path}
        className={`flex items-center gap-2 rounded px-3 py-2 hover:bg-base-300 ${
          location.pathname === path ? `${activeColor} font-semibold` : ""
        }`}
      >
        <Icon className="text-lg" />
        <span>{label}</span>
      </Link>
    </li>
  );

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content px-4 py-6">
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-outline drawer-button lg:hidden mb-4"
        >
          ☰ Menu
        </label>
        <Outlet />
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" />
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content space-y-1">
          <li className="text-xl font-bold mb-4 border-b pb-2">Dashboard</li>

          {role !== "admin" &&
            menuItem("/dashboard/my-profile", "My Profile", FaUser)}

          {role === "member" && (
            <>
              {menuItem(
                "/dashboard/make-payment",
                "Make Payment",
                FaMoneyCheckAlt
              )}
              {menuItem(
                "/dashboard/payment-history",
                "Payment History",
                FaHistory
              )}
            </>
          )}

          {role !== "admin" &&
            menuItem("/dashboard/announcements", "Announcements", FaBullhorn)}

          {role === "admin" && (
            <>
              {menuItem(
                "/dashboard/admin-profile",
                "Admin Profile",
                FaUserShield
              )}
              {menuItem(
                "/dashboard/agreement-requests",
                "Agreement Requests",
                FaFileSignature
              )}
              {menuItem(
                "/dashboard/manage-members",
                "Manage Members",
                FaUsersCog
              )}
              {menuItem(
                "/dashboard/make-announcement",
                "Make Announcement",
                FaBullhorn
              )}
              {menuItem("/dashboard/manage-coupons", "Manage Coupons", FaTags)}
            </>
          )}

          <div className="divider" />

          <li>
            <Link to="/" className="flex items-center gap-2 text-primary">
              <FaHome className="text-lg" />← Back to Home
            </Link>
          </li>
          <li>
            <button
              onClick={() => logout().then(() => navigate("/"))}
              className="flex items-center gap-2 text-error text-left px-3 py-2 rounded hover:bg-base-300"
            >
              <FaSignOutAlt className="text-lg" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
