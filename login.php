<?php
require_once 'api/db.php';
session_start();

$message = "";

if($_SERVER["REQUEST_METHOD"] == "POST"){

$username = $_POST['username'];
$password = $_POST['password'];

if(empty($username) || empty($password)){
$message = "Username and password required";
}
else{

$sql = "SELECT * FROM users WHERE username='$username'";
$result = mysqli_query($conn,$sql);

if(mysqli_num_rows($result) == 1){

$user = mysqli_fetch_assoc($result);

if(password_verify($password,$user['password'])){

$_SESSION['user'] = $user['username'];

header("Location: index.html");
exit;

}
else{
$message = "Incorrect password";
}

}
else{
$message = "User not found";
}

}
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Login</title>

<!-- Tailwind -->
<script src="https://cdn.tailwindcss.com"></script>

</head>

<body class="flex items-center justify-center h-screen bg-gray-100">

<div class="bg-white p-8 rounded-xl shadow-lg w-96">

<h2 class="text-2xl font-bold text-center mb-6">Login</h2>

<?php if($message!=""){ ?>
<div class="bg-red-100 text-red-600 p-2 mb-4 rounded text-center">
<?php echo $message; ?>
</div>
<?php } ?>

<form method="POST" action="">

<div class="mb-4">
<label class="block text-sm font-medium">Username</label>
<input type="text" name="username"
class="w-full border p-2 rounded mt-1">
</div>

<div class="mb-4">
<label class="block text-sm font-medium">Password</label>
<input type="password" name="password"
class="w-full border p-2 rounded mt-1">
</div>

<button type="submit"
class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
Login
</button>

</form>

<p class="text-center mt-4 text-sm">
Don't have an account?
<a href="signup.php" class="text-blue-500">Signup</a>
</p>

</div>

</body>
</html>