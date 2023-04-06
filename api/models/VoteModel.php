<?php
require_once getcwd() . "/api/Model.php";

class VoteModel extends Model
{
    // TODO
    public function getVotesByAppointmentId($appointmentId)
    {
        $query =
            "SELECT v.voteId, v.userId, u.userName, v.appointmentId, v.optionId FROM votes v
        JOIN users u ON u.userId = v.userId
        JOIN appointments a on a.appointmentId = v.appointmentId
        WHERE v.appointmentId = ?;";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("d", $appointmentId);
        $stmt->execute();
        $result = $stmt->get_result();
        $votes = $result->fetch_all(MYSQLI_ASSOC);

        return $votes;
    }

    protected function userHasAlreadyVoted($userId, $optionId)
    {
        $alreadyVoted = false;

        $query =
            "SELECT voteId FROM votes
        WHERE optionId = ? AND userId = ?;";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("dd", $optionId, $userId);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        $voteId = $row['voteId'];

        $alreadyVoted = $voteId > 0 ? true : false;

        return $alreadyVoted;
    }

    public function addVoteByAppointmentId(int $optionId, int $userId, int $appointmentId)
    {
        if ($this->userHasAlreadyVoted($userId, $optionId))
            return null;

        $query =
            "INSERT INTO votes
        (optionId, userId, appointmentId)
        VALUES(?, ?, ?);";


        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ddd", $optionId, $userId, $appointmentId);
        $stmt->execute();
        $voteId = $this->conn->insert_id;

        return $voteId;
    }
}
