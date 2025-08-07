import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker issue in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const Location = () => {
  const position = [23.8103, 90.4125]; // Dhaka, Bangladesh

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-4">Our Location</h2>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="h-80 rounded shadow"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            My Building Residency <br /> Near XYZ street, 5 minutes from
            downtown.
          </Popup>
        </Marker>
      </MapContainer>
      <p className="text-center mt-3 text-gray-600">
        Conveniently located near XYZ Street with easy access to markets,
        schools, and transport.
      </p>
    </div>
  );
};

export default Location;
