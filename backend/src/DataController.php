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

    public function paginate(): void
    {
        $page  = max(1, (int)($_GET['page']  ?? 1));
        $limit = max(1, min(100, (int)($_GET['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;

        $total = (int)($this->db->fetch('SELECT COUNT(*) AS cnt FROM videos')['cnt'] ?? 0);
        $data  = $this->db->fetchAll(
            'SELECT * FROM videos ORDER BY created_at DESC LIMIT :limit OFFSET :offset',
            [':limit' => $limit, ':offset' => $offset]
        );

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