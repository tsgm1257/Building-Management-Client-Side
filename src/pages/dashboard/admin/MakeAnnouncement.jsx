// src/pages/dashboard/admin/MakeAnnouncement.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaBullhorn } from "react-icons/fa";
import { MdOutlineAnnouncement } from "react-icons/md";
import Container from "../../../components/Container";

const API_URL = import.meta.env.VITE_API_URL;

const MakeAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (!API_URL) throw new Error("VITE_API_URL is not defined");
      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/admin/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to post announcement: ${res.status} ${text}`);
      }

      setMessage("Announcement posted successfully.");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to post announcement.");
    }
  };

  return (
    <Container className="py-6">
      <div className="p-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaBullhorn className="text-2xl text-primary" />
          <h2 className="text-3xl font-bold">Make Announcement</h2>
        </div>

        <div className="bg-base-100 rounded shadow border border-base-300 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Title</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Description</span>
              </div>
              <textarea
                className="textarea textarea-bordered w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write announcement details"
                rows={5}
                required
              />
            </label>

            <button
              className="btn btn-neutral w-full flex items-center gap-2"
              type="submit"
            >
              <MdOutlineAnnouncement className="text-xl" />
              Post Announcement
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center font-semibold text-sm text-success">
              {message}
            </p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default MakeAnnouncement;
