import os
import joblib
import pandas as pd

# 📁 Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🔮 Load trained models
crop_model = joblib.load(os.path.join(BASE_DIR, "crop_model.pkl"))
fertilizer_model = joblib.load(os.path.join(BASE_DIR, "fertilizer_model.pkl"))
yield_model = joblib.load(os.path.join(BASE_DIR, "yield_model.pkl"))

# 🌱 Crop Prediction
def crop_predict(values):
    df = pd.DataFrame([values], columns=[
        "N", "P", "K", "ph", "temperature", "humidity", "moisture"
    ])
    return crop_model.predict(df)[0]

# 💊 Fertilizer Prediction
def fertilizer_predict(values):
    df = pd.DataFrame([values], columns=[
        "N", "P", "K", "ph", "moisture"
    ])
    return fertilizer_model.predict(df)[0]

# 📈 Yield Prediction
def yield_predict(values):
    df = pd.DataFrame([values], columns=[
        "N", "P", "K", "temperature", "humidity", "moisture"
    ])
    return float(yield_model.predict(df)[0])
