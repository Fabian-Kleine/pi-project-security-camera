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
    
    if (count($segments) === 0 || $segments[0] === '') { //Checks if the rquest is only the base Url and executed the index method
        $controller->index();
        exit;
    }
    /*
    / This is the Routing logic. It checks wich how many Segements are in the request and dependent
    / what Endpoint the client is Requesting is executes the corresponding Method from the DataController.
    */
    if ($segments[0] === 'voc') { 
        if ($method === 'GET' && count($segments) === 1) { 
            $controller->getVocData();
            exit;
        }

        if ($method === 'GET' && count($segments) === 2 && $segments[1] === 'period') {
            $startDate = $_GET['start'] ?? null; //Gets parameters from the GET Request and stores it in the variables
            $endDate = $_GET['end'] ?? null;
        
            if (!$startDate || !$endDate) { //If there is no start or end date it is throwing an Error
                Response::json(['error' => 'Missing start or end date parameter'], 400);
                exit;
            }
            
            $controller->getVocDataPeriod($startDate, $endDate);
            exit;
        }
    }

    if ($segments[0] === 'radar') {
        if ($method === 'GET' && count($segments) === 1) {
            $controller->getRadarData();
            exit;
        }

        if ($method === 'GET' && count($segments) === 2 && $segments[1] === 'period') {
            $startDate = $_GET['start'] ?? null;
            $endDate = $_GET['end'] ?? null;
        
            if (!$startDate || !$endDate) {
                Response::json(['error' => 'Missing start or end date parameter'], 400);
                exit;
            }
            
            $controller->getRadarDataPeriod($startDate, $endDate);
            exit;
        }
    }

    if ($segments[0] === 'period') {
        if ($method === 'GET' && count($segments) === 1) {
            $startDate = $_GET['start'] ?? null;
            $endDate = $_GET['end'] ?? null;
        
            if (!$startDate || !$endDate) {
                Response::json(['error' => 'Missing start or end date parameter'], 400);
                exit;
            }
            
            $controller->getDataPeriod($startDate, $endDate);
            exit;
        }
    }

    if($segments[0] === 'regression' ) {
        if($method === 'GET' && count($segments) === 1) {
            $controller->getRegressionData();
            exit;
        }
    }

    Response::json(['error' => 'Not Found'], 404);
} catch (Throwable $e) {
    Response::json(['error' => 'Server error', 'details' => $e->getMessage()], 500);
}