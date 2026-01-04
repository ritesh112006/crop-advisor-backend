from flask import Flask, request, jsonify
from flask_cors import CORS
import socket
import os

# Ensure API key is set
if not os.environ.get("OPENWEATHER_API_KEY"):
    os.environ["OPENWEATHER_API_KEY"] = "3674438b387e43d455aa09366751ac66"

from weather_api import get_weather

app = Flask(__name__)
CORS(app)

# ------------------------------------
# ROOT CHECK
# ------------------------------------
@app.route("/", methods=["GET"])
def home():
    return {"message": "Crop Advisor API Running 🚜"}

# ------------------------------------
# WEATHER API ENDPOINT
# ------------------------------------
@app.route("/weather", methods=["GET"])
def weather():
    city = request.args.get("city", "Pune")
    weather_data = get_weather(city)
    return jsonify(weather_data)

# ------------------------------------
# SERVER START
# ------------------------------------
if __name__ == "__main__":
    ip = socket.gethostbyname(socket.gethostname())
    print("\n🚀 SERVER RUNNING")
    print(f"➡️ Local : http://127.0.0.1:5000")
    print(f"➡️ Network : http://{ip}:5000\n")
    app.run(host="127.0.0.1", port=5000, debug=False, threaded=True)
