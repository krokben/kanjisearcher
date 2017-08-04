<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	
	$kanji = $_GET['kanji'];

	$url = "http://jisho.org/search/" . $kanji;
	$html_select = file_get_contents($url);
	echo $html_select;
?>