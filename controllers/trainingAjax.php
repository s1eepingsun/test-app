<?php
require_once("../classes/TestsDB2.php");
$testsDB = new TestsDB();

$tasksQuantity = $_REQUEST['tasksQuantity'];

if(isset($_REQUEST['taskKeys'])) {
    $taskKeys = $_REQUEST['taskKeys'];
} else {
    $taskKeys = [];
}


$fileNamePattern = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['dir'] . 'test-data/' . $_REQUEST['testTypeDir'] . '/' . $_REQUEST['fileName'];

$fileNamedata = ['dir' => $_REQUEST['dir'], 'testTypeDir' => $_REQUEST['testTypeDir'], 'fileName' => $_REQUEST['fileName']];

/*$data = $_REQUEST;
file_put_contents('./test.json', $fileNamePattern);*/

$data = $testsDB->getRandomTasks($tasksQuantity, $fileNamedata, $taskKeys);



//file_put_contents('./test.json', json_encode($_REQUEST));
echo json_encode($data);
?>