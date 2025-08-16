import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";
import { MdCampaign, MdDateRange } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL;

const Announcements = () => {
  const { user } = useContext(AuthContext);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    enabled: !!user, // don't run until user is available
    queryFn: async () => {
      if (!API_URL) throw new Error("VITE_API_URL is not defined");
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/admin/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok)
        throw new Error(`Failed to load announcements: ${res.status}`);
      return res.json();
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-center gap-2 mb-6">
        <MdCampaign className="text-3xl text-primary" />
        <h2 className="text-3xl font-bold">Announcements</h2>
      </div>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500">No announcements found.</p>
      ) : (
        <div className="space-y-6">
          {announcements.map((a, i) => (
            <div
              key={i}
              className="bg-base-100 border-l-4 border-primary p-6 rounded shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
              <p className="text-base mb-3">{a.description}</p>
              <div className="flex items-center text-sm text-gray-500 gap-1">
                <MdDateRange />
                <span>
                  Posted: {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
