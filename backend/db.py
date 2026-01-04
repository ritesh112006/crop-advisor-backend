import os
import psycopg2
from datetime import datetime

def connect_db():
    DATABASE_URL = os.environ.get("DATABASE_URL")

    if not DATABASE_URL:
        raise Exception("DATABASE_URL not set in environment variables")

    return psycopg2.connect(DATABASE_URL)

def init_sensor_table():
    """Create sensor_readings table if it doesn't exist"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sensor_readings (
                id SERIAL PRIMARY KEY,
                temperature FLOAT NOT NULL,
                humidity FLOAT NOT NULL,
                nitrogen INT NOT NULL,
                phosphorus INT NOT NULL,
                potassium INT NOT NULL,
                moisture FLOAT NOT NULL,
                ph FLOAT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Sensor table initialized")
    except Exception as e:
        print(f"❌ Error initializing table: {e}")

def insert_sensor_data(temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph):
    """Insert sensor reading into database"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO sensor_readings 
            (temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error inserting sensor data: {e}")
        return False

def get_latest_sensor_data():
    """Get the most recent sensor reading"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph, timestamp
            FROM sensor_readings
            ORDER BY timestamp DESC
            LIMIT 1
        """)
        
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if result:
            return {
                "temperature": result[0],
                "humidity": result[1],
                "nitrogen": result[2],
                "phosphorus": result[3],
                "potassium": result[4],
                "moisture": result[5],
                "ph": result[6],
                "timestamp": result[7].isoformat() if result[7] else None
            }
        return None
    except Exception as e:
        print(f"❌ Error fetching sensor data: {e}")
        return None
