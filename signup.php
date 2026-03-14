<?php
require_once 'api/db.php';

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = $_POST['username'];
    $password = $_POST['password'];

    if(empty($username) || empty($password)){
        $message = "Username and Password are required";
    } 
    else {

        // check if user already exists
        $sql = "SELECT * FROM users WHERE username='$username'";
        $result = mysqli_query($conn, $sql);

        if(mysqli_num_rows($result) > 0){
            $message = "Username already exists";
        } 
        else {

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users (username, password, role) 
                    VALUES ('$username', '$hashedPassword', 'user')";

            if(mysqli_query($conn, $sql)){
                $message = "Signup successful";
            } 
            else {
                $message = "Signup failed";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Signup</title>

<style>

body{
    font-family: Arial;
    background: linear-gradient(135deg,#667eea,#764ba2);
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
}

.form-box{
    background:white;
    padding:40px;
    border-radius:10px;
    box-shadow:0 10px 25px rgba(0,0,0,0.2);
    width:320px;
    text-align:center;
}

h2{
    margin-bottom:20px;
}

input{
    width:100%;
    padding:10px;
    margin:10px 0;
    border-radius:5px;
    border:1px solid #ccc;
}

button{
    width:100%;
    padding:10px;
    background:#667eea;
    border:none;
    color:white;
    font-size:16px;
    border-radius:5px;
    cursor:pointer;
}

button:hover{
    background:#5a67d8;
}

.message{
    margin-top:10px;
    color:red;
}

a{
    text-decoration:none;
    color:#667eea;
}

</style>

</head>

<body>

<div class="form-box">

<h2>Create Account</h2>

<form method="POST" action="">

<input type="text" name="username" placeholder="Enter Username" required>

<input type="password" name="password" placeholder="Enter Password" required>

<button type="submit">Signup</button>

</form>

<div class="message">
<?php echo $message; ?>
</div>

<p style="margin-top:15px;">
Already have an account? <a href="login.php">Login</a>
</p>

</div>

</body>
</html>