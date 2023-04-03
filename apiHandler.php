<?php
require_once "./api/router.php";
// require_once "./api/models/UserModel.php";
require_once "./api/controllers/UserController.php";

$router = new Router("/appointment-finder");

$router->post("/api/user/");
$router->get("/api/user/:id/");


$url = $_SERVER["REQUEST_URI"];
$method = $_SERVER["REQUEST_METHOD"];

$router->dispatch($url, $method);

if (!$router->routeExists())
    return;

$request = $router->request();

$controller = new UserController($request);
$controller->get();

// var_dump($router->request());
