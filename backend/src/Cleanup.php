<?php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../config.php';

use Src\Database;

$dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';

try {
    $db = new Database($dsn, DB_USER, DB_PASS);
    
    $db->execute("DELETE FROM voc_sensor_data WHERE created_at < NOW() - INTERVAL 30 DAY");
    $db->execute("DELETE FROM radar_sensor_data WHERE created_at < NOW() - INTERVAL 30 DAY");
    echo("cleaned up...");
    //This File is executed per Cronjob every day at 1am to delete every Data that is older than 30 Days
    
} catch (Exception $e) {
    echo($e);
}
?>