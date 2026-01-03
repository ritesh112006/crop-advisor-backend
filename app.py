from flask import Flask, request, jsonify
from flask_cors import CORS
from db import connect_db
import socket

# 🤖 ML imports
from ml.ml_engine import crop_predict, fertilizer_predict, yield_predict

app = Flask(__name__)
CORS(app)

# 🏡 ROOT ROUTE
@app.route("/", methods=["GET"])
def home():
    return {"message": "Crop Advisor API Running 🚜"}

# 🧪 TEST SAVE (GET – browser friendly)
@app.route("/testsave", methods=["GET"])
def testsave():
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO sensor_live (moisture, ph, temperature, humidity, N, P, K)
            VALUES (45, 6.5, 28, 70, 90, 45, 30)
        """)
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "saved test row 👍"}
    except Exception as e:
        return {"status": "error", "message": str(e)}, 500

# 📩 ESP32 → SEND SENSOR DATA
@app.route("/sensor_data", methods=["POST"])
def sensor_data():
    try:
        data = request.json
        print("📥 Incoming Data:", data)

        conn = connect_db()
        cur = conn.cursor()

        query = """
            INSERT INTO sensor_live (moisture, ph, temperature, humidity, N, P, K)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        values = (
            data.get("moisture"),
            data.get("ph"),
            data.get("temperature"),
            data.get("humidity"),
            data.get("N"),
            data.get("P"),
            data.get("K")
        )

        cur.execute(query, values)
        cur.execute(query.replace("sensor_live", "sensor_history"), values)

        conn.commit()
        cur.close()
        conn.close()

        return {"status": "success", "message": "Data saved 👍"}, 201

    except Exception as e:
        print("❌ ERROR in /sensor_data:", e)
        return {"status": "error", "message": str(e)}, 500

# 📍 DASHBOARD → LATEST DATA
@app.route("/latest", methods=["GET"])
def latest():
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM sensor_live ORDER BY id DESC LIMIT 1")
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {"message": "No data available"}, 404

        keys = ["id","moisture","ph","temperature","humidity","N","P","K","timestamp"]
        return jsonify(dict(zip(keys, row)))

    except Exception as e:
        return {"status": "error", "message": str(e)}, 500

# 🤖 ML PREDICTION ROUTE (RENDER SAFE)
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        crop_res = crop_predict([
            data["N"], data["P"], data["K"],
            data["ph"], data["temperature"],
            data["humidity"], data["moisture"]
        ])

        fert_res = fertilizer_predict([
            data["N"], data["P"], data["K"],
            data["ph"], data["moisture"]
        ])

        yield_res = yield_predict([
            data["N"], data["P"], data["K"],
            data["temperature"], data["humidity"],
            data["moisture"]
        ])

        return {
            "recommended_crop": crop_res,
            "recommended_fertilizer": fert_res,
            "predicted_yield_ton_per_hectare": yield_res
        }, 200

    except Exception as e:
        print("❌ ERROR in /predict:", e)
        return {"status": "error", "message": str(e)}, 500

# 🚀 SERVER START
if __name__ == "__main__":
    ip = socket.gethostbyname(socket.gethostname())
    print("\n🚀 CROP ADVISOR SERVER STARTED")
    print(f"➡️ Local  : http://127.0.0.1:5000")
    print(f"➡️ Network: http://{ip}:5000\n")
    app.run(host="0.0.0.0", port=5000)
