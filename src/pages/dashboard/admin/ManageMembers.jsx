import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaUserSlash, FaUsersCog } from "react-icons/fa";
import toast from "react-hot-toast";

const ManageMembers = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(
        "https://building-management-server-woad-two.vercel.app/api/admin/members",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch members");
      }

      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (email) => {
      const token = await user.getIdToken();
      const response = await fetch(
        `https://building-management-server-woad-two.vercel.app/api/admin/members/${email}/demote`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove member");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["members"]);
      toast.success("Member removed successfully and agreement deleted");
      console.log("Member removal result:", data);
    },
    onError: (error) => {
      toast.error("Failed to remove member: " + error.message);
      console.error("Error removing member:", error);
    },
  });

  const handleRemoveMember = (email, name) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${name} as a member? This will also delete their agreement.`
      )
    ) {
      mutation.mutate(email);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading members...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-center sm:text-left justify-center sm:justify-start">
        <FaUsersCog className="text-primary" />
        Manage Members
      </h2>

      <div className="overflow-x-auto bg-base-100 shadow-md rounded-lg border border-base-300">
        <table className="table table-zebra w-full text-sm md:text-base">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-error flex items-center gap-1"
                    onClick={() =>
                      handleRemoveMember(member.email, member.name)
                    }
                    disabled={mutation.isPending}
                  >
                    <FaUserSlash />
                    {mutation.isPending ? "Removing..." : "Remove"}
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMembers;
