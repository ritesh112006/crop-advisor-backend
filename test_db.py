print("🔍 Running test_db.py...")

import psycopg2

try:
    conn = psycopg2.connect(
        host="127.0.0.1",
        port="5433",                 # MUST BE 5433
        database="postgres",
        user="postgres",
        password="tanishq@11"
    )
    print("🔥 Connected to PostgreSQL successfully!")
    conn.close()

except Exception as e:
    print("❌ Connection failed:", e)

