import os
import psycopg2
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

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
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(255),
                location VARCHAR(255),
                latitude FLOAT,
                longitude FLOAT,
                crop_type VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create sensor_live table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sensor_live (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id),
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
                user_id INT REFERENCES users(id),
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
        
        # Create alerts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id),
                alert_type VARCHAR(50),
                message TEXT,
                severity VARCHAR(20),
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create chat_history table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id),
                message_type VARCHAR(20),
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database tables initialized")
    except Exception as e:
        print(f"❌ Error initializing tables: {e}")

# ======================== USER FUNCTIONS ========================

def register_user(email, password, full_name, location, crop_type, latitude=None, longitude=None):
    """Register a new user"""
    try:
        password_hash = generate_password_hash(password)
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO users (email, password_hash, full_name, location, crop_type, latitude, longitude)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (email, password_hash, full_name, location, crop_type, latitude, longitude))
        
        user_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        return {"success": True, "user_id": user_id}
    except Exception as e:
        print(f"❌ Error registering user: {e}")
        return {"success": False, "error": str(e)}

def login_user(email, password):
    """Verify user credentials"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, password_hash, full_name, email FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if result and check_password_hash(result[1], password):
            return {"success": True, "user_id": result[0], "full_name": result[2], "email": result[3]}
        return {"success": False, "error": "Invalid credentials"}
    except Exception as e:
        print(f"❌ Error logging in: {e}")
        return {"success": False, "error": str(e)}

def get_user_by_email(email):
    """Get user details by email"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, email, full_name, location, latitude, longitude, crop_type
            FROM users WHERE email = %s
        """, (email,))
        
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if result:
            return {
                "id": result[0],
                "email": result[1],
                "full_name": result[2],
                "location": result[3],
                "latitude": result[4],
                "longitude": result[5],
                "crop_type": result[6]
            }
        return None
    except Exception as e:
        print(f"❌ Error fetching user: {e}")
        return None

def get_user_by_id(user_id):
    """Get user details by user ID"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, email, full_name, location, latitude, longitude, crop_type
            FROM users WHERE id = %s
        """, (user_id,))
        
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if result:
            return {
                "id": result[0],
                "email": result[1],
                "full_name": result[2],
                "location": result[3],
                "latitude": result[4],
                "longitude": result[5],
                "crop_type": result[6]
            }
        return None
    except Exception as e:
        print(f"❌ Error fetching user: {e}")
        return None

# ======================== SENSOR DATA FUNCTIONS ========================

def insert_sensor_data(user_id, temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph):
    """Insert sensor reading into sensor_live and sensor_history"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        # Insert into sensor_live (updates latest reading)
        cursor.execute("""
            INSERT INTO sensor_live 
            (user_id, temperature, humidity, N, P, K, moisture, ph)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (user_id, temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph))
        
        # Also insert into sensor_history (keeps all readings)
        cursor.execute("""
            INSERT INTO sensor_history 
            (user_id, temperature, humidity, N, P, K, moisture, ph)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (user_id, temperature, humidity, nitrogen, phosphorus, potassium, moisture, ph))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error inserting sensor data: {e}")
        return False

def get_latest_sensor_data(user_id):
    """Get the most recent sensor reading from sensor_live"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT temperature, humidity, N, P, K, moisture, ph, timestamp
            FROM sensor_live
            WHERE user_id = %s
            ORDER BY timestamp DESC
            LIMIT 1
        """, (user_id,))
        
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
                "moisture": 68.0,  # STATIC VALUE - Fixed at 68%
                "ph": 6.5,         # STATIC VALUE - Fixed at 6.5
                "timestamp": result[7].isoformat() if result[7] else None
            }
        return None
    except Exception as e:
        print(f"❌ Error fetching sensor data: {e}")
        return None

def get_sensor_history(user_id, limit=100):
    """Get sensor reading history"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT temperature, humidity, N, P, K, moisture, ph, timestamp
            FROM sensor_history
            WHERE user_id = %s
            ORDER BY timestamp DESC
            LIMIT %s
        """, (user_id, limit))
        
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

# ======================== ALERT FUNCTIONS ========================

def create_alert(user_id, alert_type, message, severity="info"):
    """Create a new alert"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO alerts (user_id, alert_type, message, severity)
            VALUES (%s, %s, %s, %s)
        """, (user_id, alert_type, message, severity))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error creating alert: {e}")
        return False

def get_user_alerts(user_id, limit=20):
    """Get user's alerts"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, alert_type, message, severity, is_read, created_at
            FROM alerts
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT %s
        """, (user_id, limit))
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [
            {
                "id": row[0],
                "alert_type": row[1],
                "message": row[2],
                "severity": row[3],
                "is_read": row[4],
                "created_at": row[5].isoformat() if row[5] else None
            }
            for row in results
        ]
    except Exception as e:
        print(f"❌ Error fetching alerts: {e}")
        return []

# ======================== CHAT HISTORY FUNCTIONS ========================

def save_chat_message(user_id, message_type, content):
    """Save chat message to database (user or bot)"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO chat_history (user_id, message_type, content)
            VALUES (%s, %s, %s)
        """, (user_id, message_type, content))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error saving chat message: {e}")
        return False

def get_chat_history(user_id, limit=50):
    """Get user's chat history"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, message_type, content, created_at
            FROM chat_history
            WHERE user_id = %s
            ORDER BY created_at ASC
            LIMIT %s
        """, (user_id, limit))
        
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [
            {
                "id": row[0],
                "type": row[1],
                "content": row[2],
                "time": row[3].isoformat() if row[3] else None
            }
            for row in results
        ]
    except Exception as e:
        print(f"❌ Error fetching chat history: {e}")
        return []

def clear_chat_history(user_id):
    """Clear user's chat history"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            DELETE FROM chat_history
            WHERE user_id = %s
        """, (user_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error clearing chat history: {e}")
        return False
