import psycopg2

def connect_db():
    try:
        conn = psycopg2.connect(
            host="127.0.0.1",
            port="5433",
            database="crop_advisor",
            user="postgres",
            password="tanishq@11"
        )
        return conn
    except Exception as e:
        print("❌ Database Connection Error:", e)
        return None
