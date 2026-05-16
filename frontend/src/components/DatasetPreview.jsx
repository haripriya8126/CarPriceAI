export default function DatasetPreview({ preview, rows, loading }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white">Sample dataset</h2>
      <p className="mt-1 text-sm text-slate-400">
        {loading
          ? "Loading…"
          : rows
            ? `${rows} cars loaded automatically from backend.`
            : "Waiting for dataset…"}
      </p>

      {preview?.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                {Object.keys(preview[0]).map((col) => (
                  <th key={col} className="px-2 py-2 font-medium capitalize">
                    {col.replace("_", " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i} className="border-b border-slate-800/80 text-slate-300">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-2 py-2">
                      {typeof val === "number" && val > 1000
                        ? val.toLocaleString()
                        : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
