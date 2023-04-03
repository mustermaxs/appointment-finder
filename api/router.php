<?php

/**
 * request parameters stored in $request, get with Router::request()
 * add route with get/ put / post / delete
 * 
 * 
 */

class Router
{
    private $requestDetails = [];
    private $baseURL = "";
    private bool $routeexists = false;
    private array $routes = [
        "GET" => [],
        "POST" => [],
        "PUT" => [],
        "DELETE" => []
    ];

    function __construct(string $baseURL = "")
    {
        $this->baseURL = $baseURL;
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
        $regexPattern = "/^" . $regexPattern . "\/?$/";

        return $regexPattern;
    }

    private function matchRoute(array $patterns, $url): bool
    {
        $route = preg_replace("/(\?[a-z=]+)/", "", $url);
        preg_match("/\/api\/([a-z]+)\//", $route, $controller);
        $this->addRequest("controller", $controller[1]);
        // preg_matc>_all("/([a-z-]+)/", $route, $controllerAndView);
        // // var_dump($controllerAndView);
        // $this->setRequest("controller", @$controllerAndView[0][0]);

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $route, $matches)) {
                $namedGroupMatches = array_filter($matches, "is_string", ARRAY_FILTER_USE_KEY);

                foreach ($namedGroupMatches as $key => $value) {
                    // echo "\n". $matches["view"];
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

    public function request()
    {
        return $this->requestDetails;
    }

    public function dispatch(string $url, string $requestMethod)
    {
        $url = str_replace($this->baseURL, "", $url);
        $method = strtoupper($requestMethod);

        if (!$this->matchRoute($this->routes[$method], $url)) {
            $this->routeexists = false;
            return;
        }
        $this->routeexists = true;
        $this->addRequest("url", $url);
        $this->addRequest("method", $requestMethod);
    }
}
