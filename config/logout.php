<?php
	session_start();
	$_SESSION["loggued_on_user"] = False;
	header("Location: /");
?>