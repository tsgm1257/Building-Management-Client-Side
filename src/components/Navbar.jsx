// src/components/Navbar.jsx
import { useContext, useMemo } from "react";
import { NavLink, Link } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import ThemeToggle from "./ThemeToggle";
import { FiMenu } from "react-icons/fi";

const linkBase =
  "px-3 py-2 text-sm md:text-base transition-colors duration-200";
const linkActive =
  "relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-secondary";

const NavA = ({ to, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
  >
    {label}
  </NavLink>
);

const Navbar = () => {
  const { user, role: ctxRole, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  const role = useMemo(() => {
    if (!user) return null;
    return (ctxRole || localStorage.getItem("role") || "user").toLowerCase();
  }, [user, ctxRole]);

  const publicLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/apartments", label: "Apartments" },
    { to: "/contact", label: "Contact" },
  ];

  const dashboardByRole = {
    user: [
      { to: "/dashboard/my-profile", label: "My Profile" },
      { to: "/dashboard/announcements", label: "Announcements" },
    ],
    member: [
      { to: "/dashboard/my-profile", label: "My Profile" },
      { to: "/dashboard/make-payment", label: "Make Payment" },
      { to: "/dashboard/payment-history", label: "Payment History" },
      { to: "/dashboard/announcements", label: "Announcements" },
    ],
    admin: [
      { to: "/dashboard/admin-profile", label: "Admin Profile" },
      { to: "/dashboard/manage-members", label: "Manage Members" },
      { to: "/dashboard/make-announcement", label: "Make Announcement" },
      { to: "/dashboard/agreement-requests", label: "Agreement Requests" },
      { to: "/dashboard/manage-coupons", label: "Manage Coupons" },
    ],
  };

  const dashboardItems = role
    ? dashboardByRole[role] || dashboardByRole.user
    : [];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-base-100 text-base-content border-b border-base-200 dark:bg-neutral dark:text-neutral-content dark:border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 md:px-6 h-16">
          {/* Left: Brand */}
          <div className="flex-none">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg md:text-xl font-semibold tracking-tight"
            >
              <img
                src="https://i.ibb.co/4wK6q5DH/logo.png"
                alt="Logo"
                className="w-10 h-10 rounded"
              />
              <span>My Building</span>
            </Link>
          </div>

          {/* Center: desktop links */}
          <div className="flex-1 hidden lg:flex">
            <div className="mx-auto flex items-center gap-2">
              {publicLinks.map((l) => (
                <NavA key={l.to} to={l.to} label={l.label} end={l.end} />
              ))}
            </div>
          </div>

          {/* Right: Desktop controls */}
          <div className="flex-none items-center gap-3 hidden lg:flex">
            {user && (
              <div className="avatar">
                <div className="w-9 h-9 rounded-full ring ring-base-300 dark:ring-white/10 overflow-hidden">
                  <img
                    src={
                      user.photoURL ||
                      "https://i.ibb.co/Q3YR2xSn/default-user.png"
                    }
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                  Dashboard
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 text-base-content dark:bg-neutral dark:text-neutral-content rounded-box w-64"
                >
                  {dashboardItems.map((d) => (
                    <li key={d.to}>
                      <NavA to={d.to} label={d.label} />
                    </li>
                  ))}
                  <li className="mt-1">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline btn-sm"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/auth" className="btn btn-sm btn-outline">
                  Login
                </Link>
                <Link to="/auth" className="btn btn-sm btn-primary">
                  Register
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Right: Mobile hamburger only */}
          <div className="flex-none lg:hidden ml-auto">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <FiMenu size={22} />
              </label>
              <div
                tabIndex={0}
                className="dropdown-content mt-2 p-3 shadow bg-base-100 text-base-content dark:bg-neutral dark:text-neutral-content rounded-box w-72"
              >
                <ul className="menu">
                  {publicLinks.map((l) => (
                    <li key={l.to}>
                      <NavA to={l.to} label={l.label} />
                    </li>
                  ))}
                  {user && (
                    <>
                      <li className="menu-title mt-2">Dashboard</li>
                      {dashboardItems.map((d) => (
                        <li key={d.to}>
                          <NavA to={d.to} label={d.label} />
                        </li>
                      ))}
                      <li className="mt-2">
                        <button
                          onClick={handleLogout}
                          className="btn btn-outline w-full"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  )}
                  {!user && (
                    <li className="mt-2 flex gap-2">
                      <Link
                        to="/auth"
                        className="btn btn-outline btn-sm flex-1"
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth"
                        className="btn btn-primary btn-sm flex-1"
                      >
                        Register
                      </Link>
                    </li>
                  )}
                  <li className="mt-3">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-sm">Theme</span>
                      <ThemeToggle />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
