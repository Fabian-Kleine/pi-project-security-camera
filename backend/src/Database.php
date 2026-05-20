<?php
declare(strict_types=1);

namespace Src;

use PDO;
use PDOException;
//PDO is used to create an connection to the Database

class Database
{
    private PDO $pdo;

    public function __construct(string $dsn, string $user, string $pass)
    {
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        //Settings for the PDO so that the Responses got better Error Handling and better formatting
        $this->pdo = new PDO($dsn, $user, $pass, $options);
    }

    public function getPdo(): PDO
    {
        return $this->pdo; 
    }
    //Some Functions to manage Database Requests with PDO
    public function fetchAll(string $sql, array $params = []): array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function fetch(string $sql, array $params = []): ?array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function execute(string $sql, array $params = []): int
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->rowCount();
    }

    public function lastInsertId(): string
    {
        return $this->pdo->lastInsertId();
    }
}