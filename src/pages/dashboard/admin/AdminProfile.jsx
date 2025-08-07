import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaBuilding, FaUsers } from "react-icons/fa";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["adminSummary"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(
        "https://building-management-server-woad-two.vercel.app/api/admin/summary",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.json();
    },
  });

  if (isLoading)
    return <p className="text-center mt-8">Loading profile summary...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Profile</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6 bg-base-200 p-6 rounded-lg shadow-md mb-8">
        <img
          src={user.photoURL || "https://i.ibb.co/Q3YR2xSn/default-user.png"}
          alt="Admin"
          className="w-24 h-24 rounded-full object-cover border-4 border-base-300"
        />
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold">
            {user.displayName || "Admin"}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className="badge badge-accent mt-2">Role: Admin</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-100 border border-base-300 rounded-lg p-5 shadow">
          <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
            <FaBuilding className="text-primary" />
            <span>Apartment Overview</span>
          </div>
          <p>
            Total Rooms: <span className="font-bold">{stats.totalRooms}</span>
          </p>
          <p>
            Available:{" "}
            <span className="font-bold">{stats.availablePercentage}%</span>
          </p>
          <p>
            Rented: <span className="font-bold">{stats.rentedPercentage}%</span>
          </p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-lg p-5 shadow">
          <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
            <FaUsers className="text-primary" />
            <span>Users Summary</span>
          </div>
          <p>
            Total Users: <span className="font-bold">{stats.totalUsers}</span>
          </p>
          <p>
            Total Members:{" "}
            <span className="font-bold">{stats.totalMembers}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
