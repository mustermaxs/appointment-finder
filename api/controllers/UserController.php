<?php

require_once getcwd() . "/api/BaseController.php";
require_once getcwd() . "/api/models/UserModel.php";

class UserController extends BaseController
{
    protected function init()
    {
        $this->model = new UserModel();
    }

    public function getUserIdByUserName(string $userName)
    {
        $userId = 0;

        $userId = $this->model->getUserIdByUserName($userName);
        if ($userName == null) {
            $userId = $this->model->addUser($userName, "");
        }

        $this->successResponse("request successfull", $userId);
    }

    public function get()
    {
        if (array_key_exists("username", $this->request)) {
            $this->getUserIdByUserName($this->request["username"]);

            return;
        }
        $userId = $this->request["id"];
        $user = $this->model->getUserById($userId);

        $this->successResponse("SUCCESS!", $user);
    }

    public function post()
    {
        $jsonPostData = $this->getPostData();
        $username = $jsonPostData->userName;
        $email = $jsonPostData->email;
        $this->model->addUser($username, $email);
    }
}
