# Pi-Project Security Camera – Fabian Kleine und Gian-Lucca Kaworsky

## Einrichten des Projekts auf dem Pi

Das Repository liegt einmal unter `/var/www/html/pi-project-security-camera` für das PHP-Backend und einmal unter `/home/it/pi-project-security-camera` um das Python-Script auszuführen.

## Python-Script starten

### Virtual Environment einrichten (einmalig)

Falls noch keine `.venv` existiert, muss sie zuerst erstellt werden:

```bash
python3 -m venv python/.venv
pip install -r python/requirements.txt
```

### Virtual Environment aktivieren

```bash
source python/.venv/bin/activate
```

### Script ausführen

```bash
python3 python/main.py
```

Das Script wartet auf eine Bewegungserkennung durch den HC-SR501 PIR-Sensor. Wird Bewegung erkannt, nimmt die Kamera automatisch ein Video auf und speichert einen Thumbnail in der Datenbank. Das Programm läuft in einer Endlosschleife und wird mit `Ctrl+C` beendet.

## Backend

Im `backend`-Ordner liegt ein PHP-Projekt, welches mit PDO eine Verbindung zur Datenbank aufbaut und eine API bereitstellt.

## Verkabelung

### HC-SR501 Bewegungssensor

| Sensor | Pi |
| --- | --- |
| VCC | 5V |
| OUT | GPIO 12 |
| GND | GND |

### Raspberry Pi Kamera

Die Kamera wird über den CSI-Anschluss des Raspberry Pi verbunden.

### Bilder der Schaltung

#### Bewegungssensor (HC-SR501)

![Bewegungssensor Schaltung](./images/motion_sensor.jpg)

#### Kamera

![Kamera Anschluss](./images/camera.jpg)
