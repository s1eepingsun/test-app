<?php
$paths = explode('/', $_SERVER['SCRIPT_NAME']);
if(count($paths) == 6) {
    require_once("../../../classes/TestsDB2.php");
} else {
    require_once("../../classes/TestsDB2.php");
}

//require_once("../../classes/TestsDB2.php");

$testsDB = new TestsDB();

/*$data = $_SERVER['SCRIPT_NAME'];
$dir = explode('/', $data);
array_pop($dir);
array_pop($dir);
$type = array_pop($dir);
file_put_contents('./test.json', $dir);
print_r($type);*/

$testsDB::$file = 'test-data/common.json';
//$testsDB::$file = 'test-data/ege/math-ege-1.json';



$testData = $testsDB->getTestsData();
$testData = json_decode($testData, true);

$testData['tasks'] = array_values($testData['tasks']);


//helper: первая заглавная буква для utf-8 строки
function mb_ucfirst($text) {
    return mb_strtoupper(mb_substr($text, 0, 1)) . mb_substr($text, 1);
}

//set view_number & max_points, makes string out of task timer arrays
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
if(count($paths) == 6) {
    require_once("../../../views/testMain.php");
} else {
    require_once("../../views/testMain.php");
}
?>