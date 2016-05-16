<?php
require_once("../classes/TestsDB2.php");
$testsDB = new TestsDB();


//start logs block
// $data = $_SERVER['REQUEST_URI'];
// $data = $_SERVER['REQUEST_METHOD'];
// $data = $_SERVER['SCRIPT_FILENAME'];
// $data = $_SERVER['SCRIPT_NAME'];
//$data = $_REQUEST;
//$data = 'adsf2';

//file_put_contents('./test.json', $data);
//end logs block

//$testsDB::$file = 'test-data/math1-short.json';
//$data = $testsDB->getTestsData();

//echo json_encode($_REQUEST['filePath']);

$file = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['dir'] . 'test-data/' . $_REQUEST['testTypeDir'] . '/' . $_REQUEST['fileName'] . '.json';

//echo $file;
/*echo $_SERVER['SERVER_NAME'] . ' ' . $_SERVER['SCRIPT_FILENAME'] . ' ' . $_SERVER['DOCUMENT_ROOT'];
$filename = 'C:/Server/apache/htdocs/newtest2/controllers/testDataAjax.php';
if (file_exists($filename)) {
    echo "Файл $filename существует";
} else {
    echo "Файл $filename не существует";
}*/


$testsDB::$file = $file;
$data = $testsDB->getTestsData();
echo json_encode($data);
?>