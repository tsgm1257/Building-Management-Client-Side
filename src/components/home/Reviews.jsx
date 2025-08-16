import Section from "../../components/Section";
import Container from "../../components/Container";
import SectionHeading from "../../components/SectionHeading";
import Card from "../../components/Card";

const reviews = [
  { n: "Aisha M.", t: "Smooth move-in and great support.", r: 5 },
  { n: "Rahim K.", t: "Clean, quiet, and secure.", r: 5 },
  { n: "J. Patel", t: "Maintenance is quick to respond.", r: 4 },
];

const Reviews = () => (
  <Section>
    <Container>
      <SectionHeading title="Resident Reviews" subtitle="Real feedback from our community" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((x, idx) => (
          <Card key={idx} title={`${x.n} • ${"★".repeat(x.r)}`}>
            <p>{x.t}</p>
          </Card>
        ))}
      </div>
    </Container>
  </Section>
);

export default Reviews;
