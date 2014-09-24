<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>提交成功</title>
</head>
<body>
<?php
$uploadDir = 'temp/'; //file upload path
$name = $_FILES['upload']['name'] . '';
$sExtension = substr($name, (strrpos($name, '.') + 1));	//找到扩展名
$uploadFile = $uploadDir . date("YmdHis").rand(100, 200) . "." . $sExtension; 
move_uploaded_file($_FILES['upload']['tmp_name'], $uploadFile);
echo( '{"status":true,"url":"'.$uploadFile.'"}' )
?>
</body>
</html>