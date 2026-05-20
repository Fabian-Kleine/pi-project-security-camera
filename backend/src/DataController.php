<?php
declare(strict_types=1);

namespace Src;
//This file contains the functions that are used in the index.php which are creating the SQL Statement and executes it

class DataController
{
    private Database $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    public function index(): void 
    {
        $data = "
            SELECT 
                *
            FROM videos
        ";
        $data = $this->db->fetchAll($radarQuery);
        
        Response::json($data);
    }

    public function getDataPeriod($startDate, $endDate): void {
         $radarQuery = "
        SELECT 
            id, 
            sensor_data, 
            created_at 
        FROM radar_sensor_data 
        WHERE created_at BETWEEN ? AND ? 
        ORDER BY created_at DESC
        ";

        $radarData = $this->db->fetchAll($radarQuery, [$startDate, $endDate]);

        $vocQuery = "
            SELECT 
                id, 
                sensor_data, 
                created_at 
            FROM voc_sensor_data 
            WHERE created_at BETWEEN ? AND ? 
            ORDER BY created_at DESC
            ";

        $vocData = $this->db->fetchAll($vocQuery, [$startDate, $endDate]); //Parses the Parameters from the GET Request to insert it to the SQL Statetment

        $groupedData = [
            'radar_sensor' => $radarData,
            'voc_sensor' => $vocData
        ];
        
        Response::json($groupedData);
    }

    public function getVocData(): void {
        $query = "
            SELECT
                *
            FROM voc_sensor_data
        ";
        $data = $this->db->fetchAll($query);
        Response::json($data);
    }

    public function getVocDataPeriod($startDate, $endDate): void {
         $query = "
            SELECT 
                id, 
                sensor_data, 
                created_at 
            FROM voc_sensor_data 
            WHERE created_at BETWEEN ? AND ? 
            ORDER BY created_at DESC
            ";

        $data = $this->db->fetchAll($query, [$startDate, $endDate]);
        Response::json($data);
    }

    public function getRadarData(): void {
        $query = "
            SELECT
                *
            FROM radar_sensor_data
        ";
        $data = $this->db->fetchAll($query);
        Response::json($data);
    }

    public function getRadarDataPeriod($startDate, $endDate): void {
         $query = "
            SELECT 
                id, 
                sensor_data, 
                created_at 
            FROM radar_sensor_data 
            WHERE created_at BETWEEN ? AND ? 
            ORDER BY created_at DESC
        ";

        $data = $this->db->fetchAll($query, [$startDate, $endDate]);
        Response::json($data);
    }

    public function getRegressionData(): void {
        $query = "
            SELECT 
                voc_value,
                temperature,
                persons_estimated
            FROM training_data
            ORDER BY timestamp ASC
        ";

        $data = $this->db->fetchAll($query);
        Response::json($data);
    }

}