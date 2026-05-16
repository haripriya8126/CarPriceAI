export default function TrainPanel({ metrics, loading, onTrain, datasetRows }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white">Train model</h2>
      <p className="mt-1 text-sm text-slate-400">
        Uses a Random Forest regressor on {datasetRows ?? "—"} sample cars.
      </p>

      <button
        type="button"
        onClick={onTrain}
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Training…" : "Train Random Forest"}
      </button>

      {metrics && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-xs uppercase text-slate-500">MAE</p>
            <p className="mt-1 text-xl font-semibold text-emerald-400">
              ${metrics.mae?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-xs uppercase text-slate-500">R² score</p>
            <p className="mt-1 text-xl font-semibold text-emerald-400">
              {(metrics.r2 * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-4">
            <p className="text-xs uppercase text-slate-500">Samples</p>
            <p className="mt-1 text-xl font-semibold text-emerald-400">
              {metrics.samples}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
