// src/pages/auth/Register.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate, Link } from "react-router"; // switch to 'react-router-dom' if needed
import toast from "react-hot-toast";

export default function Register() {
  const { register, updateUserProfile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const photoURL = form.photoURL.value.trim();

    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
    if (!passwordValid) {
      toast.error("Password must include uppercase, lowercase, and be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(email, password);
      await updateUserProfile({ displayName: name, photoURL });

      const token = await result.user.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL;

      const res = await fetch(`${apiUrl}/api/users`, {
        method: "PUT", // upsert if your backend expects PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, photoURL, role: "user" }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${res.status} - ${text}`);
      }

      form.reset();
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      const msg = err?.message || "Something went wrong";
      setError(`Registration failed: ${msg}`);
      toast.error(`Registration failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // DO NOT add container paddings here; MainLayout already aligns content site-wide.
    <section className="py-10"> 
      <div className="mx-auto w-full max-w-lg">
        <div className="card bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body">
            <h1 className="text-center text-2xl font-bold text-base-content">
              Create your account
            </h1>

            {error && (
              <div className="alert alert-error mt-4 rounded-xl">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="e.g., Tanzeem Siddique"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Photo URL (optional)</span>
                </label>
                <input
                  type="url"
                  name="photoURL"
                  className="input input-bordered rounded-xl w-full"
                  placeholder="https://…"
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                  <span className="label-text-alt">A–Z, a–z, ≥6 chars</span>
                </label>
                <div className="join w-full">
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    className="input input-bordered join-item w-full rounded-l-xl"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline join-item rounded-r-xl"
                    onClick={() => setShowPw((s) => !s)}
                    disabled={isLoading}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full rounded-xl ${isLoading ? "btn-disabled" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Registering…" : "Register"}
              </button>
            </form>

            <p className="text-sm mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* consistent page spacing */}
        <div className="h-12" />
      </div>
    </section>
  );
}
