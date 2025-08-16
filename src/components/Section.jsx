import Container from "./Container";

const Section = ({ id, children, className = "" }) => {
  return (
    <section id={id} className={`py-12 md:py-16 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
};

export default Section;
