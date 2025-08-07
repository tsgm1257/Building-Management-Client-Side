import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate, Link } from "react-router";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { app } from "../firebase/firebase.config";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await login(email, password);
      toast.success("Login successful!");
      form.reset();
      navigate("/");
    } catch (err) {
      setError("Login failed: " + err.message);
      toast.error("Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save to database
      const token = await user.getIdToken();
      await fetch("https://building-management-server-woad-two.vercel.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: "user", // default
        }),
      });

      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input w-full mb-4"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input w-full mb-4"
          required
        />
        <button className="btn w-full bg-blue-600 text-white">Login</button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="btn w-full mt-4 bg-red-500 text-white"
      >
        Continue with Google
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="text-sm mt-4 text-center">
        New here?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
