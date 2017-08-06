<?php
	include "config/login.php";
	include "config/filter_key.php";

	session_start();
	$_SESSION["loggued_on_user"] = NULL;
	if (isset($_POST["submit"])) {
		$key = $_POST["key"];
		if (!($key = filter_key($key))) {
			echo "invalid address";
		}
		else {
			$ret = login($key);
			if ($ret == 1) {
				$_SESSION["loggued_on_user"] = $key;
				header("Location: setTrustees");
			}
			else if ($ret == 2) {
				echo "Logged in<br/>";
				$_SESSION["loggued_on_user"] = $key;
				header("Location: setTrustees");
			}
			else {
				echo ($ret . "<br/>");
			}
		}
	}
?>

<html>
<head>
	<link href='/css/style.css' rel='stylesheet' type='text/css'>
	<title>Playa Wallet</title>
</head>
<body>
	<div class="title">
		<h1>Playa Wallet</h1>
		<h2>Your Multi-Signature Wallet</h2>
	</div>
	<form method="POST">
		<input class="key" type="text" name="key" placeholder="Enter your private key" required>
		<br/>
		<input class="enter" name="submit" type="submit" value="Create/Enter Wallet">
	</form>
	<div class="footer">
		<a href="recovery" class="link">Account Recovery</a>
	</div>
</body>
</html>