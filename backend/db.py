import os
import psycopg2
from datetime import datetime

def connect_db():
    DATABASE_URL = os.environ.get("DATABASE_URL")

    if not DATABASE_URL:
        raise Exception("DATABASE_URL not set in environment variables")

    return psycopg2.connect(DATABASE_URL)

def init_sensor_table():
    """Create sensor_live and sensor_history tables if they don't exist"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        # Create sensor_live table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sensor_live (
                id SERIAL PRIMARY KEY,
                moisture FLOAT,
                ph FLOAT,
                temperature FLOAT,
                humidity FLOAT,
                N FLOAT,
                P FLOAT,
                K FLOAT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create sensor_history table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sensor_history (
                id SERIAL PRIMARY KEY,
                moisture FLOAT,
                ph FLOAT,
                temperature FLOAT,
                humidity FLOAT,
                N FLOAT,
                P FLOAT,
                K FLOAT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Sensor tables initialized")
    except Exception as e:
        print(f"❌ Error initializing tables: {e}")

def insert_sensor_data(temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph):
    """Insert sensor reading into sensor_live and sensor_history"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        # Insert into sensor_live (updates latest reading)
        cursor.execute("""
            INSERT INTO sensor_live 
            (temperature, humidity, N, P, K, moisture, ph)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph))
        
        # Also insert into sensor_history (keeps all readings)
        cursor.execute("""
            INSERT INTO sensor_history 
            (temperature, humidity, N, P, K, moisture, ph)
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
    """Get the most recent sensor reading from sensor_live"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT temperature, humidity, N, P, K, moisture, ph, timestamp
            FROM sensor_live
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

def get_sensor_history(limit=100):
    """Get sensor reading history"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT temperature, humidity, N, P, K, moisture, ph, timestamp
            FROM sensor_history
            ORDER BY timestamp DESC
            LIMIT %s
        """, (limit,))
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        if results:
            return [
                {
                    "temperature": row[0],
                    "humidity": row[1],
                    "nitrogen": row[2],
                    "phosphorus": row[3],
                    "potassium": row[4],
                    "moisture": row[5],
                    "ph": row[6],
                    "timestamp": row[7].isoformat() if row[7] else None
                }
                for row in results
            ]
        return []
    except Exception as e:
        print(f"❌ Error fetching history: {e}")
        return []
