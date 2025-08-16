import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [agreement, setAgreement] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        if (!API_URL) throw new Error("VITE_API_URL is not defined");
        const token = await user.getIdToken();

        // Fetch user role
        const roleRes = await fetch(`${API_URL}/api/users/role`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (roleRes.ok) {
          const roleData = await roleRes.json();
          setUserRole(roleData.role);
        }

        // Fetch agreement data
        const agreementRes = await fetch(`${API_URL}/api/agreements/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (agreementRes.ok) {
          const agreementData = await agreementRes.json();
          setAgreement(agreementData);
        } else if (agreementRes.status === 404) {
          setAgreement(null); // normal when no agreement
        } else {
          throw new Error(`HTTP error! status: ${agreementRes.status}`);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-center">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

      <div className="flex flex-col items-center text-center space-y-4">
        <img
          src={user?.photoURL || "https://i.ibb.co/Q3YR2xSn/default-user.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border border-primary"
          onError={(e) => {
            e.currentTarget.src = "https://i.ibb.co/Q3YR2xSn/default-user.png";
          }}
        />
        <div>
          <h3 className="text-xl font-semibold">
            {user?.displayName || "No Name"}
          </h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-base-200 rounded shadow">
          <p className="font-medium">Agreement Accepted On</p>
          <p className="text-sm text-gray-500">
            {userRole === "member" &&
            agreement &&
            agreement.status === "checked"
              ? agreement.acceptedAt
                ? new Date(agreement.acceptedAt).toLocaleDateString()
                : new Date(agreement.requestDate).toLocaleDateString()
              : "Not Available"}
          </p>
        </div>

        <div className="p-4 bg-base-200 rounded shadow">
          <p className="font-medium">Floor</p>
          <p className="text-sm text-gray-500">
            {agreement ? agreement.floor : "None"}
          </p>
        </div>

        <div className="p-4 bg-base-200 rounded shadow">
          <p className="font-medium">Block</p>
          <p className="text-sm text-gray-500">
            {agreement ? agreement.block : "None"}
          </p>
        </div>

        <div className="p-4 bg-base-200 rounded shadow">
          <p className="font-medium">Apartment No</p>
          <p className="text-sm text-gray-500">
            {agreement ? agreement.number : "None"}
          </p>
        </div>

        <div className="p-4 bg-base-200 rounded shadow">
          <p className="font-medium">Monthly Rent</p>
          <p className="text-sm text-gray-500">
            {agreement ? `${agreement.rent}৳` : "None"}
          </p>
        </div>
      </div>

      {agreement && userRole === "member" && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-green-800 mb-2">
            Agreement Details
          </h4>
          <div className="text-sm text-green-700">
            <p>
              <strong>Requested On:</strong>{" "}
              {new Date(agreement.requestDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> Floor {agreement.floor}, Block{" "}
              {agreement.block}, Room {agreement.number}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
