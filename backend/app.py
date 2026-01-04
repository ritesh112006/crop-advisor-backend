from flask import Flask, request, jsonify
from flask_cors import CORS
import socket
import os

# Ensure API key is set
if not os.environ.get("OPENWEATHER_API_KEY"):
    os.environ["OPENWEATHER_API_KEY"] = "3674438b387e43d455aa09366751ac66"

from weather_api import get_weather
from db import init_sensor_table, insert_sensor_data, get_latest_sensor_data

app = Flask(__name__)
CORS(app)

# Initialize sensor table on startup
init_sensor_table()

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
# SENSOR DATA ENDPOINTS
# ------------------------------------
@app.route("/sensor_data", methods=["POST"])
def receive_sensor_data():
    """Receive sensor data from ESP32"""
    try:
        data = request.json
        
        # Validate required fields
        required = ["temperature", "humidity", "N", "P", "K", "moisture", "ph"]
        if not all(field in data for field in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Insert into database
        success = insert_sensor_data(
            temperature=data["temperature"],
            humidity=data["humidity"],
            nitrogen=data["N"],
            phosphorus=data["P"],
            potassium=data["K"],
            moisture=data["moisture"],
            ph=data["ph"]
        )
        
        if success:
            return jsonify({"status": "success", "message": "Data received"}), 200
        else:
            return jsonify({"status": "error", "message": "Failed to save data"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/sensor/latest", methods=["GET"])
def get_sensor_latest():
    """Get latest sensor reading"""
    try:
        data = get_latest_sensor_data()
        if data:
            return jsonify(data), 200
        else:
            return jsonify({"error": "No sensor data available"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------------
# SERVER START
# ------------------------------------
if __name__ == "__main__":
    ip = socket.gethostbyname(socket.gethostname())
    print("\n🚀 SERVER RUNNING")
    print(f"➡️ Local : http://127.0.0.1:5000")
    print(f"➡️ Network : http://{ip}:5000\n")
    app.run(host="127.0.0.1", port=5000, debug=False, threaded=True)
