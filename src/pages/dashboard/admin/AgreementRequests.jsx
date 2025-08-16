import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaFileSignature } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const AgreementRequests = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["agreementRequests"],
    enabled: !!user, // don't run until user is ready
    queryFn: async () => {
      if (!API_URL) throw new Error("VITE_API_URL is not defined");
      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/api/admin/agreements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load requests: ${res.status} ${text}`);
      }
      const data = await res.json();

      // Only show pending requests
      return (Array.isArray(data) ? data : []).filter(
        (req) => req.status === "pending"
      );
    },
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, action, email }) => {
      if (!API_URL) throw new Error("VITE_API_URL is not defined");
      const token = await user.getIdToken();

      // Determine the role based on action
      const userRole = action === "accept" ? "member" : "user";

      const res = await fetch(`${API_URL}/api/agreements/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          userEmail: email,
          status: "checked",
          userRole,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(
          `Failed to update agreement: ${res.status} ${errorText}`
        );
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agreementRequests"] });
    },
    onError: (error) => {
      console.error("Error updating agreement:", error);
    },
  });

  if (isLoading) return <p className="text-center mt-8">Loading requests...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-primary">
        <FaFileSignature className="text-xl" />
        Agreement Requests
      </h2>

      <div className="overflow-x-auto rounded shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>User Name</th>
              <th>User Email</th>
              <th>Floor No</th>
              <th>Block Name</th>
              <th>Room No</th>
              <th>Rent</th>
              <th>Agreement Request Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.userName}</td>
                <td>{req.userEmail}</td>
                <td>{req.floor}</td>
                <td>{req.block}</td>
                <td>{req.number}</td>
                <td>{req.rent}৳</td>
                <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success btn-xs"
                      onClick={() =>
                        mutation.mutate({
                          id: req._id,
                          action: "accept",
                          email: req.userEmail,
                        })
                      }
                      disabled={mutation.isPending}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-error btn-xs"
                      onClick={() =>
                        mutation.mutate({
                          id: req._id,
                          action: "reject",
                          email: req.userEmail,
                        })
                      }
                      disabled={mutation.isPending}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgreementRequests;
