import { useContext, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import Section from "../components/Section";
import Container from "../components/Container";
import { AuthContext } from "../providers/AuthProvider";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch {
      // handle error UI if you like
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section>
      <Container>
        <div className="max-w-md mx-auto bg-base-100 rounded-xl border border-base-300 p-6 shadow">
          <h1 className="text-2xl font-bold text-center mb-4">Welcome back</h1>
          <form onSubmit={onSubmit} className="grid gap-4">
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
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full ${
                busy ? "btn-disabled" : "hover:opacity-90"
              }`}
              disabled={busy}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            New here?{" "}
            <Link to="/register" className="link link-hover">
              Create an account
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
};

export default Login;
