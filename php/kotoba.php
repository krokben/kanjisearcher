<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
	
	$file = '../src/kotoba.json';
	$json = json_decode(file_get_contents($file), true);

	function myFilter($string) {
	  return strpos($string, $_DELETE) === false;
	}

	if ($_DELETE) {
		$data = $_DELETE;
		$newArray = array_filter($json, 'myFilter');

		array_push($tempArray, $data);
		$jsonData = json_encode($tempArray);
		file_put_contents($file, $jsonData);

	}	else {
		$data = $_POST;

		$tempArray = $json;
		array_push($tempArray, $data);
		$jsonData = json_encode($tempArray);
		file_put_contents($file, $jsonData);
	}
?>