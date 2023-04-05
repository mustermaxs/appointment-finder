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

        $title = $jsonPostData->title;
        $expirationDate = $jsonPostData->expirationDate;
        $location = $jsonPostData->location;
        $description = $jsonPostData->description;
        $userId = $jsonPostData->userId;
        $password = $jsonPostData->password;
        $options = $jsonPostData->options;

        $appointmentId = $this->model->addAppointment($title, $expirationDate, $location, $description, $userId, $options, $password);
        $this->successResponse("", $appointmentId);
    }
}
