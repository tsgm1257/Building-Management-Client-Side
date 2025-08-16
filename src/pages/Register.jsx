import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Section from "../components/Section";
import Container from "../components/Container";
import { AuthContext } from "../providers/AuthProvider";

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await registerUser(email, password, name);
      navigate("/dashboard", { replace: true });
    } catch {
      // handle error UI
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section>
      <Container>
        <div className="max-w-md mx-auto bg-base-100 rounded-xl border border-base-300 p-6 shadow">
          <h1 className="text-2xl font-bold text-center mb-4">
            Create account
          </h1>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input input-bordered w-full"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input input-bordered w-full"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full ${
                busy ? "btn-disabled" : "hover:opacity-90"
              }`}
              disabled={busy}
            >
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-hover">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
};

export default Register;
