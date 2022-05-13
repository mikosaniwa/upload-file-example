<?php
	include('connection.php');
    include_once('core.php');
	
	$response = array();
	$DIR = 'uploads/';
	$urlServer = 'http://localhost';
	
	$filepath = "lessoncontent/";
	
	$lessonid = $_POST['lessonid'];
	$filename = "lessoncontent".$lessonid.".txt";
	$contentfile = fopen($filepath.$filename, "w") or die("Unable to open file!"); //open file
	
	$arraysize = count($_POST) + count($_FILES);
    for ($i = 0; $i < $arraysize; $i++) { //first item is title so start from i = 1
		$textname = "text"."$i";
		$code = "code"."$i";
		$circuit = "circuit"."$i";
		$imagename = "image"."$i";
		if ($_POST[$textname]) { //if it is text
			if (fwrite($contentfile, $_POST[$textname])) {
				fwrite($contentfile, "\n");
				$response = array("status" => "success", "error" => false, "message" => "text saved");
			}
			else {
				$response = array("status" => "error", "error" => true, "message" => "text not saved");
			}
		}
		else if($_POST[$code]){
			if (fwrite($contentfile, $_POST[$code])) {
				fwrite($contentfile, "\n");
				$response = array("status" => "success", "error" => false, "message" => "text saved");
			}
			else {
				$response = array("status" => "error", "error" => true, "message" => "text not saved");
			}
		}
		else if($_POST[$circuit]){
			if (fwrite($contentfile, $_POST[$circuit])) {
				fwrite($contentfile, "\n");
				$response = array("status" => "success", "error" => false, "message" => "text saved");
			}
			else {
				$response = array("status" => "error", "error" => true, "message" => "text not saved");
			}
		}
		else if ($_FILES[$imagename]) { //if it is image
			$fileName = $_FILES[$imagename]["name"];
			$tempFileName = $_FILES[$imagename]["tmp_name"];
			$error = $_FILES[$imagename]["error"];

			if ($error > 0) {
				$response = array(
					"status" => "error",
					"error" => true,
					"message" => "Error uploading the file!"
				);
			}
			else {
				$FILE_NAME = rand(10, 1000000)."-".$fileName;
				$UPLOAD_IMG_NAME = $DIR.strtolower($FILE_NAME);
				$UPLOAD_IMG_NAME = preg_replace('/\s+/', '-', $UPLOAD_IMG_NAME);
			
				if(move_uploaded_file($tempFileName , $UPLOAD_IMG_NAME)) {
					fwrite($contentfile, $UPLOAD_IMG_NAME); //add image name to text file so we can save the placement of image within lesson content
					fwrite($contentfile, "\n");
					$response = array(
						"status" => "success",
						"error" => false,
						"message" => "Image has uploaded",
						"url" => $urlServer."/".$UPLOAD_IMG_NAME
					  );
				}
				else {
					$response = array(
						"status" => "error",
						"error" => true,
						"message" => "Error occured"
					);
				}
			}
		}
		else {
			$response = array(
				"status" => "error",
				"error" => true,
				"message" => $textname
			);
		}
	}
	fclose($contentfile);
	
	echo json_encode($response);
	$sql = "UPDATE lesson SET contentFile = '$filename' WHERE lessonID = '$lessonid'";
	$result = mysqli_query($db_conn, $sql);
		
	if ($result) {
		echo json_encode(array("success" => 1, "message" => "lesson content saved on database"));
	} 
	else {
		echo json_encode(array("success" => 0, "message" => "lesson content fail to save on database"));
	}
	
?>