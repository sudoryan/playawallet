<?php
	function filter_key($key) {
		$pos = strpos($key, "0x");
		if ($pos != 0 || $pos === FALSE) {
			$key = "0x" . $key;
		}
		if (strlen($key) != 66) {
			return (NULL);
		}
		return ($key);
	}
?>