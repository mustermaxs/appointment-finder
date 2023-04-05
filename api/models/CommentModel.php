<?php
require_once getcwd() . "/api/Model.php";

class CommentModel extends Model
{
    // TODO
    public function getCommentsByAppointmentId($appointmentId)
    {
        $query =
            "SELECT c.content, c.createdOn, c.userId, u.userName, c.appointment, a.appointmentDate AS appointmentId FROM comments c
        JOIN users u ON u.userId = c.userId
        JOIN appointments a on a.appointmentId = c.appointment
        WHERE c.appointment = ?;";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("d", $appointmentId);
        $stmt->execute();
        $result = $stmt->get_result();
        $comments = $result->fetch_all(MYSQLI_ASSOC);

        return $comments;
    }

    public function addCommentByAppointmentId(string $content, int $userId, int $appointmentId)
    {
        $query =
            "INSERT INTO comments
        (content, userId, appointment)
        VALUES(?, ?, ?);";

        $contentSanitized = filter_var($content, FILTER_SANITIZE_STRING);

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sdd", $contentSanitized, $userId, $appointmentId);
        $stmt->execute();
        $commentId = $this->conn->insert_id;

        return $commentId;
    }
}
