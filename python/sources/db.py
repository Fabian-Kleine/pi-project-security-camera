import sys
import os
import json

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import mysql.connector
from db_config import DB_CONFIG

# Function to save sensor data to MySQL database
def save_sensor_data_to_db(table: str, data: dict):
    """Save the provided data dictionary to the specified MySQL table."""
    try:
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
            port=DB_CONFIG.get('port', 3306),
        )
    except mysql.connector.Error as e:
        print(f'Failed to connect to MySQL: {e}')
        raise SystemExit(1)
    
    cursor = conn.cursor()

    jsonData = json.dumps(data)

    jsonStringData = "'" + jsonData + "'"

    sql = f"INSERT INTO {table} (sensor_data) VALUES ({jsonStringData})"

    cursor.execute(sql)
    conn.commit()
    cursor.close()
    conn.close()