<?php
	function create_table($DB_NAME, $DB_USER, $DB_PASSWORD) {
		try {
			$DB_DSN = "pgsql:port=5432;
				dbname=$DB_NAME;
				user=$DB_USER;
				password=$DB_PASSWORD;";
			$dbh = new PDO($DB_DSN);
			$dbh->exec("CREATE TABLE accounts (key varchar(64) NOT NULL, 
				contract varchar(42) DEFAULT NULL, setTrustees integer DEFAULT 0)");
		} catch (PDOException $e) {
			die("create_table ERROR: " . $e->getMessage());
		}
	}

	function create_user($DB_NAME, $DB_USER, $DB_PASSWORD, $user, $pswd) {
		$dbh = new PDO("pgsql:host=localhost;user=$user;password=$pswd");
		$dbh->exec("CREATE USER $DB_USER PASSWORD '$DB_PASSWORD';
				GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;");
	}

	function db_init($DB_NAME, $DB_USER, $DB_PASSWORD) {
		$user = "rle";
		$pswd = "pswd";
		try {
			$dbh = new PDO("pgsql:host=localhost;user=$user;password=$pswd");
			$dbh->exec("CREATE DATABASE $DB_NAME;");
			create_user($DB_NAME, $DB_USER, $DB_PASSWORD, $user, $pswd);
			create_table($DB_NAME, $DB_USER, $DB_PASSWORD);
		} catch (PDOException $e) {
			die("DB ERROR: ". $e->getMessage());
		}
	}
?>