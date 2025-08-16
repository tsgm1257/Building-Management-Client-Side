import { useEffect, useState } from "react";
import Section from "../../components/Section";
import Container from "../../components/Container";
import SectionHeading from "../../components/SectionHeading";

const API_URL = import.meta.env.VITE_API_URL;

const AnnouncementsStrip = () => {
  const [ann, setAnn] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/announcements`);
        const data = await res.json();
        setAnn(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch {
        setAnn([]);
      }
    };
    run();
  }, []);

  return (
    <Section>
      <Container>
        <SectionHeading title="Announcements" />
        {ann.length === 0 ? (
          <div className="p-4 rounded-xl bg-base-200 border border-base-300">
            No announcements yet.
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ann.map((a) => (
              <li
                key={a._id}
                className="p-4 rounded-xl bg-base-100 shadow border border-base-200"
              >
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-base-content/70">{a.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
};

export default AnnouncementsStrip;
