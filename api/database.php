<?php

require_once getcwd() . "/api/dbConfig.php";


class Database
{
    // Hold the class instance.
    private static $instance = null;
    public static $connection;


    // The db connection is established in the private constructor.
    public function __construct()
    {
        if (!self::$connection) {
            $config = new Config();
            self::$connection = new mysqli($config->host, $config->user, $config->password, $config->database);
        }
    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new Database();
        }

        return self::$instance;
    }

    public function getConnection()
    {
        return self::$connection;
    }
}
