const inputClass =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";

const labelClass = "block text-sm font-medium text-slate-300";

export default function PredictForm({
  form,
  options,
  loading,
  disabled,
  onChange,
  onSubmit,
}) {
  if (!options) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <p className="text-slate-400">Loading form options…</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-white">Predict price</h2>
      <p className="mt-1 text-sm text-slate-400">
        Enter car details to get an estimated market price.
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="brand">
            Brand
          </label>
          <select
            id="brand"
            name="brand"
            value={form.brand}
            onChange={onChange}
            className={inputClass}
          >
            {options.brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="fuel_type">
            Fuel type
          </label>
          <select
            id="fuel_type"
            name="fuel_type"
            value={form.fuel_type}
            onChange={onChange}
            className={inputClass}
          >
            {options.fuel_types.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="transmission">
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            value={form.transmission}
            onChange={onChange}
            className={inputClass}
          >
            {options.transmissions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="year">
            Year
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min={options.year_min}
            max={options.year_max}
            value={form.year}
            onChange={onChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="mileage">
            Mileage (km)
          </label>
          <input
            id="mileage"
            name="mileage"
            type="number"
            min={0}
            value={form.mileage}
            onChange={onChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="horsepower">
            Horsepower
          </label>
          <input
            id="horsepower"
            name="horsepower"
            type="number"
            min={50}
            max={500}
            value={form.horsepower}
            onChange={onChange}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={disabled || loading}
            className="w-full rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Predicting…" : "Get prediction"}
          </button>
        </div>
      </form>
    </section>
  );
}
