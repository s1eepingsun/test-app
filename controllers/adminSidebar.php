<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

//получить данные теста
require_once("classes/TestsDB.php");

$testsDB = new TestsDB();
$testsDB::$file =   'test-data/math1.json';

$testData = $testsDB->getTestsData();
$testData = json_decode($testData, true);

//подключить шаблон сайдбара
require_once 'views/adminSidebar.php';
?>