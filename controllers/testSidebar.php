<?php
require_once("classes/TestsDB2.php");

$testsDB = new TestsDB();
$testsDB::$file =   'test-data/math1.json';

$testData = $testsDB->getTestsData();
$testData = json_decode($testData, true);

$testData['tasks'] = array_values($testData['tasks']);

//set view_number & max_points
foreach($testData['tasks'] as $key => $task) {
    $testData['tasks'][$key]['view_number'] = $key + 1 ;

    $taskPoints = 0;
    foreach($task['answer_points'] as $answerPoints) {
        $taskPoints += $answerPoints;
    }
    $testData['tasks'][$key]['max_points'] = $taskPoints ;

}

//подключить шаблон сайдбара
require_once 'views/testSidebar.php';

?>