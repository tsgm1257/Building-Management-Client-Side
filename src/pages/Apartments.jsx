// src/pages/Apartments.jsx
import { useState, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { useApartments } from "../hooks/useApartments";
import toast from "react-hot-toast";
import Section from "../components/Section";
import Container from "../components/Container";
import Card from "../components/Card";
import { AuthContext } from "../providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const Apartments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  // existing min/max filters you already had
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [tempMinRent, setTempMinRent] = useState("");
  const [tempMaxRent, setTempMaxRent] = useState("");

  // new sort state (kept simple; default 'recent')
  const [sortBy, setSortBy] = useState("recent");

  // track which apartments the user already submitted requests for
  const [submittedIds, setSubmittedIds] = useState([]);

  const { data, isLoading, error, refetch } = useApartments({
    page,
    minRent,
    maxRent,
  });

  const apartments = Array.isArray(data?.apartments)
    ? data.apartments
    : Array.isArray(data)
    ? data
    : [];

  const filteredSorted = useMemo(() => {
    let arr = [...apartments];

    if (minRent) arr = arr.filter((a) => Number(a.rent) >= Number(minRent));
    if (maxRent) arr = arr.filter((a) => Number(a.rent) <= Number(maxRent));

    if (sortBy === "high") {
      arr.sort((a, b) => Number(b.rent) - Number(a.rent));
    } else if (sortBy === "low") {
      arr.sort((a, b) => Number(a.rent) - Number(b.rent));
    } else {
      // "recent" — assume newer first by createdAt (fallback to _id)
      arr.sort((a, b) => {
        const tA = new Date(a.createdAt || 0).getTime() || 0;
        const tB = new Date(b.createdAt || 0).getTime() || 0;
        return tB - tA;
      });
    }
    return arr;
  }, [apartments, sortBy, minRent, maxRent]);

  const handleSearch = (e) => {
    e.preventDefault();
    setMinRent(tempMinRent);
    setMaxRent(tempMaxRent);
    setPage(1);
    refetch?.();
  };

  // REAL agreement creation (POST)
  const handleAgreement = async (apt) => {
    try {
      if (!user) {
        toast.error("Please log in to apply");
        navigate("/auth");
        return;
      }
      if (!API_URL) throw new Error("VITE_API_URL is not defined");
      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/agreements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          apartmentId: apt._id,
          block: apt.block,
          number: apt.number,
          floor: apt.floor,
          rent: apt.rent,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed with status ${res.status}`);
      }

      setSubmittedIds((prev) => [...prev, apt._id]);
      toast.success("Agreement request submitted");
    } catch (err) {
      console.error("Agreement request failed:", err);
      toast.error(err?.message || "Failed to submit request");
    }
  };

  if (isLoading)
    return <div className="text-center py-12">Loading apartments...</div>;
  if (error)
    return <div className="text-center py-12">Failed to load apartments.</div>;

  return (
    <Section>
      <Container>
        {/* Filters + sort */}
        <form
          onSubmit={handleSearch}
          className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input
            type="number"
            min="0"
            value={tempMinRent}
            onChange={(e) => setTempMinRent(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Min rent"
          />
          <input
            type="number"
            min="0"
            value={tempMaxRent}
            onChange={(e) => setTempMaxRent(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Max rent"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="recent">Sort: Recent</option>
            <option value="low">Sort: Price (Low → High)</option>
            <option value="high">Sort: Price (High → Low)</option>
          </select>

          <button type="submit" className="btn btn-primary w-full">
            Apply Filters
          </button>
        </form>

        {/* Apartment Grid - uniform cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSorted.map((apt) => (
            <Card
              key={apt._id}
              image={apt.image}
              title={`Block ${apt.block} • Apt ${apt.number}`}
              footer={
                <div className="flex gap-2">
                  <Link
                    to={`/apartments/${apt._id}`}
                    state={{ apt }} // pass data for instant details render
                    className="btn btn-outline btn-sm flex-1 hover:opacity-90"
                  >
                    See more
                  </Link>
                  <button
                    onClick={() => handleAgreement(apt)}
                    className={`btn btn-primary btn-sm flex-1 hover:opacity-90 ${
                      submittedIds.includes(apt._id) ? "btn-disabled" : ""
                    }`}
                    disabled={submittedIds.includes(apt._id)}
                  >
                    {submittedIds.includes(apt._id) ? "Request Sent" : "Apply"}
                  </button>
                </div>
              }
            >
              <div className="space-y-1 min-h-[48px]">
                <p className="text-sm">
                  Floor: <span className="font-medium">{apt.floor}</span>
                </p>
                <p className="text-sm">
                  Rooms: <span className="font-medium">{apt.size}</span>
                </p>
                <p className="text-sm">
                  Rent:{" "}
                  <span className="font-semibold">
                    {apt.rent}
                    <span className="opacity-70">৳/mo</span>
                  </span>
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {data?.totalPages && data.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-sm">
              Page <span className="font-semibold">{page}</span> /{" "}
              {data.totalPages}
            </span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default Apartments;
