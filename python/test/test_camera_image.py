from picamera2 import Picamera2
from datetime import datetime
import os

os.makedirs("output", exist_ok=True)

cam = Picamera2()
cam.configure(cam.create_still_configuration())
cam.start()

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
cam.capture_file(f"output/{timestamp}.jpg")
cam.stop()

print(f"Image saved: output/{timestamp}.jpg")