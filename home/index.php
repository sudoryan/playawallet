<?php
	session_start();
	if ($_SESSION["loggued_on_user"] == False) {
		header("Location: /");
	}
?>
<html>
<head>
	<link href='/css/style.css' rel='stylesheet' type='text/css'>
	<title>Playa Wallet</title>
</head>
<body>
	<div class="header">
		<a href="/config/logout.php">Logout</a>
	</div>
</body>
</html>