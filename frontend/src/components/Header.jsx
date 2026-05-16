export default function Header({ datasetLoaded, modelTrained }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Car<span className="text-emerald-400">Price</span>AI
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Random Forest car price prediction
          </p>
        </div>
        <div className="flex gap-2 text-xs sm:text-sm">
          <span
            className={`rounded-full px-3 py-1 ${
              datasetLoaded
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            Dataset
          </span>
          <span
            className={`rounded-full px-3 py-1 ${
              modelTrained
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            Model trained
          </span>
        </div>
      </div>
    </header>
  );
}
