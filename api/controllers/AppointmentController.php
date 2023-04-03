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
    // TODO
    public function post()
    {
        $data = $this->getPostData();
    }
}
