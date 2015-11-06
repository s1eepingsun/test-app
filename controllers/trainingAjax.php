<?php
require_once("../classes/TestsDB2.php");
$testsDB = new TestsDB();

$tasksQuantity = $_REQUEST['tasksQuantity'];

$fileNamePattern = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['dir'] . 'test-data/' . $_REQUEST['testTypeDir'] . '/' . $_REQUEST['fileName'];

$fileNamedata = ['dir' => $_REQUEST['dir'], 'testTypeDir' => $_REQUEST['testTypeDir'], 'fileName' => $_REQUEST['fileName']];

$data = $testsDB->getRandomTasks($tasksQuantity, $fileNamedata);

file_put_contents('./test.json', json_encode($data));
echo json_encode($data);
?>