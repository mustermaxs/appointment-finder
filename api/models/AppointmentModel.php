<?php
require_once getcwd() . "/api/Model.php";

class AppointmentModel extends Model
{

    public function checkPassword(string $pwdInput, $appointmentId)
    {
        $query =
            "SELECT password FROM appointments WHERE appointmentId = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("d", $appointmentId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $hashedpassword = $row['password'];

        return password_verify($pwdInput, $hashedpassword);
    }
    // TODO
    public function getAppointmentById($appointmentId)
    {
    }

    // TODO
    public function getOptionsById($appointmentId)
    {
    }

    public function addAppointment($title, $appointmentDate, $expirationDate, $location, $description, $userId)
    {
        $query =
            "INSERT INTO appointments
        (title, appointmentDate, expirationDate, location, description, creator)
        VALUES(?,?,?,?,?,?);";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssd", $title, $appointmentDate, $expirationDate, $location, $description, $userId);
        $stmt->execute();
        $appointmentId = $this->conn->insert_id;

        return $appointmentId;
    }

    // TODO
    public function getAllAppointments()
    {
    }
}
