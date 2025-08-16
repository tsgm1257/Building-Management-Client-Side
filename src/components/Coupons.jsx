import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const API_URL = import.meta.env.VITE_API_URL;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (!API_URL) {
          throw new Error("VITE_API_URL is not defined");
        }

        const res = await fetch(`${API_URL}/api/coupons/active`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text || "Failed to fetch"}`);
        }

        const data = await res.json();
        setCoupons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
        setErrMsg("Could not load coupons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading coupons...</p>;

  if (errMsg) return <p className="text-center mt-10 text-red-600">{errMsg}</p>;

  if (coupons.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        No active coupons available right now.
      </p>
    );

  return (
    <div className="my-12 bg-gray-100 py-12 rounded shadow-inner">
      <h2 className="text-2xl font-bold text-center mb-4">Active Coupons</h2>
      <Marquee pauseOnHover speed={60} gradient={false}>
        {coupons.map((c, i) => (
          <div
            key={i}
            className="mx-6 px-4 py-8 border rounded bg-white shadow text-center min-w-[220px]"
          >
            <h3 className="text-lg font-bold text-green-700">{c.code}</h3>
            <p className="text-sm text-gray-600">{c.description}</p>
            <p className="text-base font-semibold text-red-500">
              {c.discountPercentage}% OFF
            </p>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Coupons;
