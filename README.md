# CarPriceAI

Full-stack machine learning web app that predicts used car prices with a **Random Forest** model.

- **Frontend:** React, Vite, Tailwind CSS, Recharts  
- **Backend:** Flask, scikit-learn, pandas
- The Project Website Link :https://carpriceai.vercel.app/

## Features

- Loads a sample car dataset automatically (generated on first run if missing)
- Trains a Random Forest regressor
- Predicts price from: brand, mileage, fuel type, year, horsepower, transmission
- Shows predicted price, confidence bar, and price range
- Feature importance bar chart and average price-by-year trend chart
- Responsive dark UI

## Prerequisites

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/) (recommended)

## Quick start

### 1. Backend (terminal 1)

```bash
cd backend
python -m venv venv
```

**Windows (PowerShell):**

```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

**macOS / Linux:**

```bash
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

API runs at **http://localhost:5000**

### 2. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

### 3. Use the app

1. Wait for the dataset preview to load.  
2. Click **Train Random Forest**.  
3. Fill in car details and click **Get prediction**.  
4. View charts after training.

## VS Code setup

1. **File → Open Folder** → select this project root.  
2. Install extensions (recommended):  
   - Python  
   - Pylance  
   - ESLint (optional)  
3. Select Python interpreter: `backend/venv/Scripts/python.exe` (Windows) or `backend/venv/bin/python` (Mac/Linux).  
4. Use **Terminal → New Terminal** for backend and frontend commands above.

Optional: open `.vscode/tasks.json` and run **Start CarPriceAI** to launch both servers (after dependencies are installed).

## Project structure

```
CarPriceAI/
├── backend/
│   ├── app.py              # Flask API routes
│   ├── ml_service.py         # Dataset, training, prediction
│   ├── data/                 # cars_sample.csv (auto-created)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/client.js
│   │   └── components/
│   └── package.json
└── README.md
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dataset` | Dataset preview |
| GET | `/api/options` | Form dropdown values |
| POST | `/api/train` | Train model |
| POST | `/api/predict` | Predict price |
| GET | `/api/charts/feature-importance` | Top features |
| GET | `/api/charts/price-trend` | Avg price by year |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Frontend shows API error | Start Flask on port 5000 first |
| `pip` not found | Use `python -m pip install -r requirements.txt` |
| PowerShell blocks venv | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Port in use | Change port in `app.py` or `vite.config.js` |

## License

Educational project for CodeAlpha.
