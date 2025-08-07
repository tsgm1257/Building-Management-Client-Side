import { FaBuilding, FaLock, FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import ColorTypewriter from "./ColorTypewriter";

const AboutBuilding = () => (
  <section className="bg-gray-100 py-12 px-6 font-[Marcellus]">
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">
        About the Building
      </h2>
      <p className="text-lg font-[Marcellus] text-gray-600 mb-10">
        Discover modern living with <ColorTypewriter />
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <FaBuilding className="text-3xl text-blue-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Modern Architecture</h3>
          <p className="text-gray-600">
            Stylish and spacious apartments with excellent ventilation, balcony
            views, and top-tier materials.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <FaLock className="text-3xl text-red-500 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Secure Environment</h3>
          <p className="text-gray-600">
            24/7 CCTV monitoring, intercom access, and on-site security guards
            ensure full safety for your family.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <FaLeaf className="text-3xl text-green-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Eco-Friendly Features</h3>
          <p className="text-gray-600">
            Rooftop garden, solar water heating, and garbage separation
            facilities contribute to sustainability.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <FaMapMarkerAlt className="text-3xl text-purple-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
          <p className="text-gray-600">
            Located near markets, schools, and hospitals, with easy access to
            public transport.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutBuilding;
