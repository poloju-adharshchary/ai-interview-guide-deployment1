import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

DB_NAME = os.getenv("DB_NAME")

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "port": os.getenv("DB_PORT")

}

def create_database():
    pass

def get_db():
    return mysql.connector.connect(
        host=DB_CONFIG["host"],
        port=int(DB_CONFIG["port"]),
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        database=DB_NAME
    )
