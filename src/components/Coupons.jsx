import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch("https://building-management-server-woad-two.vercel.app/api/coupons/active");
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading coupons...</p>;

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
