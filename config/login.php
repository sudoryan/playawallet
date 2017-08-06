<?php
	include "database.php";

	function login($key) {
		$dbh = db_connect();
		$stmt = $dbh->prepare("SELECT * FROM accounts WHERE key=:key");
		$stmt->execute(array("key" => hash("sha256", $key))) 
			or die(print_r($stmt->errorInfo(), true));
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$row['key']) {
			$stmt = $dbh->prepare("INSERT INTO accounts (key) VALUES (:key)");
			$stmt->execute(array("key" => hash("sha256", $key)));
			// create wallet
			return (1);
		}
		else {
			// login
			return (2);
		}
	}
?>