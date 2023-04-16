<?php
require_once getcwd() . "/api/BaseController.php";
require_once getcwd() . "/api/models/CommentModel.php";

class CommentsController extends BaseController
{
    protected function init()
    {
        $this->model = new CommentModel();
    }
    // get all comments for appointment with id
    public function get()
    {
        // $data = $this->getPostData();
        $appointmentId = intval($this->request["id"]);
        $comments = $this->model->getCommentsByAppointmentId($appointmentId);
        if ($comments == null)
            return $this->errorResponse("comment doesn't exist", 400);

        $this->successResponse("", $comments);
    }

    // add new comment to appointment with id
    public function post()
    {
        $data = $this->getPostData();
        $content = $data->content;
        $userId = intval($data->userId);
        $appointmentId = intval($data->appointmentId);
        $commentId = $this->model->addCommentByAppointmentId($content, $userId, $appointmentId);
        if ($commentId >= 1) {
            $this->successResponse("added comment", null, 200);
        } else {
            $this->errorResponse("adding comment failed", 400);
        }
    }
}
