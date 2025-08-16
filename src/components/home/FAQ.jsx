import Section from "../../components/Section";
import Container from "../../components/Container";
import SectionHeading from "../../components/SectionHeading";

const faqs = [
  { q: "How do I request an agreement?", a: "Open an apartment card and click 'Apply for Agreement'." },
  { q: "How are payments handled?", a: "Use the dashboard: Make Payment and Payment History sections." },
  { q: "Do you support dark mode?", a: "Yes—follows your system preference and can be toggled." },
];

const FAQ = () => (
  <Section>
    <Container>
      <SectionHeading title="Frequently Asked Questions" />
      <div className="join join-vertical w-full">
        {faqs.map((f, i) => (
          <div key={i} className="collapse collapse-arrow join-item border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-base font-medium">{f.q}</div>
            <div className="collapse-content">
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);

export default FAQ;
