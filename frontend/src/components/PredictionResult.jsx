export default function PredictionResult({ result, error }) {
  if (error) {
    return (
      <section className="rounded-2xl border border-red-900/50 bg-red-950/30 p-6">
        <p className="text-red-300">{error}</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Prediction</h2>
        <p className="mt-2 text-sm text-slate-500">
          Train the model, then submit the form to see results.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-slate-900 to-emerald-950/30 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white">Prediction result</h2>

      <p className="mt-4 text-4xl font-bold text-emerald-400">
        ${result.predicted_price?.toLocaleString()}
      </p>

      <div className="mt-6 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-400">Confidence</span>
            <span className="font-medium text-emerald-300">
              {result.confidence_percent}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${result.confidence_percent}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-slate-400">
          Estimated range:{" "}
          <span className="text-slate-200">
            ${result.price_low?.toLocaleString()} – $
            {result.price_high?.toLocaleString()}
          </span>
        </p>
        <p className="text-xs text-slate-500">
          Range is based on variation across Random Forest trees (not a
          guaranteed market price).
        </p>
      </div>
    </section>
  );
}
