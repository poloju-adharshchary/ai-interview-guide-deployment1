import mysql.connector

DB_NAME = "ai_interview"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "adhi123"
}

def create_database():
    conn = mysql.connector.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"]
    )
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    conn.close()

def get_db():
    return mysql.connector.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        database=DB_NAME
    )
