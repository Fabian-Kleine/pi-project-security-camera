import RPi.GPIO as GPIO
import time

MELDER_PIN = 12


class MotionSensor:
    def __init__(self, pin=MELDER_PIN, init_time=30):
        self.pin = pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.pin, GPIO.IN)
        print(f"Sensor initialisiert sich ({init_time} Sekunden)...")
        time.sleep(init_time)
        print("Bereit!")

    def is_motion_detected(self):
        return bool(GPIO.input(self.pin))

    def wait_for_motion(self):
        while not self.is_motion_detected():
            time.sleep(0.1)

    def wait_for_no_motion(self):
        while self.is_motion_detected():
            time.sleep(0.1)

    def cleanup(self):
        GPIO.cleanup()
