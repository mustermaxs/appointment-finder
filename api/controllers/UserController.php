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

    protected function getUserNameByUserId($userId)
    {
        $userId = $this->request["id"];
        $user = $this->model->getUserById($userId);

        $this->successResponse("SUCCESS!", $user);
    }

    public function get()
    {
        switch ($this->request["action"]) {
            case "getid":
                $this->getUserIdByUserName($this->request["username"]);
                break;
            case "getname":
                $this->getUserNameByUserId($this->request["id"]);
                break;
            default:
                $this->errorResponse("request malformed");
                break;
        }
    }

    public function post()
    {
        $jsonPostData = $this->getPostData();
        $username = $jsonPostData->userName;
        $email = $jsonPostData->email;
        $this->model->addUser($username, $email);
    }
}
