import { useContext } from "react";
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
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  // Public routes (shown when logged OUT): exactly 3
  const publicLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/apartments", label: "Apartments" },
    { to: "/contact", label: "Contact" },
  ];

  // Logged-in routes (top-level): exactly 5
  // (Dashboard dropdown includes all protected routes)
  const loggedInTopLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/apartments", label: "Apartments" },
    { to: "/contact", label: "Contact" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/announcements", label: "Announcements" },
  ];

  // Protected routes to expose in dropdown (works for both member/admin)
  const dashboardProtected = [
    { to: "/dashboard", label: "Overview" },
    { to: "/dashboard/my-profile", label: "My Profile" },
    { to: "/dashboard/member/make-payment", label: "Make Payment" },
    { to: "/dashboard/member/payment-history", label: "Payment History" },
    { to: "/dashboard/announcements", label: "Announcements" },
    // Admin-only routes will be protected by PrivateRoute anyway
    { to: "/dashboard/admin/manage-members", label: "Manage Members" },
    { to: "/dashboard/admin/manage-coupons", label: "Manage Coupons" },
    { to: "/dashboard/admin/requests", label: "Agreement Requests" },
    { to: "/dashboard/admin/profile", label: "Admin Profile" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-content/95 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 md:px-6 h-16">
          {/* Left: Logo */}
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

          {/* Center: Links */}
          <div className="flex-1 hidden lg:flex">
            <div className="mx-auto flex items-center gap-2">
              {(user ? loggedInTopLinks : publicLinks).map((l) => (
                <NavA key={l.to} to={l.to} label={l.label} end={l.end} />
              ))}
            </div>
          </div>

          {/* Right: Theme + Auth */}
          <div className="flex-none flex items-center gap-2">
            <ThemeToggle />

            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary">
                  Register
                </Link>
              </div>
            ) : (
              <>
                {/* Dashboard dropdown with ALL protected links */}
                <div className="dropdown dropdown-end hidden lg:block">
                  <label
                    tabIndex={0}
                    className="btn btn-sm btn-outline flex items-center gap-2"
                  >
                    <span>Dashboard</span>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 text-base-content rounded-box w-64"
                  >
                    {dashboardProtected.map((d) => (
                      <li key={d.to}>
                        <NavLink
                          to={d.to}
                          className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : ""}`
                          }
                        >
                          {d.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avatar menu */}
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-outline btn-sm btn-circle avatar hover:opacity-90"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <img
                        src={
                          user.photoURL ||
                          "https://i.ibb.co/Q3YR2xSn/default-user.png"
                        }
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 text-base-content rounded-box w-56"
                  >
                    <li>
                      <NavLink to="/dashboard/my-profile">My Profile</NavLink>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Mobile menu */}
            <div className="lg:hidden dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <FiMenu size={20} />
              </label>
              <div
                tabIndex={0}
                className="dropdown-content mt-2 p-2 shadow bg-base-100 text-base-content rounded-box w-64"
              >
                <ul className="menu">
                  {(user ? loggedInTopLinks : publicLinks).map((l) => (
                    <li key={l.to}>
                      <NavLink
                        className={({ isActive }) =>
                          `${linkBase} ${isActive ? linkActive : ""}`
                        }
                        to={l.to}
                        end={l.end}
                      >
                        {l.label}
                      </NavLink>
                    </li>
                  ))}
                  {user && (
                    <>
                      <li className="menu-title mt-2">Dashboard</li>
                      {dashboardProtected.map((d) => (
                        <li key={d.to}>
                          <NavLink
                            className={({ isActive }) =>
                              `${linkBase} ${isActive ? linkActive : ""}`
                            }
                            to={d.to}
                          >
                            {d.label}
                          </NavLink>
                        </li>
                      ))}
                      <li className="mt-2">
                        <button
                          className="btn btn-outline w-full"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  )}
                  {!user && (
                    <li className="mt-2 flex gap-2">
                      <Link
                        to="/login"
                        className="btn btn-outline btn-sm flex-1"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="btn btn-primary btn-sm flex-1"
                      >
                        Register
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            {/* /Mobile */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
