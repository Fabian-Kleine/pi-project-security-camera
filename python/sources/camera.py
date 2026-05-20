from picamera2 import Picamera2
from picamera2.outputs import FfmpegOutput
from picamera2.encoders import H264Encoder
from datetime import datetime
import os
import time

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'output')


def capture_video_and_thumbnail(output_dir=OUTPUT_DIR):
    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    thumbnail_path = os.path.abspath(os.path.join(output_dir, f"{timestamp}_thumb.jpg"))
    video_path = os.path.abspath(os.path.join(output_dir, f"{timestamp}.mp4"))

    cam = Picamera2()

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

    return video_path, thumbnail_path
