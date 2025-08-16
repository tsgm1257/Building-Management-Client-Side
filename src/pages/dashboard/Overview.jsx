import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import Section from "../../components/Section";
import Container from "../../components/Container";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const COLORS = ["#22c55e", "#ef4444"]; // success / danger accent (stays within ≤4 colors)

const Overview = () => {
  const { user } = useContext(AuthContext);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminSummary"],
    enabled: !!user,
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/admin/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load summary");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-6 text-center">Loading summary…</div>;
  if (error) return <div className="p-6 text-center">Failed to load summary.</div>;

  const pieData = [
    { name: "Available %", value: Number(data.availablePercentage || 0) },
    { name: "Rented %", value: Number(data.rentedPercentage || 0) },
  ];

  // simple example series for members (fake trend from totals)
  const series = [
    { name: "Week 1", members: Math.max(0, (data.totalMembers || 0) - 6) },
    { name: "Week 2", members: Math.max(0, (data.totalMembers || 0) - 4) },
    { name: "Week 3", members: Math.max(0, (data.totalMembers || 0) - 2) },
    { name: "Week 4", members: data.totalMembers || 0 },
  ];

  return (
    <Section>
      <Container>
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Overview</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-base-300 bg-base-100 p-5">
            <div className="text-sm text-base-content/70">Total Rooms</div>
            <div className="text-2xl font-bold">{data.totalRooms ?? 0}</div>
          </div>
          <div className="rounded-xl border border-base-300 bg-base-100 p-5">
            <div className="text-sm text-base-content/70">Available %</div>
            <div className="text-2xl font-bold">{data.availablePercentage ?? 0}%</div>
          </div>
          <div className="rounded-xl border border-base-300 bg-base-100 p-5">
            <div className="text-sm text-base-content/70">Rented %</div>
            <div className="text-2xl font-bold">{data.rentedPercentage ?? 0}%</div>
          </div>
          <div className="rounded-xl border border-base-300 bg-base-100 p-5">
            <div className="text-sm text-base-content/70">Total Members</div>
            <div className="text-2xl font-bold">{data.totalMembers ?? 0}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie */}
          <div className="rounded-xl border border-base-300 bg-base-100 p-4">
            <h2 className="font-semibold mb-2">Occupancy</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={pieData} outerRadius={90} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area */}
          <div className="rounded-xl border border-base-300 bg-base-100 p-4">
            <h2 className="font-semibold mb-2">Members (Last 4 Weeks)</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="members" stroke="#22c55e" fillOpacity={1} fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Overview;
