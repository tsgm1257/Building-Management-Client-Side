import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaHistory } from "react-icons/fa";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(
        `https://building-management-server-woad-two.vercel.app/api/payments/user?email=${user.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Server returned non-JSON response");
      }

      return res.json();
    },
    enabled: !!user,
  });

  if (isLoading)
    return (
      <p className="text-center mt-10 text-lg">Loading payment history...</p>
    );

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>
        <p className="text-red-600 text-lg">
          Failed to load payment history. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary flex items-center justify-center gap-2">
        <FaHistory className="text-primary text-2xl" />
        Payment History
      </h2>

      <div className="overflow-x-auto rounded shadow-lg bg-white">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>Date</th>
              <th>Month</th>
              <th>Rent</th>
              <th>Discount</th>
              <th>Total Paid</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, i) => (
              <tr key={i}>
                <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
                <td>{payment.month}</td>
                <td>{payment.rent.toLocaleString()}৳</td>
                <td>{payment.discount || 0}%</td>
                <td className="font-semibold text-green-600">
                  {(
                    payment.rent *
                    (1 - (payment.discount || 0) / 100)
                  ).toLocaleString()}
                  ৳
                </td>
                <td className="text-xs break-all">{payment.transactionId}</td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
