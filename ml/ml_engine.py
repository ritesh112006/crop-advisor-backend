import os
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

crop_model = joblib.load(os.path.join(BASE_DIR, "crop_model.pkl"))
fertilizer_model = joblib.load(os.path.join(BASE_DIR, "fertilizer_model.pkl"))
yield_model = joblib.load(os.path.join(BASE_DIR, "yield_model.pkl"))

def crop_predict(values):
    return crop_model.predict([values])[0]

def fertilizer_predict(values):
    return fertilizer_model.predict([values])[0]

def yield_predict(values):
    return float(yield_model.predict([values])[0])
