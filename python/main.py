from sources.motion_sensor import MotionSensor
from sources.camera import capture_video_and_thumbnail
from sources.db import save_video_to_db


def main():
    sensor = MotionSensor()
    print("Warte auf Bewegung...\n")

    try:
        while True:
            sensor.wait_for_motion()
            print("Bewegung erkannt! Aufnahme startet...")

            video_path, thumbnail_path = capture_video_and_thumbnail()
            print(f"Video gespeichert: {video_path}")
            print(f"Thumbnail gespeichert: {thumbnail_path}")

            save_video_to_db(video_path, thumbnail_path)
            print("Daten in DB gespeichert.\n")

            sensor.wait_for_no_motion()
            print("Keine Bewegung mehr. Warte...\n")

    except KeyboardInterrupt:
        print("\nProgramm beendet.")
        sensor.cleanup()


if __name__ == "__main__":
    main()
