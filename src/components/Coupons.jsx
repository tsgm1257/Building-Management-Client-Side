// src/components/Coupons.jsx
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Section from "./Section";
import SectionHeading from "./SectionHeading";
import Container from "./Container";
import Card from "./Card";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (!API_URL) throw new Error("VITE_API_URL is not defined");
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

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon code copied!");
    } catch {
      toast.error("Copy failed");
    }
  };

  // Loading: skeleton cards that match final layout
  if (loading) {
    return (
      <Section id="coupons" className="bg-base-200">
        <Container>
          <SectionHeading title="Active Coupons" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-base-300 bg-base-100 p-6 animate-pulse"
              >
                <div className="h-6 w-40 bg-base-300 rounded mb-3" />
                <div className="h-4 w-56 bg-base-300 rounded mb-2" />
                <div className="h-4 w-48 bg-base-300 rounded mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="h-9 w-full bg-base-300 rounded" />
                  <div className="h-9 w-full bg-base-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  // Error
  if (errMsg) {
    return (
      <Section id="coupons" className="bg-base-200">
        <Container>
          <SectionHeading title="Active Coupons" />
          <div className="alert alert-error">
            <span>{errMsg}</span>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="coupons" className="bg-base-200">
      <Container>
        <SectionHeading
          title="Active Coupons"
          subtitle="Save on your next payment with these offers"
        />

        {coupons.length === 0 ? (
          <div className="text-center text-base-content/70">
            No active coupons available right now.
          </div>
        ) : (
          <div className="rounded-xl bg-base-100 border border-base-300 shadow-inner">
            <Marquee
              pauseOnHover
              speed={60}
              gradient={false}
              aria-label="Active coupons ticker"
            >
              {coupons.map((c) => {
                const pct = Number(c.discountPercentage) || 0;
                const expiry = c.expiresAt
                  ? new Date(c.expiresAt).toLocaleDateString()
                  : null;

                return (
                  <div key={c.code} className="px-3 text-center py-6">
                    {/* Fixed width for consistent alignment inside marquee */}
                    <div className="w-[280px]">
                      <Card
                        title={c.code}
                        footer={
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              className="btn btn-primary btn-sm w-full"
                              onClick={() => handleCopy(c.code)}
                              aria-label={`Copy coupon code ${c.code}`}
                            >
                              Copy Code
                            </button>
                            <a
                              href="/dashboard/member/make-payment"
                              className="btn btn-outline btn-sm w-full"
                            >
                              Use Now
                            </a>
                          </div>
                        }
                      >
                        <div className="text-center">
                          <div className="text-base-content/80">
                            {c.description}
                          </div>
                          <div className="mt-3 flex items-center justify-center gap-2">
                            <span className="badge badge-secondary badge-lg">
                              {pct}% OFF
                            </span>
                            {expiry && (
                              <span className="text-xs text-base-content/60">
                                Valid until {expiry}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </Marquee>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default Coupons;
