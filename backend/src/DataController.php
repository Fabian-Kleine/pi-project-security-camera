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
        $data = $this->db->fetchAll('SELECT * FROM videos');
        Response::json($data);
    }

    //Function for pagination so that the frontend is more efficient in loading the videos
    public function paginate(): void
    {
        //Pulling Parameters from Get Request for the Pagination
        $page  = max(1, (int)($_GET['page']  ?? 1));
        $limit = max(1, min(100, (int)($_GET['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;
        //Fetching the count of all Database Entities
        $total = (int)($this->db->fetch('SELECT COUNT(*) AS cnt FROM videos')['cnt'] ?? 0);
        //Preparing the SQL Query for the Pagination
        $stmt = $this->db->getPdo()->prepare(
            'SELECT * FROM videos ORDER BY timestamp DESC LIMIT :limit OFFSET :offset'
        );
        //Inserting the limit and offset into the Query
        $stmt->bindValue(':limit',  $limit,  \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll();
        //Building Response with Response class
        Response::json([
            'data'        => $data,
            'pagination'  => [
                'page'        => $page,
                'limit'       => $limit,
                'total'       => $total,
                'total_pages' => (int)ceil($total / $limit),
            ],
        ]);
    }
}