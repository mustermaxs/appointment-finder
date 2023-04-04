<?php

require_once getcwd() . "/api/BaseController.php";
require_once getcwd() . "/api/models/UserModel.php";

class UserController extends BaseController
{
    protected function init()
    {
        $this->model = new UserModel();
    }

    public function get()
    {
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
