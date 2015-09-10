<?php

require_once("../classes/TestsDB2.php");



//start logs block
        $data = $_SERVER['REQUEST_URI'];
    //    $data = $_SERVER['REQUEST_METHOD'];
//    $data = $_REQUEST;
    file_put_contents('../test-data/test.json', $data);
//end logs block

if(isset($_REQUEST['_method'])) {
    $method = $_REQUEST['_method'];
} else {
    $method = $_SERVER['REQUEST_METHOD'];
}

$file = '../test-data/math1.json';
$shortFile = '../test-data/math1-short.json';
if(!file_exists($file)) exit("file doesn't exists");

$testsDB = new TestsDB();
$testsDB::$file = $file;
$testsDB::$shortFile = $shortFile;

$uri = $_SERVER['REQUEST_URI'];

switch($method) {
    case 'GET':
        $data = $testsDB->getTestsData();
        echo $data;
        break;

    case 'POST':
        $model = json_decode($_REQUEST['model'], true);
        if (isset($model['answers']) || isset($model['task_content'])) {
            $testsDB->setTask($model);
            $testsDB->resetOrderValues();
            break;
        } else {
            $testsDB->setTestInfo($model);
            break;
        }

    case 'PUT':
        $model = json_decode($_REQUEST['model'], true);
        if (isset($model['answers']) || isset($model['task_content'])) {
            $testsDB->setTask($model);
            $testsDB->resetOrderValues();
            break;
        } else {
            $testsDB->setTestInfo($model);
            break;
        }

    case 'DELETE':
        //берёт id задачи - последняя часть запроса URI, нужно брать из uri т.к. тело запроса отсутствует
        $pattern = '/.*\/(\d+)$/';
        preg_match($pattern, $uri, $matches);
        $id = $matches[1];
        $testsDB->deleteTask($id);
        $testsDB->resetOrderValues();
        break;
}

