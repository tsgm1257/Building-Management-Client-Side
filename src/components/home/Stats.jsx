import Section from "../../components/Section";
import Container from "../../components/Container";
import SectionHeading from "../../components/SectionHeading";

const items = [
  { k: "Total Apartments", v: "120" },
  { k: "Available Now", v: "24" },
  { k: "Happy Residents", v: "300+" },
];

const Stats = () => (
  <Section>
    <Container>
      <SectionHeading title="At a Glance" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((x) => (
          <div
            key={x.k}
            className="rounded-xl border border-base-300 bg-base-100 p-6 text-center shadow"
          >
            <div className="text-3xl font-bold">{x.v}</div>
            <div className="mt-1 text-sm text-base-content/70">{x.k}</div>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);

export default Stats;
