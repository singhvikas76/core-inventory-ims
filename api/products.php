<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "core_inventory";

$conn = mysqli_connect($host,$user,$password,$database);

if(!$conn){
    die("Database Connection Failed");
}

$query = "SELECT id,name,sku,category,uom,price,min_stock,created_at FROM products";
$result = mysqli_query($conn,$query);
?>

<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Products | CoreInventory</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/@phosphor-icons/web"></script>

</head>

<body class="bg-gray-50 font-sans">

<div class="p-8">

<div class="flex justify-between items-center mb-6">

<h1 class="text-2xl font-bold text-gray-800">
Products
</h1>

<button class="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
<i class="ph ph-plus mr-2"></i>
Add Product
</button>

</div>


<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

<div class="overflow-x-auto">

<table class="w-full text-left">

<thead>

<tr class="border-b text-gray-500 text-sm">

<th class="py-3 px-4">ID</th>
<th class="py-3 px-4">Name</th>
<th class="py-3 px-4">SKU</th>
<th class="py-3 px-4">Category</th>
<th class="py-3 px-4">UOM</th>
<th class="py-3 px-4">Price</th>
<th class="py-3 px-4">Min Stock</th>
<th class="py-3 px-4">Created At</th>
<th class="py-3 px-4">Status</th>

</tr>

</thead>

<tbody>

<?php

if(mysqli_num_rows($result) > 0){

while($row = mysqli_fetch_assoc($result)){

$status = "In Stock";
$statusColor = "green";

if($row['min_stock'] <= 10){
$status = "Low Stock";
$statusColor = "red";
}

?>

<tr class="border-b hover:bg-gray-50">

<td class="py-3 px-4">
<?php echo $row['id']; ?>
</td>

<td class="py-3 px-4 font-medium">
<?php echo $row['name']; ?>
</td>

<td class="py-3 px-4">
<?php echo $row['sku']; ?>
</td>

<td class="py-3 px-4">
<?php echo $row['category']; ?>
</td>

<td class="py-3 px-4">
<?php echo $row['uom']; ?>
</td>

<td class="py-3 px-4">
₹<?php echo $row['price']; ?>
</td>

<td class="py-3 px-4">
<?php echo $row['min_stock']; ?>
</td>

<td class="py-3 px-4">
<?php echo $row['created_at']; ?>
</td>

<td class="py-3 px-4">

<?php if($status == "Low Stock"){ ?>

<span class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
Low Stock
</span>

<?php } else { ?>

<span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
In Stock
</span>

<?php } ?>

</td>

</tr>

<?php
}
}
else{

echo "<tr>
<td colspan='9' class='text-center py-5 text-gray-500'>
No Products Found
</td>
</tr>";

}
?>

</tbody>

</table>

</div>

</div>

</div>

</body>
</html>

