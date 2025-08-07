import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

const ManageCoupons = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    description: "",
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch("https://building-management-server-woad-two.vercel.app/api/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  const addCoupon = useMutation({
    mutationFn: async () => {
      const token = await user.getIdToken();
      await fetch("https://building-management-server-woad-two.vercel.app/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      setForm({ code: "", discountPercentage: "", description: "" });
    },
  });

  const toggleCoupon = useMutation({
    mutationFn: async (code) => {
      const token = await user.getIdToken();
      await fetch(`https://building-management-server-woad-two.vercel.app/api/admin/coupons/${code}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading coupons...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Coupons</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addCoupon.mutate();
        }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <input
          type="text"
          className="input input-bordered"
          placeholder="Coupon Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <input
          type="number"
          className="input input-bordered"
          placeholder="Discount %"
          value={form.discountPercentage}
          onChange={(e) =>
            setForm({ ...form, discountPercentage: e.target.value })
          }
          required
        />
        <input
          type="text"
          className="input input-bordered"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Add Coupon
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow border">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Description</th>
              <th>Status</th>
              <th className="text-center">Toggle</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td className="font-bold text-green-700">{c.code}</td>
                <td>{c.discountPercentage}%</td>
                <td>{c.description}</td>
                <td>
                  <span
                    className={`badge ${
                      c.isActive ? "badge-success" : "badge-error"
                    }`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => toggleCoupon.mutate(c.code)}
                  >
                    {c.isActive ? (
                      <>
                        <FaToggleOff className="text-red-500 mr-1" /> Disable
                      </>
                    ) : (
                      <>
                        <FaToggleOn className="text-green-600 mr-1" /> Enable
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCoupons;
