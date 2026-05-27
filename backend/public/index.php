<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/Response.php';
require_once __DIR__ . '/../src/DataController.php';

use Src\Database;
use Src\Response;
use Src\DataController;

//Inserts Databse and Required Classes

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

//Sets Header

$dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME);
$db = new Database($dsn, DB_USER, DB_PASS);
$controller = new DataController($db);
//Creates an Database Object to connect to the Database

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/'); 
$relative = '/' . ltrim(substr($path, strlen($base)), '/');
$segments = array_values(array_filter(explode('/', $relative)));
//Parse the request Url and extract the path segments and stores it in the $segments array

$method = $_SERVER['REQUEST_METHOD'];
//Stores the Request Method in a variable

try {
    
    if (count($segments) === 0 || $segments[0] === '') {
        $controller->index();
        exit;
    }

    if ($segments[0] === 'videos' && $method === 'GET') {
        $controller->paginate();
        exit;
    }
    /*
    / This is the Routing logic. It checks wich how many Segements are in the request and dependent
    / what Endpoint the client is Requesting is executes the corresponding Method from the DataController.
    */

    Response::json(['error' => 'Not Found'], 404);
} catch (Throwable $e) {
    Response::json(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}