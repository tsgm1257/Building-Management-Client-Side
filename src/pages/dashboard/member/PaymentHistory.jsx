// src/pages/dashboard/member/PaymentHistory.jsx
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaHistory } from "react-icons/fa";
import Container from "../../../components/Container";

const API_URL = import.meta.env.VITE_API_URL;

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    enabled: !!user,
    queryFn: async () => {
      if (!API_URL) throw new Error("VITE_API_URL is not defined");
      const token = await user.getIdToken();
      const res = await fetch(
        `${API_URL}/api/payments/user?email=${encodeURIComponent(user.email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text().catch(() => "");
        throw new Error("Server returned non-JSON response: " + text);
      }

      return res.json();
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <Container className="py-6">
        <div className="p-6">
          <p className="text-center mt-10 text-lg">
            Loading payment history...
          </p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <div className="p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <FaHistory className="text-primary text-2xl" />
            <h2 className="text-3xl font-bold">Payment History</h2>
          </div>
          <p className="text-error text-lg text-center">
            Failed to load payment history. Please try again.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <div className="p-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaHistory className="text-primary text-2xl" />
          <h2 className="text-3xl font-bold">Payment History</h2>
        </div>

        <div className="overflow-x-auto rounded shadow-lg bg-base-100 border border-base-300">
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
              {payments.map((payment, i) => {
                const rent = Number(payment.rent) || 0;
                const discount = Number(payment.discount) || 0;
                const total = rent * (1 - discount / 100);
                return (
                  <tr key={i}>
                    <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
                    <td>{payment.month}</td>
                    <td>{rent.toLocaleString()}৳</td>
                    <td>{discount}%</td>
                    <td className="font-semibold text-success">
                      {total.toLocaleString()}৳
                    </td>
                    <td className="text-xs break-all">
                      {payment.transactionId}
                    </td>
                  </tr>
                );
              })}

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
    </Container>
  );
};

export default PaymentHistory;
