<?php

/**
 * request parameters stored in $request, get with Router::request()
 * add route with get/ put / post / delete
 * variable url parameters can be defined with ":id"
 * eg. /api/user/:id    where "user" is the controller and ":id"
 * a query parameter that will be passed to the controller
 */

class Router
{
    private $requestDetails = [];
    private $apiControllerDir = null;
    private $baseURL = null;
    private bool $routeexists = false;
    private array $routes = [
        "GET" => [],
        "POST" => [],
        "PUT" => [],
        "DELETE" => []
    ];

    function __construct(string $baseURL = "", string $apiControllerDir)
    {
        if ($baseURL == null || $apiControllerDir == null)
            throw new Error("Router instatiated incorrectly!");

        $this->apiControllerDir = $apiControllerDir;
        $this->baseURL = $baseURL;  // name of webapp (eg. appointment-finder)
    }

    public function get(string $url)
    {
        $regexPattern = $this->createRegexPattern($url);
        array_push($this->routes["GET"], $regexPattern);
    }

    public function post(string $url)
    {
        $regexPattern = $this->createRegexPattern($url);
        array_push($this->routes["POST"], $regexPattern);
    }
    public function put(string $url)
    {
        $regexPattern = $this->createRegexPattern($url);
        array_push($this->routes["PUT"], $regexPattern);
    }

    public function delete(string $url)
    {
        $regexPattern = $this->createRegexPattern($url);
        array_push($this->routes["DELETE"], $regexPattern);
    }


    public function createRegexPattern($path)
    {
        $regexPattern = preg_replace("/\//", "\\/", $path);
        $regexPattern = preg_replace('/\:([a-z0-9-]+)/', '(?\'\1\'[a-z-_0-9]+)', $regexPattern);
        // $regexPattern = preg_replace("/\/$/", , $regexPattern);
        $regexPattern = "/^" . $regexPattern . "\/?$/";

        return $regexPattern;
    }
    // checks if requested url matches pattern in $routes ( /controller/[:optionalParams] )
    // if it does, it extracts query params (NOT search query) and stores them
    // in $requestDetails array
    private function matchRoute(array $patterns, $url): bool
    {
        $route = preg_replace("/(\?[a-z=]+)/", "", $url);
        preg_match("/\/api\/([a-z]+)\//", $route, $controller);
        $this->addRequest("controller", $controller[1]);

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $route, $matches)) {
                $namedGroupMatches = array_filter($matches, "is_string", ARRAY_FILTER_USE_KEY);

                foreach ($namedGroupMatches as $key => $value) {
                    $this->addRequest($key, $value);
                }
                return true;
                break;
            }
        }
        return false;
    }

    private function addRequest(string $key, string $value)
    {
        $this->requestDetails[$key] = $value;
    }

    public function routeExists()
    {
        return $this->routeexists;
    }

    public function getRequestMethod()
    {
        return $this->requestDetails["method"];
    }

    public function request()
    {
        return $this->requestDetails;
    }

    public function successResponse($message, $data = null, $statusCode = 200)
    {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
            'statuscode' => $statusCode
        ]);
        exit();
    }

    public function errorResponse($message, $statusCode = 400)
    {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => $message,
            'statuscode' => $statusCode
        ]);
        exit();
    }

    private function initController()
    {
        $controllerName = $this->requestDetails["controller"];
        $controllerClassName = ucfirst($controllerName) . "Controller";
        $controllerPath = $this->apiControllerDir . $controllerClassName . ".php";
        $controllerAction = strtolower($this->getRequestMethod());

        if (!file_exists($controllerPath))
            $this->errorResponse("route doesn't exist", 400);

        require_once $controllerPath;
        $controller = new $controllerClassName($this->requestDetails);
        $controller->$controllerAction();
    }

    public function dispatch(string $url, string $requestMethod)
    {
        $url = str_replace($this->baseURL, "", $url);   // cut the localhost... part
        $method = strtoupper($requestMethod);

        // store query params in $requestDetails
        if ($requestMethod == "GET") {
            foreach ($_GET as $key => $value) {
                $this->addRequest($key, $value);
            }
        }
        $url = preg_replace('/\\?.*/', '', $url);       // remove optional search query params from url
        $this->addRequest("url", $url);
        $this->addRequest("method", $requestMethod);

        if (!$this->matchRoute($this->routes[$method], $url)) {
            $this->routeexists = false;
            $this->errorResponse("Requested route doesn't exist", 400);
        }
        $this->routeexists = true;

        $this->initController();
    }
}
