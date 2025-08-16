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
    // If we already have the apt via state, skip fetching
    if (aptFromState) return;

    const run = async () => {
      try {
        // Try an id endpoint first (if your backend adds one in the future)
        let res = await fetch(`${API_URL}/api/apartments/${id}`);
        if (res.ok) {
          const data = await res.json();
          setApt(data);
          setLoading(false);
          return;
        }
        // Fallback: fetch all and find locally
        res = await fetch(`${API_URL}/api/apartments`);
        const data = await res.json();
        const list = data?.apartments || data || [];
        const found = list.find((x) => String(x._id) === String(id));
        if (!found) throw new Error("Not found");
        setApt(found);
        setLoading(false);
      } catch (e) {
        setError("Failed to load apartment details.");
        setLoading(false);
      }
    };
    run();
  }, [API_URL, id, aptFromState]);

  const title = useMemo(() => {
    if (!apt) return "Apartment Details";
    return `Block ${apt.block} • Apt ${apt.number}`;
  }, [apt]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12">{error}</div>;

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
              <p><span className="font-medium">Floor:</span> {apt.floor}</p>
              <p><span className="font-medium">Monthly Rent:</span> {apt.rent?.toLocaleString()} ৳</p>
              <p><span className="font-medium">Block:</span> {apt.block}</p>
              <p><span className="font-medium">Apartment No:</span> {apt.number}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/apartments" className="btn btn-outline hover:opacity-90">Back to All</Link>
              <a href="/dashboard/member/make-payment" className="btn btn-primary hover:opacity-90">Proceed to Payment</a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default ApartmentDetails;
