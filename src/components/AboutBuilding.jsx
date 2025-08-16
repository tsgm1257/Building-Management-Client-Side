import { FaBuilding, FaLock, FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Card from "./Card";
import ColorTypewriter from "./ColorTypewriter";

const AboutBuilding = () => (
  <Section id="about" className="bg-base-200">
    <SectionHeading
      title="About the Building"
      subtitle={
        <>
          Discover modern living with <ColorTypewriter />
        </>
      }
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <Card title="Modern Architecture">
        <div className="flex items-start gap-3">
          <FaBuilding className="text-secondary text-2xl shrink-0 mt-1" />
          <p className="text-base-content/80">
            Stylish and spacious apartments with excellent ventilation, balcony
            views, and top-tier materials.
          </p>
        </div>
      </Card>

      <Card title="Secure Environment">
        <div className="flex items-start gap-3">
          <FaLock className="text-secondary text-2xl shrink-0 mt-1" />
          <p className="text-base-content/80">
            24/7 CCTV monitoring, intercom access, and on-site security guards
            ensure full safety for your family.
          </p>
        </div>
      </Card>

      <Card title="Eco-Friendly Features">
        <div className="flex items-start gap-3">
          <FaLeaf className="text-secondary text-2xl shrink-0 mt-1" />
          <p className="text-base-content/80">
            Rooftop garden, solar water heating, and garbage separation
            facilities contribute to sustainability.
          </p>
        </div>
      </Card>

      <Card title="Prime Location">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-secondary text-2xl shrink-0 mt-1" />
          <p className="text-base-content/80">
            Located near markets, schools, and hospitals, with easy access to
            public transport.
          </p>
        </div>
      </Card>
    </div>
  </Section>
);

export default AboutBuilding;
