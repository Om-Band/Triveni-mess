<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "triveni_mess_db"; // Your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header("Content-Type: application/json");

// Fetch menu from database
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM mess_menu");
    $menu = [];

    while ($row = $result->fetch_assoc()) {
        $menu[] = $row;
    }

    echo json_encode($menu);
}

// Update menu in database
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['day'], $data['breakfast'], $data['lunch'], $data['dinner'])) {
        $stmt = $conn->prepare("UPDATE mess_menu SET breakfast=?, lunch=?, dinner=? WHERE day=?");
        $stmt->bind_param("ssss", $data['breakfast'], $data['lunch'], $data['dinner'], $data['day']);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Menu updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update menu"]);
        }
    } else {
        echo json_encode(["error" => "Invalid request data"]);
    }
}

$conn->close();
?>
