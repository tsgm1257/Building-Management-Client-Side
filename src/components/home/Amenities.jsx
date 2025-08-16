import Section from "../../components/Section";
import Container from "../../components/Container";
import SectionHeading from "../../components/SectionHeading";
import Card from "../../components/Card";

const items = [
  { t: "Security", d: "24/7 surveillance and gated access.", i: "https://i.ibb.co/kqS3q7M/security.jpg" },
  { t: "Green Spaces", d: "Landscaped courtyard and rooftop garden.", i: "https://i.ibb.co/VVjJcHC/green.jpg" },
  { t: "Parking", d: "Covered parking with EV charging.", i: "https://i.ibb.co/CwGN4bG/parking.jpg" },
];

const Amenities = () => (
  <Section>
    <Container>
      <SectionHeading title="Amenities & Services" subtitle="Everything you need, in one place" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((x, idx) => (
          <Card key={idx} image={x.i} title={x.t}>
            <p>{x.d}</p>
          </Card>
        ))}
      </div>
    </Container>
  </Section>
);

export default Amenities;
