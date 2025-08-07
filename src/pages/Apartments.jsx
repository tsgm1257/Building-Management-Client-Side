import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import { useApartments } from "../hooks/useApartments";
import toast from "react-hot-toast";
import { FaMoneyBillWave, FaRegHandshake } from "react-icons/fa";

const Apartments = () => {
  const [page, setPage] = useState(1);
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [tempMinRent, setTempMinRent] = useState("");
  const [tempMaxRent, setTempMaxRent] = useState("");
  const [submittedIds, setSubmittedIds] = useState([]);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data, isLoading } = useApartments({ page, minRent, maxRent });

  const handleSearch = (e) => {
    e.preventDefault();
    setMinRent(tempMinRent);
    setMaxRent(tempMaxRent);
    setPage(1);
  };

  const handleAgreement = async (apartment) => {
    if (!user) return navigate("/login");

    try {
      const token = await user.getIdToken();
      const res = await fetch(
        "https://building-management-server-woad-two.vercel.app/api/agreements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userName: user.displayName,
            userEmail: user.email,
            floor: apartment.floor,
            block: apartment.block,
            number: apartment.number,
            rent: apartment.rent,
            status: "pending",
          }),
        }
      );

      if (res.ok) {
        toast.success("Agreement request submitted!");
        setSubmittedIds((prev) => [...prev, apartment._id]);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to submit request");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (isLoading)
    return <p className="text-center mt-12">Loading apartments...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Available Apartments
      </h2>

      {/* Rent Filter */}
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap gap-4 mb-8 justify-center"
      >
        <input
          type="number"
          placeholder="Min Rent"
          className="input input-bordered w-40"
          value={tempMinRent}
          onChange={(e) => setTempMinRent(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Rent"
          className="input input-bordered w-40"
          value={tempMaxRent}
          onChange={(e) => setTempMaxRent(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Apartment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.apartments?.map((apt) => (
          <div
            key={apt._id}
            className="border rounded-lg shadow p-4 bg-base-100"
          >
            <img
              src={apt.image}
              alt="Apartment"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p>
              <span className="font-semibold">Floor:</span> {apt.floor}
            </p>
            <p>
              <span className="font-semibold">Block:</span> {apt.block}
            </p>
            <p>
              <span className="font-semibold">Apartment No:</span> {apt.number}
            </p>
            <p className="font-bold mt-2 flex items-center gap-2 text-green-700">
              <FaMoneyBillWave /> {apt.rent.toLocaleString()} ৳
            </p>

            <button
              onClick={() => handleAgreement(apt)}
              className={`btn btn-outline btn-sm mt-4 w-full flex items-center justify-center gap-2 ${
                submittedIds.includes(apt._id) ? "btn-disabled" : "btn-primary"
              }`}
            >
              <FaRegHandshake />
              {submittedIds.includes(apt._id)
                ? "Request Sent"
                : "Apply for Agreement"}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.total > 6 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          {Array.from({ length: Math.ceil(data.total / 6) }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                page === i + 1 ? "btn-active btn-primary" : "btn-outline"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Apartments;
