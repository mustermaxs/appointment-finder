<?php
require_once getcwd() . "/api/BaseController.php";
require_once getcwd() . "/api/models/VoteModel.php";

class VotesController extends BaseController
{
    protected function init()
    {
        $this->model = new VoteModel();
    }
    // get all votes for appointment with id
    public function get()
    {
        $appointmentId = intval($this->request["id"]);
        $votes = $this->model->getVotesByAppointmentId($appointmentId);

        if ($votes == null)
            return $this->errorResponse("not found", 400);

        $this->successResponse("", $votes);
    }

    // add new vote to appointment with id
    public function post()
    {
        $data = $this->getPostData();
        var_dump($data);

        $optionId = $data->optionId;
        $userId = $data->userId;
        $appointmentId = $data->appointmentId;

        $voteId = $this->model->addVoteByAppointmentId($optionId, $userId, $appointmentId);
        if ($voteId >= 1) {
            $this->successResponse("added vote", null, 200);
        } else {
            $this->errorResponse("adding vote failed", 400);
        }
    }
}
