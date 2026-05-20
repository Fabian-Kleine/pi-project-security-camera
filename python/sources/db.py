import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import mysql.connector
from db_config import DB_CONFIG

def save_video_to_db(video_url: str, thumbnail_url: str):
    """Save video and thumbnail paths to the videos table."""
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
    sql = "INSERT INTO videos (video_url, video_thumbnail_url) VALUES (%s, %s)"
    cursor.execute(sql, (video_url, thumbnail_url))
    conn.commit()
    cursor.close()
    conn.close()