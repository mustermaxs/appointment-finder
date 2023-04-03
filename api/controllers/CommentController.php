<?php
require_once getcwd() . "/api/BaseController.php";
require_once getcwd() . "/api/models/CommentModel.php";

class CommentController extends BaseController
{
    protected function init()
    {
        $this->model = new CommentModel();
    }

    public function get()
    {
    }

    // TODO
    public function post()
    {
        $data = $this->getPostData();
    }
}
