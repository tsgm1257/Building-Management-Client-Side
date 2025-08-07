import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";

const Register = () => {
  const { register, updateUserProfile } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photoURL = form.photoURL.value;

    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
    if (!passwordValid) {
      toast.error(
        "Password must include uppercase, lowercase, and be at least 6 characters"
      );
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Create user in Firebase
      console.log("Creating user in Firebase...");
      const result = await register(email, password);

      // Step 2: Update Firebase profile
      console.log("Updating Firebase profile...");
      await updateUserProfile({ displayName: name, photoURL });

      // Step 3: Get token and save to database
      console.log("Getting token...");
      const token = await result.user.getIdToken();

      console.log("Saving user to database...");
      const response = await fetch(
        "https://building-management-server-woad-two.vercel.app/api/users",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            photoURL,
            role: "user",
          }),
        }
      );

      // Check if the database save was successful
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Database save failed: ${response.status} - ${errorData}`
        );
      }

      const dbResult = await response.json();
      console.log("Database save result:", dbResult);

      form.reset();
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed: " + err.message);
      toast.error("Registration failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input w-full mb-4"
          required
          disabled={isLoading}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input w-full mb-4"
          required
          disabled={isLoading}
        />
        <input
          type="text"
          name="photoURL"
          placeholder="Photo URL"
          className="input w-full mb-4"
          disabled={isLoading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input w-full mb-4"
          required
          disabled={isLoading}
        />
        <button
          className="btn w-full bg-green-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
