// src/pages/dashboard/UserProfile.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import Container from "../../components/Container";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const { user, role } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photoURL: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Rented apartment (for members)
  const [agreement, setAgreement] = useState(null);
  const [agreementLoading, setAgreementLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || user.displayName || "",
            email: data.email || user.email || "",
            photoURL: data.photoURL || user.photoURL || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        } else {
          setProfile({
            name: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            phone: "",
            address: "",
          });
        }
      } catch {
        setProfile({
          name: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          phone: "",
          address: "",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Load rented apartment details only for members
  useEffect(() => {
    const loadAgreement = async () => {
      if (!user || role !== "member") return;
      try {
        setAgreementLoading(true);
        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/api/agreements/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
          setAgreement(null);
        } else if (res.ok) {
          const data = await res.json();
          setAgreement(data);
        }
      } catch {
        setAgreement(null);
      } finally {
        setAgreementLoading(false);
      }
    };
    loadAgreement();
  }, [user, role]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          photoURL: profile.photoURL,
          phone: profile.phone,
          address: profile.address,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Profile saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading profile…</div>;

  return (
    <Container className="py-6">
      <div className="p-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <h2 className="text-3xl font-bold">My Profile</h2>
        </div>

        <div className="bg-base-100 rounded-xl shadow border border-base-300 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-6">
              <img
                src={
                  profile.photoURL ||
                  "https://i.ibb.co/Q3YR2xSn/default-user.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border border-primary"
              />
              <div>
                <p className="font-semibold text-lg">
                  {profile.name || "Unnamed"}
                </p>
                <p className="text-sm text-base-content/60">{profile.email}</p>
              </div>
            </div>

            {/* Member-only: Rented apartment info */}
            {role === "member" && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Rented Apartment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-base-200/60 rounded-lg p-4">
                  {agreementLoading ? (
                    <p>Loading apartment info…</p>
                  ) : agreement ? (
                    <>
                      <p>
                        <span className="font-medium">Floor:</span>{" "}
                        {agreement.floor}
                      </p>
                      <p>
                        <span className="font-medium">Block:</span>{" "}
                        {agreement.block}
                      </p>
                      <p>
                        <span className="font-medium">Room No:</span>{" "}
                        {agreement.number}
                      </p>
                      <p>
                        <span className="font-medium">Monthly Rent:</span>{" "}
                        {Number(agreement.rent || 0).toLocaleString()} ৳
                      </p>
                      {agreement.requestDate && (
                        <p className="sm:col-span-2">
                          <span className="font-medium">Since:</span>{" "}
                          {new Date(agreement.requestDate).toLocaleDateString()}
                        </p>
                      )}
                      {agreement.status && (
                        <p className="sm:col-span-2">
                          <span className="font-medium">Status:</span>{" "}
                          {agreement.status}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>No rented apartment on file.</p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input input-bordered w-full"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="label">Photo URL</label>
                <input
                  className="input input-bordered w-full"
                  value={profile.photoURL}
                  onChange={(e) =>
                    setProfile({ ...profile, photoURL: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input input-bordered w-full"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="+1 555 123 4567"
                />
              </div>
              <div>
                <label className="label">Address</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  placeholder="Street, City, State, ZIP"
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary mt-2 ${
                  saving ? "btn-disabled" : "hover:opacity-90"
                }`}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Quick Info Strip */}
          <div className="bg-base-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-base-content/70 break-all">
                {profile.phone || "—"}
              </p>
            </div>
            <div className="col-span-2 md:col-span-3">
              <p className="font-medium">Address</p>
              <p className="text-base-content/70">{profile.address || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;
