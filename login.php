<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "triveni_mess_db"; // Your database name

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get login details
$data = json_decode(file_get_contents("php://input"), true);
$user = $data['username'];
$pass = md5($data['password']); // Encrypt password for security

// Check if user exists
$stmt = $conn->prepare("SELECT * FROM users WHERE username=? AND password=?");
$stmt->bind_param("ss", $user, $pass);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $_SESSION['admin'] = $user; // Store admin session
    echo json_encode(["message" => "Login successful", "status" => "success"]);
} else {
    echo json_encode(["message" => "Invalid credentials", "status" => "error"]);
}

$conn->close();
?>
