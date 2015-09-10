<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("classes/TestsDB.php");

//получить данные теста
$testsDB = new TestsDB();
$testsDB::$file =   'test-data/math1.json';

$testData = $testsDB->getTestsData();
$testData = json_decode($testData, true);

//подключить шаблон центральный шаблон админки
require_once 'views/adminMain.php';
?>