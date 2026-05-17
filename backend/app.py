"""
Flask API for CarPriceAI.

Run: python app.py
API base: http://localhost:5000/api
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.ml_model import SalesPredictor

model_service = SalesPredictor()

app = Flask(__name__)
CORS(app)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "app": "CarPriceAI"})


@app.route("/api/dataset")
def dataset():
    """Load (or generate) sample data and return a preview."""
    model_service.ensure_sample_data()
    return jsonify(
        {
            "rows": len(model_service.df),
            "preview": model_service.df.head(10).to_dict(orient="records"),
            "columns": list(model_service.df.columns),
        }
    )


@app.route("/api/options")
def options():
    """Form dropdown values from the dataset."""
    return jsonify(model_service.get_options())


@app.route("/api/train", methods=["POST"])
def train():
    """Train the Random Forest model."""
    metrics = model_service.train()
    return jsonify(
        {
            "metrics": metrics,
            "feature_importance": model_service.feature_importance,
        }
    )


@app.route("/api/predict", methods=["POST"])
def predict():
    """Predict car price from user inputs."""
    if model_service.pipeline is None:
        return jsonify({"error": "Train the model first using POST /api/train"}), 400

    data = request.get_json() or {}
    required = [
        "brand",
        "mileage",
        "fuel_type",
        "year",
        "horsepower",
        "transmission",
    ]
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        result = model_service.predict(data)
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/api/charts/feature-importance")
def chart_importance():
    if not model_service.feature_importance:
        return jsonify({"error": "Train the model first"}), 400
    return jsonify(model_service.feature_importance[:12])


@app.route("/api/charts/price-trend")
def chart_trend():
    return jsonify(model_service.price_trend())


if __name__ == "__main__":
    model_service.ensure_sample_data()
    app.run(debug=True, port=5000)
