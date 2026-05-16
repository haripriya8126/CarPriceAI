import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function FeatureImportanceChart({ data }) {
  if (!data?.length) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Feature importance</h2>
        <p className="mt-2 text-sm text-slate-500">Train the model to see this chart.</p>
      </section>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    shortName: d.feature.length > 18 ? d.feature.slice(0, 16) + "…" : d.feature,
  }));

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white">Feature importance</h2>
      <p className="mt-1 text-sm text-slate-400">
        Which inputs the Random Forest relied on most.
      </p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="shortName"
              width={100}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              formatter={(value) => [value.toFixed(4), "Importance"]}
            />
            <Bar dataKey="importance" fill="#34d399" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
