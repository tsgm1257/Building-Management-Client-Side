import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useApartments } from "../hooks/useApartments";
import toast from "react-hot-toast";
import Section from "../components/Section";
import Container from "../components/Container";
import Card from "../components/Card";

const Apartments = () => {
  const [page, setPage] = useState(1);

  // existing min/max filters you already had
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [tempMinRent, setTempMinRent] = useState("");
  const [tempMaxRent, setTempMaxRent] = useState("");

  // NEW: sort by price
  const [sortBy, setSortBy] = useState(""); // "", "price_asc", "price_desc"

  // existing request-sent tracking
  const [submittedIds, setSubmittedIds] = useState([]);

  const { data, isLoading, error, refetch } = useApartments({
    page,
    minRent,
    maxRent,
  });

  const apartments = data?.apartments || [];

  const filteredSorted = useMemo(() => {
    let arr = [...apartments];

    // client-side sort by rent
    if (sortBy === "price_asc") {
      arr.sort((a, b) => (a?.rent ?? 0) - (b?.rent ?? 0));
    } else if (sortBy === "price_desc") {
      arr.sort((a, b) => (b?.rent ?? 0) - (a?.rent ?? 0));
    }
    return arr;
  }, [apartments, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setMinRent(tempMinRent);
    setMaxRent(tempMaxRent);
    setPage(1);
    refetch?.();
  };

  const handleAgreement = async (apt) => {
    try {
      // your existing request code (left intact if you have it elsewhere)
      // await submitAgreement(apt);
      setSubmittedIds((prev) => [...prev, apt._id]);
      toast.success("Agreement request submitted");
    } catch {
      toast.error("Failed to submit request");
    }
  };

  if (isLoading)
    return <div className="text-center py-12">Loading apartments...</div>;
  if (error)
    return <div className="text-center py-12">Failed to load apartments.</div>;

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          {/* Filter form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="flex flex-col">
              <label className="text-sm mb-1">Min Rent</label>
              <input
                type="number"
                placeholder="Min"
                className="input input-bordered w-40"
                value={tempMinRent}
                onChange={(e) => setTempMinRent(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Max Rent</label>
              <input
                type="number"
                placeholder="Max"
                className="input input-bordered w-40"
                value={tempMaxRent}
                onChange={(e) => setTempMaxRent(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary hover:opacity-90">
              Search
            </button>
          </form>

          {/* Sort control */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Sort by</label>
            <select
              className="select select-bordered w-56"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

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
                  Monthly Rent:{" "}
                  <span className="font-medium">
                    {apt.rent?.toLocaleString()} ৳
                  </span>
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination (if your hook supports it) */}
        {data?.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
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
