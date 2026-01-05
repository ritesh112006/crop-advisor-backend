from flask import Flask, request, jsonify
from flask_cors import CORS
import socket
import os
import jwt
from functools import wraps
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load .env file for local development
load_dotenv()

# Ensure API key is set
if not os.environ.get("OPENWEATHER_API_KEY"):
    os.environ["OPENWEATHER_API_KEY"] = "3674438b387e43d455aa09366751ac66"

from weather_api import get_weather
from db import (
    init_sensor_table, insert_sensor_data, get_latest_sensor_data, 
    get_sensor_history, get_user_by_email, register_user, login_user,
    get_user_alerts, create_alert
)
from alerts import check_sensor_health, calculate_crop_health
from maileroo import send_alert_email, send_welcome_email
from gemini_ai import get_farming_advice, get_crop_health_recommendation

app = Flask(__name__)
CORS(app)

# JWT Secret
JWT_SECRET = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")

# Initialize sensor tables on startup
init_sensor_table()

# ======================== JWT HELPER ========================
def create_token(user_id, email):
    """Create JWT token"""
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except:
        return None

def token_required(f):
    """Decorator to require valid token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token missing"}), 401
        
        token = token.replace("Bearer ", "")
        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Invalid token"}), 401
        
        request.user_id = payload.get("user_id")
        request.email = payload.get("email")
        return f(*args, **kwargs)
    return decorated

# ------------------------------------
# ROOT CHECK
# ------------------------------------
@app.route("/", methods=["GET"])
def home():
    return {"message": "Crop Advisor API Running 🚜"}

# ------------------------------------
# AUTHENTICATION ENDPOINTS
# ------------------------------------
@app.route("/auth/register", methods=["POST"])
def register():
    """Register new user"""
    try:
        data = request.json
        
        # Validate required fields
        required = ["email", "password", "full_name", "location", "crop_type"]
        if not all(field in data for field in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Register user
        result = register_user(
            email=data["email"],
            password=data["password"],
            full_name=data["full_name"],
            location=data["location"],
            crop_type=data["crop_type"],
            latitude=data.get("latitude"),
            longitude=data.get("longitude")
        )
        
        if result["success"]:
            user_id = result["user_id"]
            token = create_token(user_id, data["email"])
            
            # Send welcome email
            send_welcome_email(data["email"], data["full_name"])
            
            return jsonify({
                "status": "success",
                "message": "User registered",
                "token": token,
                "user_id": user_id
            }), 201
        else:
            return jsonify({"error": result.get("error", "Registration failed")}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/auth/login", methods=["POST"])
def login():
    """Login user"""
    try:
        data = request.json
        
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400
        
        result = login_user(data["email"], data["password"])
        
        if result["success"]:
            token = create_token(result["user_id"], result["email"])
            return jsonify({
                "status": "success",
                "token": token,
                "user_id": result["user_id"],
                "full_name": result["full_name"]
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/auth/me", methods=["GET"])
@token_required
def get_user_info():
    """Get current user info"""
    try:
        user = get_user_by_email(request.email)
        if user:
            return jsonify(user), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    """Receive sensor data from ESP32 (requires user_id)"""
    try:
        data = request.json
        
        # Validate required fields
        required = ["temperature", "humidity", "N", "P", "K", "moisture", "ph", "user_id"]
        if not all(field in data for field in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        user_id = data["user_id"]
        
        # Insert into database
        success = insert_sensor_data(
            user_id=user_id,
            temperature=data["temperature"],
            humidity=data["humidity"],
            nitrogen=data["N"],
            phosphorus=data["P"],
            potassium=data["K"],
            moisture=data["moisture"],
            ph=data["ph"]
        )
        
        if success:
            # Check for alerts
            sensor_data = {
                "temperature": data["temperature"],
                "humidity": data["humidity"],
                "nitrogen": data["N"],
                "phosphorus": data["P"],
                "potassium": data["K"],
                "moisture": data["moisture"],
                "ph": data["ph"]
            }
            check_sensor_health(user_id, sensor_data)
            
            return jsonify({"status": "success", "message": "Data received"}), 200
        else:
            return jsonify({"status": "error", "message": "Failed to save data"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/sensor/latest", methods=["GET"])
@token_required
def get_sensor_latest():
    """Get latest sensor reading"""
    try:
        data = get_latest_sensor_data(request.user_id)
        if data:
            health = calculate_crop_health(data)
            data["health_status"] = health
            return jsonify(data), 200
        else:
            return jsonify({"error": "No sensor data available"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/sensor/history", methods=["GET"])
@token_required
def get_history():
    """Get sensor reading history"""
    try:
        limit = request.args.get("limit", 100, type=int)
        data = get_sensor_history(request.user_id, limit=limit)
        return jsonify({"count": len(data), "data": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------------
# ALERT ENDPOINTS
# ------------------------------------
@app.route("/alerts", methods=["GET"])
@token_required
def get_alerts():
    """Get user's alerts"""
    try:
        alerts = get_user_alerts(request.user_id)
        return jsonify({"count": len(alerts), "alerts": alerts}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------------
# AI CHATBOT ENDPOINTS
# ------------------------------------
@app.route("/ai/chat", methods=["POST"])
@token_required
def chat():
    """Chat with AI - Enhanced with sensor data, weather, and crop context"""
    try:
        data = request.json
        query = data.get("message")
        
        print(f"🔵 /ai/chat endpoint called with message: {query[:50]}...")
        
        if not query:
            return jsonify({"error": "Message required"}), 400
        
        # Get user info for context
        user = get_user_by_email(request.email)
        sensor_data = get_latest_sensor_data(request.user_id)
        
        print(f"✅ User: {user.get('email') if user else 'None'}")
        print(f"✅ Sensor data available: {sensor_data is not None}")
        
        # Get weather data for user's location
        weather_data = None
        if user and user.get("location"):
            try:
                weather_data = get_weather(user.get("location"))
                print(f"✅ Weather data fetched for {user.get('location')}")
            except Exception as we:
                print(f"⚠️ Could not fetch weather: {we}")
                weather_data = None
        
        # Build enhanced context
        context = f"Crop Type: {user.get('crop_type') if user else 'Unknown'}\n"
        
        if sensor_data:
            context += f"""
Recent Sensor Data:
- Soil Moisture: {sensor_data.get('moisture', 'N/A')}%
- pH Level: {sensor_data.get('ph', 'N/A')}
- Temperature: {sensor_data.get('temperature', 'N/A')}°C
- Humidity: {sensor_data.get('humidity', 'N/A')}%
- NPK: N={sensor_data.get('nitrogen', 'N/A')}, P={sensor_data.get('phosphorus', 'N/A')}, K={sensor_data.get('potassium', 'N/A')} ppm
"""
        
        if weather_data and weather_data.get("list") and len(weather_data["list"]) > 0:
            current_weather = weather_data["list"][0]
            context += f"""
Current Weather:
- Temperature: {current_weather.get('main', {}).get('temp', 'N/A')}°C
- Humidity: {current_weather.get('main', {}).get('humidity', 'N/A')}%
- Condition: {current_weather.get('weather', [{}])[0].get('description', 'N/A')}
- Wind Speed: {current_weather.get('wind', {}).get('speed', 'N/A')} m/s
- Rainfall: {current_weather.get('rain', {}).get('3h', 0)} mm
"""
        
        print(f"🟡 Calling get_farming_advice()...")
        # Get advice from AI with enhanced context
        advice = get_farming_advice(
            query,
            sensor_data=sensor_data,
            crop_type=user.get("crop_type") if user else None,
            weather_data=None  # Weather data formatting is complex, simplified for now
        )
        
        print(f"✅ Got response from AI: {advice[:100]}...")
        return jsonify({"response": advice}), 200
        
        return jsonify({"response": advice}), 200
    except Exception as e:
        print(f"❌ Error in /ai/chat endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/ai/recommendation", methods=["GET"])
@token_required
def get_recommendation():
    """Get AI health recommendation"""
    try:
        user = get_user_by_email(request.email)
        sensor_data = get_latest_sensor_data(request.user_id)
        
        if not sensor_data:
            return jsonify({"error": "No sensor data available"}), 404
        
        recommendation = get_crop_health_recommendation(
            sensor_data,
            user.get("crop_type") if user else "General"
        )
        
        return jsonify({"recommendation": recommendation}), 200
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
