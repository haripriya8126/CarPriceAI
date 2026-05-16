import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PriceTrendChart({ data }) {
  if (!data?.length) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Price trend</h2>
        <p className="mt-2 text-sm text-slate-500">Loading trend data…</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white">Price trend by year</h2>
      <p className="mt-1 text-sm text-slate-400">
        Average price in the sample dataset over time.
      </p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Avg price"]}
            />
            <Line
              type="monotone"
              dataKey="avg_price"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: "#34d399", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
