// src/pages/ApartmentDetails.jsx
import { useEffect, useMemo, useState, useContext } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router";
import Container from "../components/Container";
import Section from "../components/Section";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ApartmentDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const aptFromState = location.state?.apt;

  const { user, role } = useContext(AuthContext);

  const [apt, setApt] = useState(aptFromState || null);
  const [loading, setLoading] = useState(!aptFromState);
  const [error, setError] = useState("");
  const [requested, setRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (aptFromState) return;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/apartments/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setApt(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load apartment details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, aptFromState]);

  const title = useMemo(() => {
    if (!apt) return "Apartment Details";
    return `Block ${apt.block} • Apt ${apt.number}`;
  }, [apt]);

  const handleApplyAgreement = async () => {
    try {
      if (!user) {
        toast.error("Please log in to apply");
        navigate("/auth");
        return;
      }
      if (!apt) return;
      if (!API_URL) throw new Error("VITE_API_URL is not defined");

      setSubmitting(true);
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

      setRequested(true);
      toast.success("Agreement request submitted");
    } catch (err) {
      console.error("Agreement request failed:", err);
      toast.error(err?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12">{error}</div>;
  if (!apt) return <div className="text-center py-12">Not found.</div>;

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={apt.image}
              alt={title}
              className="w-full h-72 md:h-96 object-cover rounded-xl shadow"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Floor:</span> {apt.floor}
              </p>
              <p>
                <span className="font-medium">Monthly Rent:</span>{" "}
                {apt.rent?.toLocaleString()} ৳
              </p>
              <p>
                <span className="font-medium">Block:</span> {apt.block}
              </p>
              <p>
                <span className="font-medium">Apartment No:</span> {apt.number}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/apartments" className="btn btn-outline">
                Back to All
              </Link>

              {/* If role is "member" -> Pay (go to dashboard make-payment).
                  If role is "user" -> Apply (create agreement). */}
              {role === "member" ? (
                <Link to="/dashboard/make-payment" className="btn btn-neutral">
                  Pay
                </Link>
              ) : (
                <button
                  className={`btn btn-neutral ${
                    requested || submitting ? "btn-disabled" : ""
                  }`}
                  onClick={handleApplyAgreement}
                  disabled={requested || submitting}
                >
                  {requested
                    ? "Request Sent"
                    : submitting
                    ? "Submitting..."
                    : "Apply"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ApartmentDetails;
