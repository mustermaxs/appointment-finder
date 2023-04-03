<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

</head>

<body>
    <h1> Appointments </h1>

    <?php
        require "dbaccess.php"; 

        $db_obj = new mysqli($host, $user, $DBpassword, $database);

        if ($db_obj->connect_error) {
            echo "Connection Error: " . $db_obj->connect_error;
            exit();
        }

        $sql = "SELECT * FROM appointments Order by appointmentid desc";

        $result = $db_obj->query($sql);
        $post = $resul->fetch_all(MYSQLI_ASSOC);
        
    ?>


    <?php            
        for($i = 0; $i < count($appointmentid); $i++)
            {
    ?>
            <div class="card-group">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title" id="appointmentName"><?php echo $appointment[$i][title] ?> </h5>
                        <p class="card-text" id="votes"> <small class="text-muted">4 Votes</small></p>
                    </div>
                </div>
            </div>

            <?php 
                }
            ?>





    <div class="container"></div>
    <button type="button" class="btn btn-primary btn-circle btn-xl">create new</button>
    </div>
</body>

</html>