#!/usr/bin/env python3
"""
Simple MySQL connector test script.

This script connects to MySQL and inserts sample sensor data.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import mysql.connector

from db_config import DB_CONFIG

# Connect to MySQL
conn = mysql.connector.connect(
    host=DB_CONFIG['host'],
    user=DB_CONFIG['user'],
    password=DB_CONFIG['password'],
    database=DB_CONFIG['database'],
    port=DB_CONFIG['port']
)

cursor = conn.cursor()

# Create table if it doesn't exist
create_table = """
CREATE TABLE IF NOT EXISTS test (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature VARCHAR(10),
    air_pressure VARCHAR(10),
    relative_humidity VARCHAR(10),
    gas_resistance VARCHAR(10)
)
"""
cursor.execute(create_table)

# Example: Insert sensor data
add_data = ("INSERT INTO test "
           "(temperature, air_pressure, relative_humidity, gas_resistance) "
           "VALUES (%s, %s, %s, %s)")

sample_data = [
    ('20°C', '1013 hPa', '50%', '1000 Ohm'),
    ('22°C', '1015 hPa', '45%', '950 Ohm'),
    ('18°C', '1010 hPa', '60%', '1100 Ohm')
]

# Insert multiple rows
for data_row in sample_data:
    cursor.execute(add_data, data_row)

print(f"✓ Inserted {len(sample_data)} sensor readings")

# Query and display the data
cursor.execute("SELECT * FROM test LIMIT 5")
results = cursor.fetchall()

print("Recent sensor data:")
for row in results:
    print(f"  {row[1]} | {row[2]} | {row[3]} | {row[4]}")

# Commit the changes
conn.commit()

cursor.close()
conn.close()

print("✓ Database connection closed")