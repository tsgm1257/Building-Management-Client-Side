import { useContext } from "react";
import { NavLink, Link } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import { FiMenu } from "react-icons/fi";

const linkBase =
  "px-3 py-2 text-sm md:text-base transition-colors duration-200";
const linkHover = "hover:opacity-90";
const linkActive =
  "relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-secondary";

const NavA = ({ to, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `${linkBase} ${linkHover} ${isActive ? linkActive : ""}`
    }
  >
    {label}
  </NavLink>
);

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

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
                className="w-9 h-9 md:w-10 md:h-10"
              />
              <span>My Building</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center gap-4 font-medium">
            <NavA to="/" label="Home" end />
            <NavA to="/apartments" label="Apartment" />
            {!user && (
              // anchor to your About section so it’s not a dead route
              <a href="/#about" className={`${linkBase} ${linkHover}`}>
                About
              </a>
            )}
          </div>

          {/* Right: Desktop User/Profile */}
          <div className="hidden md:flex flex-none items-center gap-3">
            {!user ? (
              <Link
                to="/login"
                className="btn btn-outline btn-sm hover:opacity-90"
              >
                <img
                  src="https://i.ibb.co/Q3YR2xSn/default-user.png"
                  alt="Login"
                  className="w-7 h-7 rounded-full"
                />
                <span className="hidden lg:inline">Login</span>
              </Link>
            ) : (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-outline btn-sm btn-circle avatar hover:opacity-90"
                >
                  <div className="w-9 h-9 rounded-full">
                    <img
                      src={
                        user.photoURL ||
                        "https://i.ibb.co/Q3YR2xSn/default-user.png"
                      }
                      alt="Profile"
                      className="object-cover"
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[60] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded w-60"
                >
                  <li className="pointer-events-none">
                    <span className="font-semibold truncate">
                      {user.displayName}
                    </span>
                  </li>

                  {/* 5 protected links */}
                  <li>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : ""}`
                      }
                    >
                      Overview
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/user/profile"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : ""}`
                      }
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/member/make-payment"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : ""}`
                      }
                    >
                      Make Payment
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/member/payment-history"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : ""}`
                      }
                    >
                      Payment History
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/announcements"
                      className={({ isActive }) =>
                        `${linkBase} ${isActive ? linkActive : ""}`
                      }
                    >
                      Announcements
                    </NavLink>
                  </li>

                  <li className="pt-1">
                    <button
                      onClick={handleLogout}
                      className="btn btn-primary btn-sm w-full hover:opacity-90"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Right: Mobile Hamburger */}
          <div className="md:hidden ml-auto">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-outline btn-circle hover:opacity-90"
              >
                <FiMenu className="text-2xl" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content mt-3 z-[60] p-3 shadow menu menu-sm bg-base-100 text-base-content rounded w-72 space-y-1"
              >
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : ""}`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/apartments"
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : ""}`
                    }
                  >
                    Apartment
                  </NavLink>
                </li>
                {!user && (
                  <li>
                    <a href="/#about" className={`${linkBase} ${linkHover}`}>
                      About
                    </a>
                  </li>
                )}

                <li className="flex items-center gap-3 px-2 py-2">
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co/Q3YR2xSn/default-user.png"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">
                    {user ? user.displayName : "Guest"}
                  </span>
                </li>

                {!user ? (
                  <li className="pt-1">
                    <Link
                      to="/login"
                      className="btn btn-primary w-full hover:opacity-90"
                    >
                      Login
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          `${linkBase} ${isActive ? linkActive : ""}`
                        }
                      >
                        Overview
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/user/profile"
                        className={({ isActive }) =>
                          `${linkBase} ${isActive ? linkActive : ""}`
                        }
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/member/make-payment"
                        className={({ isActive }) =>
                          `${linkBase} ${isActive ? linkActive : ""}`
                        }
                      >
                        Make Payment
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/member/payment-history"
                        className={({ isActive }) =>
                          `${linkBase} ${isActive ? linkActive : ""}`
                        }
                      >
                        Payment History
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/announcements"
                        className={({ isActive }) =>
                          `${linkBase} ${isActive ? linkActive : ""}`
                        }
                      >
                        Announcements
                      </NavLink>
                    </li>
                    <li className="pt-1">
                      <button
                        onClick={handleLogout}
                        className="btn btn-primary w-full hover:opacity-90"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          {/* /mobile */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
