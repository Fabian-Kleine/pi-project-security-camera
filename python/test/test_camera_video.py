from picamera2 import Picamera2
from picamera2.outputs import FfmpegOutput
from picamera2.encoders import H264Encoder
from datetime import datetime
import os
import time

os.makedirs("output", exist_ok=True)

cam = Picamera2()
cam.configure(cam.create_video_configuration())
encoder = H264Encoder()

cam.start()
time.sleep(2)  # Kamera warm-up

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
output_path = f"output/{timestamp}.mp4"

cam.start_recording(encoder, FfmpegOutput(output_path))
time.sleep(5)  # eigentliche Aufnahmedauer
cam.stop_recording()

print(f"Video saved: {output_path}")