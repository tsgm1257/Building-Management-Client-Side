import Section from "../../components/Section";
import Container from "../../components/Container";

const CallToAction = () => (
  <Section>
    <Container>
      <div className="rounded-xl bg-base-200 border border-base-300 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold">Find your ideal apartment</h3>
          <p className="text-base-content/70">Browse listings and request an agreement in minutes.</p>
        </div>
        <a href="/apartments" className="btn btn-primary">Browse Apartments</a>
      </div>
    </Container>
  </Section>
);

export default CallToAction;
