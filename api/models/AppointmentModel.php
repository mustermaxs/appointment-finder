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
        $query = "SELECT * FROM appointments WHERE appointmentId = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("d", $appointmentId);
        $stmt->execute();

        $result = $stmt->get_result();
        $appointment = (object) $result->fetch_assoc();
        $appointment->options = $this->getOptionsById($appointmentId);

        return $appointment;
    }

    public function getOptionsById($appointmentId)
    {
        $query = "SELECT * FROM options WHERE appointmentId = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("d", $appointmentId);
        $stmt->execute();

        $result = $stmt->get_result();
        $options = [];
        while ($row = $result->fetch_assoc()) {
            $options[] = $row;
        }
        return $options;
    }

    public function addAppointment($title, $appointmentDate, $expirationDate, $location, $description, $userId, $password)
    {
        $query =
            "INSERT INTO appointments
        (title, appointmentDate, expirationDate, location, description, creator, password)
        VALUES(?,?,?,?,?,?,?);";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssds", $title, $appointmentDate, $expirationDate, $location, $description, $userId, $password);
        $stmt->execute();
        $appointmentId = $this->conn->insert_id;

    return $appointmentId;
    }

    public function getAllAppointments()
    {
        $query = "SELECT * FROM appointments";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result();
        $appointments = [];

        while ($row = $result->fetch_assoc()) {
            $appointments[] = $row;
        }

        return $appointments;
    }
}