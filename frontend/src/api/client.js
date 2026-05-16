import axios from "axios";

// Vite proxies /api to Flask during development
const api = axios.create({ baseURL: "/api" });

export const getHealth = () => api.get("/health");
export const getDataset = () => api.get("/dataset");
export const getOptions = () => api.get("/options");
export const trainModel = () => api.post("/train");
export const predictPrice = (data) => api.post("/predict", data);
export const getFeatureImportance = () => api.get("/charts/feature-importance");
export const getPriceTrend = () => api.get("/charts/price-trend");
