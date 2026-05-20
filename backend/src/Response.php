<?php
declare(strict_types=1);

namespace Src;

class Response
{
    public static function json($data, int $status = 200): void //Builds a json response with the data from the SQL statements
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public static function badRequest(string $message = 'Bad Request'): void
    {
        self::json(['error' => $message], 400);
    }
}