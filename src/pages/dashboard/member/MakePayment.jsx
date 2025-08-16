import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaMoneyCheckAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const MakePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);

  const [agreement, setAgreement] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [month, setMonth] = useState("");
  const [message, setMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [existingPayments, setExistingPayments] = useState([]);

  // Fetch agreement
  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        if (!API_URL) throw new Error("VITE_API_URL is not defined");
        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/api/agreements/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setMessage("No agreement found. Please contact admin.");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setAgreement(data);
      } catch (error) {
        console.error("Agreement fetch error:", error);
        setMessage("Failed to load agreement. Please try again.");
      }
    };
    if (user) fetchAgreement();
  }, [user]);

  // Fetch existing payments for this user
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!API_URL) throw new Error("VITE_API_URL is not defined");
        const token = await user.getIdToken();
        const res = await fetch(
          `${API_URL}/api/payments/user?email=${encodeURIComponent(user.email)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const payments = await res.json().catch(() => []);
          setExistingPayments(Array.isArray(payments) ? payments : []);
        }
      } catch (error) {
        console.error("Failed to fetch existing payments:", error);
      }
    };
    if (user) fetchPayments();
  }, [user]);

  // Create/recreate payment intent whenever rent/discount changes
  useEffect(() => {
    const createIntent = async () => {
      if (!agreement) return;
      try {
        if (!API_URL) throw new Error("VITE_API_URL is not defined");
        const token = await user.getIdToken();
        const rent = Number(agreement.rent) || 0;
        const discounted = Math.max(0, rent * (1 - discount / 100));
        const amountInCents = Math.round(discounted * 100);

        const res = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: amountInCents }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setClientSecret(data.clientSecret || "");
      } catch (error) {
        console.error("Payment intent creation error:", error);
        setMessage("Failed to initialize payment. Please try again.");
      }
    };
    createIntent();
  }, [agreement, discount, user]);

  const handleApplyCoupon = async () => {
    try {
      if (!API_URL) throw new Error("VITE_API_URL is not defined");
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/payments/coupon/${couponCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setMessage("Invalid coupon");
        setDiscount(0);
        return;
      }

      const data = await res.json();
      const pct = Number(data.discountPercentage) || 0;
      setDiscount(pct);
      setMessage(`Coupon applied: ${pct}% off`);
    } catch (error) {
      console.error("Coupon application error:", error);
      setMessage("Failed to apply coupon. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!clientSecret) {
      setMessage("Payment is not ready yet. Please wait a moment.");
      return;
    }

    // prevent duplicate month payments
    const exists = existingPayments.some(
      (p) => String(p.month).toLowerCase() === String(month).toLowerCase()
    );
    if (exists) {
      setMessage("Payment for this month already exists!");
      return;
    }

    try {
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: user.displayName, email: user.email },
        },
      });

      if (result.error) {
        setMessage(result.error.message || "Payment failed.");
        return;
      }

      if (!API_URL) throw new Error("VITE_API_URL is not defined");
      const token = await user.getIdToken();

      const paymentData = {
        userName: user.displayName,
        userEmail: user.email,
        floor: agreement.floor,
        block: agreement.block,
        number: agreement.number,
        rent: agreement.rent,
        month,
        discount,
        status: "paid",
        transactionId: result.paymentIntent.id,
      };

      const paymentRes = await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!paymentRes.ok) {
        const text = await paymentRes.text().catch(() => "");
        throw new Error(`Failed to save payment record: ${paymentRes.status} ${text}`);
      }

      setMessage("Payment successful!");
      setPaymentSuccess(true);

      // refresh payments list
      const updated = await fetch(
        `${API_URL}/api/payments/user?email=${encodeURIComponent(user.email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (updated.ok) {
        const payments = await updated.json().catch(() => []);
        setExistingPayments(Array.isArray(payments) ? payments : []);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed. Please try again.");
    }
  };

  if (!agreement && !message) return <p>Loading agreement...</p>;

  if (message && !agreement) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-error">
          <FaMoneyCheckAlt className="text-2xl" />
          Make Payment
        </h2>
        <p className="text-center text-red-600">{message}</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-success">
          <FaMoneyCheckAlt className="text-2xl" />
          Payment Successful!
        </h2>
        <p className="text-green-600 font-semibold mb-4">{message}</p>
        <button
          className="btn btn-primary"
          onClick={() => {
            setPaymentSuccess(false);
            setMonth("");
            setDiscount(0);
            setCouponCode("");
            setMessage("");
          }}
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  const discountedAmount =
    agreement && discount > 0
      ? Math.max(0, agreement.rent - (agreement.rent * discount) / 100)
      : agreement?.rent || 0;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-primary">
        <FaMoneyCheckAlt className="text-2xl" />
        Make Payment
      </h2>

      <div className="bg-base-100 p-6 rounded shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={user.email} readOnly className="input input-bordered w-full" />
          <input type="text" value={`Floor ${agreement.floor}`} readOnly className="input input-bordered w-full" />
          <input type="text" value={`Block ${agreement.block}`} readOnly className="input input-bordered w-full" />
          <input type="text" value={`Room ${agreement.number}`} readOnly className="input input-bordered w-full" />
          <input type="text" value={`${agreement.rent}৳`} readOnly className="input input-bordered w-full" />

          {discount > 0 && (
            <p className="text-green-600 font-semibold">
              Discounted Rent: {discountedAmount}৳
            </p>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              className="input input-bordered w-full"
            />
            <button type="button" className="btn btn-secondary" onClick={handleApplyCoupon}>
              Apply
            </button>
          </div>

          <input
            type="month"
            required
            className="input input-bordered w-full"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          {month &&
            existingPayments.some(
              (p) => String(p.month).toLowerCase() === String(month).toLowerCase()
            ) && (
              <p className="text-error font-semibold">
                Payment for {month} already exists!
              </p>
            )}

          <CardElement className="p-4 border rounded bg-white" />

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={
              !stripe ||
              !clientSecret ||
              (month &&
                existingPayments.some(
                  (p) => String(p.month).toLowerCase() === String(month).toLowerCase()
                ))
            }
          >
            Pay Now
          </button>
        </form>

        {message && !paymentSuccess && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.includes("successful") || message.includes("applied")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default MakePayment;
