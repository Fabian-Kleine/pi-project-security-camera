import RPi.GPIO as GPIO
import time

# Pin-Konfiguration
MELDER = 12  # Dein GPIO Pin für den HC-SR501

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(MELDER, GPIO.IN)

print("HC-SR501 Test gestartet...")
print("Warte auf Bewegung (Strg+C zum Beenden)\n")

# Kurz warten bis Sensor initialisiert ist
print("Sensor initialisiert sich (30 Sekunden)...")
time.sleep(30)
print("Bereit!\n")

try:
    while True:
        if GPIO.input(MELDER):
            print("Bewegung erkannt!")
            # Warten bis keine Bewegung mehr
            while GPIO.input(MELDER):
                time.sleep(0.1)
            print("Keine Bewegung mehr.\n")
        time.sleep(0.1)

except KeyboardInterrupt:
    print("\nProgramm beendet.")
    GPIO.cleanup()