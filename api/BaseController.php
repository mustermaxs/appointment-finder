<?php

abstract class BaseController
{

    protected array $request = array();
    protected $model = NULL;

    public function __construct(array $request)
    {
        $this->request = $request;
        $this->init();
    }

    protected function init()
    {
    }

    protected function successResponse($message, $data = null, $statusCode = 200)
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

    protected function errorResponse($message, $statusCode = 400)
    {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => $message,
            'statuscode' => $statusCode
        ]);
        exit();
    }

    protected function getPostData()
    {
        $postData = file_get_contents('php://input');
        $jsonPostData = json_decode($postData);

        return $jsonPostData;
    }
}
