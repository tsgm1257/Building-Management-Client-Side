import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, Link } from "react-router";
import Section from "../components/Section";
import Container from "../components/Container";

const API_URL = import.meta.env.VITE_API_URL;

const ApartmentDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const aptFromState = location.state?.apt;

  const [apt, setApt] = useState(aptFromState || null);
  const [loading, setLoading] = useState(!aptFromState);
  const [error, setError] = useState("");

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

            <div className="mt-6 flex gap-3">
              <Link
                to="/apartments"
                className="btn btn-outline hover:opacity-90"
              >
                Back to All
              </Link>
              <a
                href="/dashboard/make-payment"
                className="btn btn-primary hover:opacity-90"
              >
                Proceed to Payment
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ApartmentDetails;
