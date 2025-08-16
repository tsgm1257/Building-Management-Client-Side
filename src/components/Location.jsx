// src/components/Location.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Container from "./Container";

// Fix default marker issue in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const Location = () => {
  // Keep your current location (Dhaka). Change if needed.
  const position = [23.8103, 90.4125];

  return (
    <Section id="location" className="bg-base-200">
      <Container>
        <SectionHeading
          title="Our Location"
          subtitle="Convenient access to markets, schools, hospitals, and transport"
        />

        <div className="rounded-xl border border-base-300 overflow-hidden shadow">
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={false}
            className="h-72 md:h-96 w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                My Building Residency <br /> Near XYZ Street, 5 minutes from
                downtown.
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="text-center mt-4">
          <p className="text-base-content/70">
            Located near XYZ Street with easy access to markets, schools, and
            transport.
          </p>
          <a
            href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm mt-3"
          >
            Open in Google Maps
          </a>
        </div>
      </Container>
    </Section>
  );
};

export default Location;
