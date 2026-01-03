import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🌾 Crop Model Training
crop_data = pd.read_csv(os.path.join(BASE_DIR, "crop_dataset.csv"))
X_crop = crop_data[["N","P","K","ph","temperature","humidity","moisture"]]
y_crop = crop_data["crop"]
crop_model = RandomForestClassifier()
crop_model.fit(X_crop, y_crop)
joblib.dump(crop_model, os.path.join(BASE_DIR, "crop_model.pkl"))
print("🌾 crop_model.pkl SAVED")

# 🌱 Fertilizer Model Training
fert_data = pd.read_csv(os.path.join(BASE_DIR, "fertilizer_dataset.csv"))
X_fert = fert_data[["N","P","K","ph","moisture"]]
y_fert = fert_data["fertilizer"]
fert_model = RandomForestClassifier()
fert_model.fit(X_fert, y_fert)
joblib.dump(fert_model, os.path.join(BASE_DIR, "fertilizer_model.pkl"))
print("🧪 fertilizer_model.pkl SAVED")

# 📈 Yield Model Training
yield_data = pd.read_csv(os.path.join(BASE_DIR, "yield_dataset.csv"))
X_yield = yield_data[["N","P","K","temperature","humidity","moisture"]]
y_yield = yield_data["yield"]
yield_model = RandomForestRegressor()
yield_model.fit(X_yield, y_yield)
joblib.dump(yield_model, os.path.join(BASE_DIR, "yield_model.pkl"))
print("📊 yield_model.pkl SAVED")
