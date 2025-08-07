import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="navbar bg-base-100 px-4">
      {/* Left: Logo */}
      <div className="flex-none">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <img
            src="https://i.ibb.co/4wK6q5DH/logo.png"
            alt="Logo"
            className="w-10 h-10"
          />
          My Building
        </Link>
      </div>

      {/* Center: Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-center gap-6 font-medium text-lg">
        <Link to="/">Home</Link>
        <Link to="/apartments">Apartment</Link>
      </div>

      {/* Right: Desktop User/Profile */}
      <div className="hidden md:flex flex-none items-center">
        {!user ? (
          <Link to="/login" className="btn btn-ghost">
            <img
              src="https://i.ibb.co/Q3YR2xSn/default-user.png"
              alt="Login"
              className="w-8 h-8 rounded-full"
            />
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    user.photoURL ||
                    "https://i.ibb.co/Q3YR2xSn/default-user.png"
                  }
                  alt="Profile"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded w-52"
            >
              <li>
                <span className="font-semibold">{user.displayName}</span>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Right: Mobile Hamburger */}
      <div className="md:hidden ml-auto">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <FiMenu className="text-2xl" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content mt-3 z-[1] p-3 shadow menu menu-sm bg-base-100 rounded w-64 space-y-2"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/apartments">Apartment</Link>
            </li>
            <li className="flex items-center gap-3 px-2 py-1">
              <img
                src={
                  user?.photoURL || "https://i.ibb.co/Q3YR2xSn/default-user.png"
                }
                alt="User"
                className="w-12 h-12 rounded-full"
              />
              <span className="font-medium">
                {user ? user.displayName : "Guest"}
              </span>
            </li>

            {!user ? (
              <li>
                <Link to="/login">Login</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
