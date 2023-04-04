<?php
require_once "./api/router.php";

$controllerPathPrefix = "./api/controllers/";
$router = new Router("/appointment-finder");

// ROUTES

$router->post("/api/appointment/");
$router->get("/api/appointment/:id");
$router->get("/api/appointment/");
$router->post("/api/user/");
$router->get("/api/user/:id/");
$router->post("/api/comment/");
$router->get("/api/comment/:id/");


$url = $_SERVER["REQUEST_URI"];
$method = $_SERVER["REQUEST_METHOD"];

$router->dispatch($url, $method);

// TODO respond with error message
if (!$router->routeExists())
    $router->errorResponse("route doesn't exist", 400);

$request = $router->request();

$controllerName = $request["controller"];
$controllerClassName = ucfirst($controllerName) . "Controller";
$controllerPath = $controllerPathPrefix . $controllerClassName . ".php";
$controllerAction = strtolower($method);

// TODO respond with error msg
if (file_exists($controllerPath)) {
    require_once $controllerPath;
    $controller = new $controllerClassName($request);
    $controller->$controllerAction();
} else {
    $router->errorResponse("route doesn't exist", 400);
}
