"""
Machine learning service for CarPriceAI.

Handles sample dataset loading/generation, Random Forest training,
price prediction with confidence bands, and chart data.
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Path to the sample CSV (created automatically if missing)
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "cars_sample.csv")

# Feature column groups used by the model
CATEGORICAL_COLS = ["brand", "fuel_type", "transmission"]
NUMERIC_COLS = ["mileage", "year", "horsepower"]
ALL_FEATURE_COLS = CATEGORICAL_COLS + NUMERIC_COLS


class CarPriceModel:
    """Wraps dataset handling and the sklearn training pipeline."""

    def __init__(self):
        self.pipeline = None
        self.metrics = {}
        self.feature_importance = []
        self.df = None

    def ensure_sample_data(self):
        """Load CSV if it exists; otherwise generate a realistic sample dataset."""
        os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)

        if os.path.exists(DATA_PATH):
            self.df = pd.read_csv(DATA_PATH)
            return

        rng = np.random.default_rng(42)
        n = 500
        brands = ["Toyota", "Honda", "Ford", "BMW", "Audi", "Hyundai"]
        fuels = ["Petrol", "Diesel", "Electric", "Hybrid"]
        transmissions = ["Manual", "Automatic"]

        years = rng.integers(2010, 2024, n)
        mileage = rng.integers(5000, 150000, n)
        horsepower = rng.integers(70, 350, n)
        brand = rng.choice(brands, n)
        fuel_type = rng.choice(fuels, n)
        transmission = rng.choice(transmissions, n)

        # Synthetic price formula so the model has learnable patterns
        brand_bonus = {"BMW": 12000, "Audi": 11000, "Toyota": 2000, "Honda": 1500}
        base = 8000 + (years - 2010) * 1200 - mileage * 0.04 + horsepower * 45
        price = base + np.array([brand_bonus.get(b, 0) for b in brand])
        price += np.where(fuel_type == "Electric", 5000, 0)
        price += np.where(transmission == "Automatic", 1500, 0)
        price += rng.normal(0, 2500, n)
        price = np.clip(price, 3000, 80000)

        self.df = pd.DataFrame(
            {
                "brand": brand,
                "mileage": mileage,
                "fuel_type": fuel_type,
                "year": years,
                "horsepower": horsepower,
                "transmission": transmission,
                "price": price.round(0),
            }
        )
        self.df.to_csv(DATA_PATH, index=False)

    def train(self):
        """Train Random Forest on the sample dataset and compute metrics."""
        self.ensure_sample_data()

        X = self.df[ALL_FEATURE_COLS]
        y = self.df["price"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        preprocessor = ColumnTransformer(
            [
                ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_COLS),
                ("num", "passthrough", NUMERIC_COLS),
            ]
        )

        model = RandomForestRegressor(
            n_estimators=200, random_state=42, n_jobs=-1
        )

        self.pipeline = Pipeline([("prep", preprocessor), ("model", model)])
        self.pipeline.fit(X_train, y_train)

        preds = self.pipeline.predict(X_test)
        self.metrics = {
            "mae": float(mean_absolute_error(y_test, preds)),
            "r2": float(r2_score(y_test, preds)),
            "samples": int(len(self.df)),
        }

        ohe = self.pipeline.named_steps["prep"].named_transformers_["cat"]
        cat_names = list(ohe.get_feature_names_out(CATEGORICAL_COLS))
        feature_names = cat_names + NUMERIC_COLS
        importances = self.pipeline.named_steps["model"].feature_importances_

        self.feature_importance = [
            {"feature": name, "importance": float(val)}
            for name, val in zip(feature_names, importances)
        ]
        self.feature_importance.sort(key=lambda x: x["importance"], reverse=True)

        return self.metrics

    def predict(self, payload):
        """
        Predict price for one car.

        Confidence uses spread across trees plus test MAE for a simple score.
        """
        if self.pipeline is None:
            raise ValueError("Model not trained yet")

        row = pd.DataFrame(
            [
                {
                    "brand": payload["brand"],
                    "mileage": float(payload["mileage"]),
                    "fuel_type": payload["fuel_type"],
                    "year": int(payload["year"]),
                    "horsepower": float(payload["horsepower"]),
                    "transmission": payload["transmission"],
                }
            ]
        )

        X_enc = self.pipeline.named_steps["prep"].transform(row)
        forest = self.pipeline.named_steps["model"]

        tree_preds = np.array([tree.predict(X_enc)[0] for tree in forest.estimators_])
        mean_price = float(tree_preds.mean())
        std_price = float(tree_preds.std())

        mae = self.metrics.get("mae", std_price or 1)
        r2 = self.metrics.get("r2", 0.5)

        # Higher R2 and lower relative error => higher confidence display
        relative_error = mae / max(mean_price, 1)
        confidence_pct = max(
            5, min(95, (r2 * 100) * (1 - min(relative_error, 0.5)))
        )

        return {
            "predicted_price": round(mean_price, 2),
            "confidence_percent": round(confidence_pct, 1),
            "price_low": round(mean_price - 1.96 * std_price, 2),
            "price_high": round(mean_price + 1.96 * std_price, 2),
        }

    def price_trend(self):
        """Average price by year for the trend chart."""
        self.ensure_sample_data()
        trend = self.df.groupby("year", as_index=False)["price"].mean()
        trend = trend.rename(columns={"price": "avg_price"})
        return trend.to_dict(orient="records")

    def get_options(self):
        """Return dropdown options derived from the dataset."""
        self.ensure_sample_data()
        return {
            "brands": sorted(self.df["brand"].unique().tolist()),
            "fuel_types": sorted(self.df["fuel_type"].unique().tolist()),
            "transmissions": sorted(self.df["transmission"].unique().tolist()),
            "year_min": int(self.df["year"].min()),
            "year_max": int(self.df["year"].max()),
        }


# Single shared instance used by Flask routes
model_service = CarPriceModel()
