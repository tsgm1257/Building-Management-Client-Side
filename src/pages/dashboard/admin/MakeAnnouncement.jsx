import { useState, useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaBullhorn } from "react-icons/fa";
import { MdOutlineAnnouncement } from "react-icons/md";

const MakeAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await user.getIdToken();

    const res = await fetch("https://building-management-server-woad-two.vercel.app/api/admin/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      setMessage("Announcement posted successfully.");
      setTitle("");
      setDescription("");
    } else {
      setMessage("Failed to post announcement.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded shadow">
      <h2 className="text-3xl font-bold flex items-center gap-2 mb-6 text-center justify-center text-primary">
        <FaBullhorn />
        Make Announcement
      </h2>

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
          className="btn btn-primary w-full flex items-center gap-2"
          type="submit"
        >
          <MdOutlineAnnouncement className="text-xl" />
          Post Announcement
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-semibold text-sm text-green-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default MakeAnnouncement;
