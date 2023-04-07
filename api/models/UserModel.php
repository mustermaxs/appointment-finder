<?php

require_once getcwd() . "/api/Model.php";

class UserModel extends Model
{
    public function getUserById(int $userId)
    {
        $query =
            "SELECT userName, email
            FROM users
            WHERE userId = ?;";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("d", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_array(MYSQLI_ASSOC);

        return $user["userId"];
    }

    public function getUserIdByUserName(string $userName)
    {
        $query =
            "SELECT userId
        FROM users
        WHERE userName = ?;";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $userName);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_array(MYSQLI_ASSOC);

        return $user["userId"];
    }

    public function addUser(string $userName, string $email)
    {
        $query =
            "INSERT INTO users (userName, email)
        VALUES(?, ?);";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $userName, $email);
        $stmt->execute();
        $userId = $this->conn->insert_id;


        return $userId;
    }
}
