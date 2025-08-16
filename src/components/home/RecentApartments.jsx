import { useEffect, useState } from "react";
import Section from "../../components/Section";
import Container from "../../components/Container";
import SectionHeading from "../../components/SectionHeading";
import Card from "../../components/Card";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

const RecentApartments = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_URL}/api/apartments`);
        const data = await res.json();
        const apartments = data?.apartments || data || [];
        setItems(apartments.slice(-6)); // last 6 as "recent"
      } catch {
        setItems([]);
      }
    };
    run();
  }, []);

  return (
    <Section>
      <Container>
        <SectionHeading
          title="Recently Added"
          subtitle="Fresh listings you might have missed"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((apt) => (
            <Card
              key={apt._id}
              image={apt.image}
              title={`Block ${apt.block} • Apt ${apt.number}`}
              footer={
                <Link
                  to={`/apartments`}
                  className="btn btn-outline btn-sm w-full"
                >
                  See more
                </Link>
              }
            >
              <p className="line-clamp-2">
                Floor: {apt.floor} • Monthly Rent: {apt.rent?.toLocaleString()}{" "}
                ৳
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default RecentApartments;
