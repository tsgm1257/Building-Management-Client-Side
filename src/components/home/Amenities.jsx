import Section from "../../components/Section";
import Container from "../../components/Container";
import SectionHeading from "../../components/SectionHeading";
import Card from "../../components/Card";
import { FaLock, FaLeaf, FaParking } from "react-icons/fa";

const items = [
  {
    t: "Security",
    d: "Round-the-clock protection with gated entry and smart access control. Our on-site team and digital systems work together to keep residents and property safe.",
    points: [
      "CCTV coverage at all entry/exit points and corridors",
      "Smart intercom and visitor logs for traceability",
      "Fire alarms, extinguishers, and regular safety drills",
    ],
    icon: FaLock,
  },
  {
    t: "Green Spaces",
    d: "Sustainable living woven into daily life—from fresh rooftop greenery to responsible water and waste management that reduces our environmental footprint.",
    points: [
      "Rooftop garden and landscaped courtyard for relaxation",
      "Rainwater harvesting and efficient irrigation",
      "Waste segregation and recycling initiatives",
    ],
    icon: FaLeaf,
  },
  {
    t: "Parking",
    d: "Convenient, resident-first parking designed for modern needs, including electric vehicle support and secure storage for bicycles.",
    points: [
      "Covered, numbered parking slots for residents",
      "EV charging stations (Level-2) for compatible vehicles",
      "Dedicated bicycle stands and visitor parking zones",
    ],
    icon: FaParking,
  },
];

const Amenities = () => (
  <Section>
    <Container>
      <SectionHeading
        title="Amenities & Services"
        subtitle="Everything you need, in one place"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((x, idx) => {
          const Icon = x.icon;
          return (
            <Card key={idx} title={x.t}>
              <div className="flex items-start gap-3 text-left">
                <Icon className="text-secondary text-3xl shrink-0 mt-1" />
                <div>
                  <p className="text-base-content/80">{x.d}</p>
                  <ul className="list-disc pl-5 mt-3 space-y-1 text-base-content/70">
                    {x.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  </Section>
);

export default Amenities;
