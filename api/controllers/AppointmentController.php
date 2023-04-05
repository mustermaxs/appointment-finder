<?php
require_once getcwd() . "/api/BaseController.php";
require_once getcwd() . "/api/models/AppointmentModel.php";

class AppointmentController extends BaseController
{
    protected function init()
    {
        $this->model = new AppointmentModel();
    }

    public function get()
    {
        if (array_key_exists("id", $this->request)) {
            $appointmentId = $this->request["id"];
            $appointment = $this->model->getAppointmentById($appointmentId);

            if ($appointment == NULL) {
                $this->errorResponse("No Appointment found!", $appointment);
                return;
            }
            $this->successResponse("", $appointment);
        } else {
            $appointments = $this->model->getAllAppointments();
            $this->successResponse("", $appointments);
        }
    }

    private function getOptionsById($appointmentId)
    {

        $options = $this->model->getOptionsById($appointmentId);
        return $options;
    }

    public function addVote($data)
    {
        $this->model->addVoteByOptionId($data->optionId, $data->userId);
        $this->successResponse("added voting");
    }

    public function post()
    {

        $jsonPostData = $this->getPostData();

        if (array_key_exists("addvote", $jsonPostData)) {
            $this->addVote($jsonPostData);

            return;
        }

        $title = $jsonPostData->title;
        $appointmentDate = $jsonPostData->appointmentDate;
        $expirationDate = $jsonPostData->expirationDate;
        $location = $jsonPostData->location;
        $description = $jsonPostData->description;
        $userId = $jsonPostData->userId;
        $password = $jsonPostData->password;

        $appointment = $this->model->addAppointment($title, $appointmentDate, $expirationDate, $location, $description, $userId, $password);
        $this->successResponse("", $appointment);
    }
}
