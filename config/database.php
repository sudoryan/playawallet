<?php
    include "setup.php";

    function db_connect() {
        $DB_NAME = "playawallet";
        $DB_USER = "playa";
        $DB_PASSWORD = "pswd";
        $DB_DSN = "pgsql:port=5432;
                    dbname=$DB_NAME;
                    user=$DB_USER;
                    password=$DB_PASSWORD";
        try {
            $dbh = new PDO($DB_DSN);
            return ($dbh);
        }  
        catch (PDOException $e) {   
            if ($e->getCode() == 7) {
                db_init($DB_NAME, $DB_USER, $DB_PASSWORD);
                return (db_connect());
            }
            echo "Error!: " . $e->getMessage() . "<br/>";
            die();
            return (null);
        }
    }
?>