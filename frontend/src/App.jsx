import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import DatasetPreview from "./components/DatasetPreview.jsx";
import TrainPanel from "./components/TrainPanel.jsx";
import PredictForm from "./components/PredictForm.jsx";
import PredictionResult from "./components/PredictionResult.jsx";
import FeatureImportanceChart from "./components/FeatureImportanceChart.jsx";
import PriceTrendChart from "./components/PriceTrendChart.jsx";
import {
  getDataset,
  getOptions,
  trainModel,
  predictPrice,
  getPriceTrend,
} from "./api/client.js";

export default function App() {
  const [datasetRows, setDatasetRows] = useState(null);
  const [preview, setPreview] = useState([]);
  const [options, setOptions] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [priceTrend, setPriceTrend] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [form, setForm] = useState({
    brand: "Toyota",
    mileage: 45000,
    fuel_type: "Petrol",
    year: 2019,
    horsepower: 150,
    transmission: "Automatic",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    dataset: true,
    train: false,
    predict: false,
  });

  const modelTrained = Boolean(metrics);

  useEffect(() => {
    async function init() {
      try {
        const [dsRes, optRes, trendRes] = await Promise.all([
          getDataset(),
          getOptions(),
          getPriceTrend(),
        ]);
        setDatasetRows(dsRes.data.rows);
        setPreview(dsRes.data.preview);
        setOptions(optRes.data);
        setPriceTrend(trendRes.data);
        setForm({
          brand: optRes.data.brands[0],
          mileage: 45000,
          fuel_type: optRes.data.fuel_types[0],
          year: Math.floor((optRes.data.year_min + optRes.data.year_max) / 2),
          horsepower: 150,
          transmission: optRes.data.transmissions[0],
        });
      } catch {
        setError(
          "Cannot reach the API. Start the Flask backend: cd backend && python app.py"
        );
      } finally {
        setLoading((l) => ({ ...l, dataset: false }));
      }
    }
    init();
  }, []);

  const handleTrain = useCallback(async () => {
    setError("");
    setLoading((l) => ({ ...l, train: true }));
    try {
      const res = await trainModel();
      setMetrics(res.data.metrics);
      setFeatureImportance(res.data.feature_importance);
      setPrediction(null);
    } catch (err) {
      setError(err.response?.data?.error || "Training failed.");
    } finally {
      setLoading((l) => ({ ...l, train: false }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["year", "mileage", "horsepower"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setLoading((l) => ({ ...l, predict: true }));
    try {
      const res = await predictPrice(form);
      setPrediction(res.data);
    } catch (err) {
      setPrediction(null);
      setError(err.response?.data?.error || "Prediction failed.");
    } finally {
      setLoading((l) => ({ ...l, predict: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header datasetLoaded={Boolean(datasetRows)} modelTrained={modelTrained} />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {error && (
          <div className="rounded-xl border border-amber-800/50 bg-amber-950/40 px-4 py-3 text-amber-200">
            {error}
          </div>
        )}

        <DatasetPreview
          preview={preview}
          rows={datasetRows}
          loading={loading.dataset}
        />

        <TrainPanel
          metrics={metrics}
          loading={loading.train}
          onTrain={handleTrain}
          datasetRows={datasetRows}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PredictForm
            form={form}
            options={options}
            loading={loading.predict}
            disabled={!modelTrained}
            onChange={handleChange}
            onSubmit={handlePredict}
          />
          <PredictionResult result={prediction} error={null} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FeatureImportanceChart data={featureImportance} />
          <PriceTrendChart data={priceTrend} />
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        CarPriceAI — CodeAlpha ML demo
      </footer>
    </div>
  );
}
