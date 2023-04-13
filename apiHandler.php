<?php
require_once "./api/router.php";

$controllerPathPrefix = "./api/controllers/";
$router = new Router("/appointment-finder", $controllerPathPrefix);

// ROUTES

$router->post("/api/appointment/");
$router->get("/api/appointment/:id");
$router->get("/api/appointment/");
$router->post("/api/user/");
$router->get("/api/user/:id/");
$router->get("/api/user/");
$router->post("/api/comment/");
$router->get("/api/comment/:id/");
$router->post("/api/vote/");
$router->get("/api/vote/:id/");


$url = $_SERVER["REQUEST_URI"];
$method = $_SERVER["REQUEST_METHOD"];

$router->dispatch($url, $method);
