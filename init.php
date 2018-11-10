<?php
if (!isset($login)) {
	$login = new Login();
}
if (!isset($helper)) {
	include(THEME_DIR_PHP.'helper.php');
	$helper = new Helper();
}