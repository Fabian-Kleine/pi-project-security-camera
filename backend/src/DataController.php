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
        $data = $this->db->fetchAll($data);
        
        Response::json($data);
    }
}