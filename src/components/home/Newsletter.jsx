import Section from "../../components/Section";
import Container from "../../components/Container";
import SectionHeading from "../../components/SectionHeading";

const Newsletter = () => (
  <Section>
    <Container>
      <SectionHeading title="Newsletter" subtitle="Get updates, offers, and reminders" />
      <form
        className="flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Thanks for subscribing!");
        }}
      >
        <input
          type="email"
          required
          placeholder="Your email address"
          className="input input-bordered flex-1"
        />
        <button className="btn btn-primary">Subscribe</button>
      </form>
    </Container>
  </Section>
);

export default Newsletter;
