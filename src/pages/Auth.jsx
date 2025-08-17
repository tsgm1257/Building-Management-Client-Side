// src/pages/Auth.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import Container from "../components/Container";

const Auth = () => {
  const { register, updateUserProfile, login, loginWithGoogle } =
    useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await login(email, password);
      toast.success("Logged in!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Login failed");
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target;
    const name = form.name.value;
    const email = form.reg_email.value;
    const password = form.reg_password.value;
    const photoURL = form.photoURL.value;

    const isValid = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
    if (!isValid) {
      setIsLoading(false);
      toast.error(
        "Password must include uppercase, lowercase, and be at least 6 characters"
      );
      return;
    }

    try {
      const res = await register(email, password);
      await updateUserProfile({ displayName: name, photoURL });
      toast.success("Account created!");
      navigate("/");
      return res;
    } catch (err) {
      console.error(err);
      setError(err?.message || "Registration failed");
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-in
  const handleGoogle = async () => {
    setIsLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Google sign-in failed");
      toast.error("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Login */}
          <div className="card bg-base-100 shadow-md rounded-2xl">
            <form className="card-body" onSubmit={handleLogin}>
              <h2 className="card-title text-2xl">Login</h2>

              <label className="form-control">
                <span className="label-text">Email</span>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </label>

              <label className="form-control">
                <span className="label-text">Password</span>
                <input
                  name="password"
                  type="password"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary rounded-xl mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Login"}
              </button>

              <div className="divider">or</div>

              <button
                type="button"
                onClick={handleGoogle}
                className="btn rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Sign in with Google"}
              </button>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>

          {/* Right: Register */}
          <div className="card bg-base-100 shadow-md rounded-2xl">
            <form className="card-body" onSubmit={handleRegister}>
              <h2 className="card-title text-2xl">Register</h2>

              <label className="form-control">
                <span className="label-text">Full Name</span>
                <input
                  name="name"
                  type="text"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="Your name"
                  required
                  disabled={isLoading}
                />
              </label>

              <label className="form-control">
                <span className="label-text">Email</span>
                <input
                  name="reg_email"
                  type="email"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </label>

              <label className="form-control">
                <span className="label-text">Password</span>
                <input
                  name="reg_password"
                  type="password"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="At least 6 chars, A–Z and a–z"
                  required
                  disabled={isLoading}
                />
              </label>

              <label className="form-control">
                <span className="label-text">Photo URL (optional)</span>
                <input
                  name="photoURL"
                  type="url"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="https://..."
                  disabled={isLoading}
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary rounded-xl mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create account"}
              </button>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Auth;
