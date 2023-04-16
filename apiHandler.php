<?php
require_once "./api/router.php";

$controllerPathPrefix = "./api/controllers/";
$router = new Router("/appointment-finder", $controllerPathPrefix);

// ROUTES

$router->post("/api/appointments/");
$router->get("/api/appointments/:id[i]");
$router->get("/api/appointments/");
$router->post("/api/users/");
$router->get("/api/users/:id/[i]");
$router->get("/api/users/");
$router->post("/api/comments/");
$router->get("/api/comments/:id[i]/");
$router->post("/api/votes/");
$router->get("/api/votes/:id[i]/");


$url = $_SERVER["REQUEST_URI"];
$method = $_SERVER["REQUEST_METHOD"];

$router->dispatch($url, $method);
