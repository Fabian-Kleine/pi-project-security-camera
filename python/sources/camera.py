import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from picamera2 import Picamera2
from picamera2.outputs import FfmpegOutput
from picamera2.encoders import H264Encoder
from datetime import datetime
import time
from db_config import OUTPUT_DIR


def capture_video_and_thumbnail(output_dir=OUTPUT_DIR):
    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    thumbnail_filename = f"{timestamp}_thumb.jpg"
    video_filename = f"{timestamp}.mp4"
    thumbnail_path = os.path.join(output_dir, thumbnail_filename)
    video_path = os.path.join(output_dir, video_filename)

    cam = Picamera2()
    try:
        cam.configure(cam.create_still_configuration())
        cam.start()
        cam.capture_file(thumbnail_path)
        cam.stop()

        cam.configure(cam.create_video_configuration())
        encoder = H264Encoder()
        cam.start()
        time.sleep(2)  # Kamera warm-up
        cam.start_recording(encoder, FfmpegOutput(video_path))
        time.sleep(5)  # Aufnahmedauer
        cam.stop_recording()
        cam.stop()
    finally:
        cam.close()

    return video_filename, thumbnail_filename
