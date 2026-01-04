import os
import psycopg2

def connect_db():
    DATABASE_URL = os.environ.get("DATABASE_URL")

    if not DATABASE_URL:
        raise Exception("DATABASE_URL not set in environment variables")

    return psycopg2.connect(DATABASE_URL)
