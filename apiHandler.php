<?php
ini_set('error_reporting', E_ALL);


require_once "./api/router.php";
// require_once "./api/models/UserModel.php";
// require_once "./api/controllers/UserController.php";
// require_once "./api/controllers/CommentController.php";

$controllerPathPrefix = "./api/controllers/";
$router = new Router("/appointment-finder");

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

if (!$router->routeExists())
    return;

$request = $router->request();

$controllerName = $request["controller"];
$controllerClassName = ucfirst($controllerName) . "Controller";
$controllerPath = $controllerPathPrefix . $controllerClassName . ".php";
$controllerAction = strtolower($method);

if (file_exists($controllerPath)) {
    require_once $controllerPath;
    $controller = new $controllerClassName($request);
    $controller->$controllerAction();
}
