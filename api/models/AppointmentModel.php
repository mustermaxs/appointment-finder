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
    // ! select everything but password
    public function getAppointmentById($appointmentId)
    {
        $query = "SELECT * FROM appointments WHERE appointmentId = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("d", $appointmentId);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows <= 0)
            return null;

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

    public function addVoteByOptionId($optionId, $userId)
    {
    }

    public function addOptionsByAppointmentId($appointmentId, $options)
    {
        $query = "INSERT INTO options (appointmentId, startDate, endDate) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);

        foreach ($options as $option) {
            $startDate = $option->startDate;
            $endDate = $option->endDate;

            $stmt->bind_param("dss", $appointmentId, $startDate, $endDate);
            $stmt->execute();
        }
    }


    public function addAppointment($title, $expirationDate, $location, $description, $userId, $options)
    {
        $query =
            "INSERT INTO appointments
        (title, expirationDate, location, description, creator)
        VALUES(?,?,?,?,?);";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssssd", $title, $expirationDate, $location, $description, $userId);
        $stmt->execute();
        $appointmentId = $this->conn->insert_id;

        $this->addOptionsByAppointmentId($appointmentId, $options);

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
