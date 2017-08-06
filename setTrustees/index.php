<?php
	include "vendor/phpmailer/phpmailer/PHPMailerAutoload.php";
	include "../config/database.php";

	session_start();
	if (!$_SESSION["loggued_on_user"]) {
		header("Location: /");
	}
	$dbh = db_connect();
	$stmt = $dbh->prepare("SELECT * FROM accounts WHERE key=:key");
	$stmt->execute(array("key" => hash("sha256", $_SESSION["loggued_on_user"])));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	if ($row["settrustees"] == 1) {
		header("Location: /home");
	}
	if (isset($_POST["submit"])) {
		$mail = new PHPMailer;
		$mail->IsSMTP();
		$mail->SMTPAuth   = true;
		$mail->SMTPSecure = "ssl";
		$mail->Host       = "smtp.gmail.com";
		$mail->Port       = 465;                   
		$mail->Username   = "playawallet@gmail.com"; 
		$mail->Password   = "password!"; 
		$mail->setFrom('playawallet@gmail.com');
		$mail->addAddress($_POST["email1"], $_POST["email2"]);
		$mail->Subject = 'You have been approved as a trustee!';
		$mail->Body  = 'Some Person has made a you a trustee to their wallet. The wallet address is: address. Just sign the wallet to release the person\'s funds when the time comes';
		if(!$mail->send()) {
		  echo $mail->ErrorInfo . "<br/>";
		} else {
		  echo 'Message has been sent.';
		$stmt = $dbh->prepare("UPDATE accounts SET settrustees=1 WHERE key=:key");
		$stmt->execute(array("key" => hash("sha256", $_SESSION["loggued_on_user"])));
		header("Location: ../home");
		}
	}
?>

<html>
<head>
	<link href='/css/style.css' rel='stylesheet' type='text/css'>
	<title>Set Trustees</title>
</head>
<body>
	<a href="/">Home</a>
	<div class="trusteeForm">
	<form method="POST">
		<p class="trustTitle">Trustee 1</p><br/>
		<input class="trustee" type="text" name="email1" placeholder="Email"><br/>
		<input class="trustee" type="text" name="address1" placeholder="Ethereum address"><br/>
		<br/>
		<p class="trustTitle">Trustee 2</p><br/>
		<input class="trustee" type="text" name="email2" placeholder="Email"><br/>
		<input class="trustee" type="text" name="address2" placeholder="Ethereum address"><br/>
		<input type="submit" name="submit" value="Submit">
	</form>
	</div>
</body>
</html>