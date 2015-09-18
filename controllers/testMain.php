<?php
require_once("classes/TestsDB2.php");

$testsDB = new TestsDB();
$testsDB::$file = 'test-data/math1.json';

$testData = $testsDB->getTestsData();
$testData = json_decode($testData, true);

$testData['tasks'] = array_values($testData['tasks']);

//helper: первая заглавная буква для utf-8 строки
function mb_ucfirst($text) {
    return mb_strtoupper(mb_substr($text, 0, 1)) . mb_substr($text, 1);
}

//set view_number & max_points
foreach($testData['tasks'] as $key => $task) {
    $testData['tasks'][$key]['view_number'] = $key + 1 ;

    $testData['tasks'][$key]['type'] = mb_ucfirst($task['type']) ;

    $taskPoints = 0;
    foreach($task['answer_points'] as $answerPoints) {
        $taskPoints += $answerPoints;
    }
    $testData['tasks'][$key]['max_points'] = $taskPoints;


    //timer data timestamp to array


    if(isset($task['taskTimerData'])) {
        $task['taskTimerData'] = $testsDB->timestampToArray($task['taskTimerData']);

        foreach($task['taskTimerData'] as $timerKey => $digit) {
            if ($timerKey == 'h' && $digit == 0) {
                unset($task['taskTimerData'][$timerKey]);
            } else if ($digit < 10) {
                if($timerKey != 'h') $task['taskTimerData'][$timerKey] = '0' . $digit;
            }
        }
        $testData['tasks'][$key]['taskTimerData'] = implode(':', $task['taskTimerData']);
    }

}

//подключить шаблон главного окна теста
require_once 'views/testMain.php';
?>