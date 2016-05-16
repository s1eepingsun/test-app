<?php

class TestsDB
{
    public static $file = 'test-data/math1.json';
//    public static $file = 'test-data/ege/math-ege-2.json';
    public static $shortFile = 'test-data/math1-short.json';

    public static $filename = 'math-ege';

    //возвращает данные теста
    public function getTestsData()
    {
        $file = self::$file;

        if(!file_exists($file)) return "couldn't get contents " . $file;

        $data = file_get_contents($file);
        $data = json_decode($data, true);

        /*$testList = $this->getTestList();
        $testList = json_decode($testList, true);

        $data['testList'] = $testList;*/

        $referenceBook = $this->getReferenceBook();
        if(is_array($referenceBook)) {
            $data['reference_book'] = $referenceBook;
        }


        $data = json_encode($data);

//        $testList = $this->getTestList(self::$filename);

        return $data;


        /*if(file_exists($file) && $data = file_get_contents($file)) {
            return $data;
        } else {
            return "couldn't get contents " . $file;
        }*/

    }

    public function getTestList($dir = '')
    {

        $file = self::$file;
//        $file = 'test-data/math123.json'; // || test-data/common.json
        if($dir == '') {
            $dir = $_SERVER['SCRIPT_NAME']; //math_test/tests/gims/index-local.php
                                       // || /math_test/tests/gims/boat_mp/index-local.php
        }

        /*$data = $_SERVER['SCRIPT_NAME'];
        $dir2 = explode('/', $data);
        array_pop($dir2);
        $testType = array_pop($dir2); //i.e. math
        $type = array_pop($dir2); //i.e. tests
        file_put_contents('./test.json', $data);*/

//        file_put_contents('./test.json', $dir);

        $pathArr = explode('/', $dir);
        array_pop($pathArr);
        $testType = array_pop($pathArr); //i.e. gims || boat_mp
        $specificDir = implode('/', $pathArr); //i.e. newtest2* /math_test/tests || /math_test/tests/gims
        $specificDir = /*'/' .*/ $specificDir . '/' . $testType . '/';



        /*if($testType === 'math') {
            $file = 'test-data/ege/math-ege-1.json';
        } else */if($testType === 'controllers') {
            $pattern = '#[\w-/]*/(test-data/[\w-/]*\.json)$#';
            preg_match($pattern, $file, $matches);
            $fileTmp = $matches[1];
            $lastPartLen = strlen($fileTmp);
            $lastPartLen = 0 - $lastPartLen;
            $firstPartLen = strlen($_SERVER['DOCUMENT_ROOT']);
            $specificDir = substr($file, $firstPartLen, $lastPartLen);
//            file_put_contents('./test.json', $specificDir);
            $file = $fileTmp;
        } else {
            $file = 'test-data/ege/' . $testType . '-ege-1.json';
        }



        $pathArr = explode('/', $file);
//        array_pop($pathArr);
        $filename = array_pop($pathArr); //i.e. math-ege-5.json
        $pattern = '/^([\w-]*)-[\w]{1,6}\.json$/';
        preg_match($pattern, $filename, $matches);
        $filename = $matches[1]; //i.e. gims-ege || boat_mp-ege



        array_shift($pathArr);
        $testTypeDir = implode('/', $pathArr);
//        $testTypeDir = '/' . $testTypeDir . '/'; //i.e. ege

        //$dir = C:/Server/apache/htdocs/math_test/tests/gims/test-data/ege/gims-ege-*.json
        // ||    C:/Server/apache/htdocs/math_test/tests/gims/boat_mp/test-data/ege/boat_mp-ege-*.json
        $dir = $_SERVER['DOCUMENT_ROOT'] . $specificDir . 'test-data/' . $testTypeDir . '/' . $filename . '-*.json';
        $filesArr = [];
        $len = strlen($filename) + 1;
//        file_put_contents('./test.json', $_SERVER['SCRIPT_NAME']);
        $fileNumbers = [];

        $gi = new GlobIterator($dir, FilesystemIterator::NEW_CURRENT_AND_KEY|FilesystemIterator::SKIP_DOTS);
        foreach ($gi as $file) {
            $fileBaseName = $file->getBasename();
            $fileNumber = substr($fileBaseName, $len, -5);
            $fileNumbers[] = $fileNumber;
            if(is_numeric($fileNumber)) {
                $filesArr[$fileNumber] = $_SERVER['DOCUMENT_ROOT'] . $specificDir . 'test-data/' . $testTypeDir . '/' . $filename . '-' . intval($fileNumber) . '.json';
            }
        }

        $filesString = '';
        $folders = [];
        $testLists = [];
        if(!count($fileNumbers) > 0) {
            $gi = new GlobIterator($_SERVER['DOCUMENT_ROOT'] . $specificDir . '*', FilesystemIterator::NEW_CURRENT_AND_KEY|FilesystemIterator::SKIP_DOTS);
            foreach ($gi as $fileName => $file) {
                if($file->isDir() && $fileName != "css" && $fileName != "js" && $fileName != 'snippets' && $fileName != 'test-data') {
                    $filesString = $filesString . ' ' .  $fileName;
                    $folders[] = $fileName;
                }
            }

            if(count($folders) > 0) {
                foreach($folders as $folder) {
                    $newDir = $specificDir . $folder . '/index.php';
//                    $testLists[] = json_decode($this->getTestList($newDir), true);
                    $testListPart = json_decode($this->getTestList($newDir), true);
                    $testLists = array_merge($testLists, $testListPart);
//                    foreach($testListPart)
                }
            }

            $testLists['multiple_test_types'] = true;
//            file_put_contents('./test.json', json_encode($testLists));

            return json_encode($testLists);
        }

        ksort($filesArr);

        $commonData = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . $specificDir . 'test-data/common.json'), true);
        $testTitle = $commonData['test_title'];

        $allTasks = [];
        $i = 0;
        foreach($filesArr as $key => $file) {
            $fileData = json_decode(file_get_contents($file), true);
            $testName = $fileData['test_title'];
            $fileData = count($fileData['tasks']);
            $allTasks[$i]['taskCount'] = $fileData;
            $allTasks[$i]['fileNumber'] = $key;
            $allTasks[$i]['testTitle'] = $testTitle;
            $allTasks[$i]['testType'] = $testType;
            $allTasks[$i]['testName'] = $testName;
            $i++;
        }

        return json_encode($allTasks);
    }

    public function getReferenceBook()
    {
        $file = 'test-data/reference-book.json';

        if(!file_exists($file)) return "couldn't get contents " . $file;

        $data = file_get_contents($file);
        $data = json_decode($data, true);

        return $data;
    }

    //редактирует общие данные о тесте (описание, время на тест)
    public function setTestInfo($model)
    {
        $file = self::$file;
        $oldData = json_decode(file_get_contents($file), true);

        //сообщение на лендинге теста
        if($model['start_message'] != '') {
            $startMessage = $model['start_message'];
        } else if(!isset($oldData['start_message'])) {
            $startMessage = '';
        } else {
            $startMessage = $oldData['start_message'];
        }

        //описание теста
        if($model['description'] != '') {
            $description = $model['description'];
        } else if(!isset($oldData['description'])) {
            $description = '';
        } else {
            $description = $oldData['description'];
        }

        //описание теста в задаче
        if($model['in_task_description'] != '') {
            $inTaskDescription = $model['in_task_description'];
        } else if(!isset($oldData['in_task_description'])) {
            $inTaskDescription = '';
        } else {
            $inTaskDescription = $oldData['in_task_description'];
        }

        //время на тест
        $timerData = array();
        if(($model['test_hours'] != 0 || $model['test_minutes'] != 0 || $model['test_seconds'] != 0) &&
            ($model['test_hours'] != '' || $model['test_minutes'] != '' || $model['test_seconds'] != '')) {
            $timerData['h'] = intval($model['test_hours']);
            $timerData['m'] = intval($model['test_minutes']);
            $timerData['s'] = intval($model['test_seconds']);
        } else if(isset($oldData['timerData'])) {
            $timerData = $oldData['timerData'];
        } else {
            $timerData['h'] = 0;
            $timerData['m'] = 30;
            $timerData['s'] = 0;
        }

        //запись и перемещение ответов и баллов в отдельные массивы
        $oldData['start_message'] = $startMessage;
        $oldData['description'] = $description;
        $oldData['in_task_description'] = $inTaskDescription;
        $oldData['timerData'] = $timerData;

        $newData = json_encode($oldData);

        //записывает данные в файл
        if(file_put_contents($file, $newData)) {
            echo $newData;
        } else {
            echo ' error, failed to fwrite test info';
        }

    }

    //редактирует задание если указан id, создаёт если не указан
    public function setTask($model)
    {
        $file = self::$file;

        $oldData = json_decode(file_get_contents($file), true);

        //установить id, если не указан
        if(!isset($model['id']) || strlen($model['id']) == 0 || $model['id'] == '') {
            if(isset($oldData) && is_array($oldData) && isset($oldData['tasks']) && count($oldData['tasks']) > 0) {
                $maxKey = max(array_keys($oldData['tasks']));
                $model['id'] = $maxKey + 1;
            } else {
                $model['id'] = 1;
                $oldData = array();
            }
        }
        $id = $model['id'];

        //удалить view_number т.к. иначе он не станет вычисляться из order_num
        unset($model['view_number']);

        //назначает порядок заданий order number
        if(!isset($model['order_num']) || strlen($model['order_num']) == 0) {
            if(isset($oldData) && count($oldData) > 0) {
                $orderKeys = array();
                foreach($oldData['tasks'] as $task) {
                    $orderKeys[] = $task['order_num'];
                }
                $maxKey = max($orderKeys);
                $model['order_num'] = $maxKey + 1;
            } else {
                $model['order_num'] = 1;
                $oldData = array();
            }
        } else {
            if(isset($oldData) && count($oldData) > 0) {
                $orderKeys = array();
                foreach($oldData['tasks'] as $taskID => $task) {
                    $orderKeys[] = $task['order_num'];
                }
                //raise order_num of tasks with same or higher order_num
                if(in_array($model['order_num'], $orderKeys)) {
                    foreach($oldData['tasks'] as $key => $task) {
                        if($task['order_num'] >= $model['order_num']) {
                            $oldData['tasks'][$key]['order_num'] += 1;
                        }
                    }
                }
            } else {
                $model['order_num'] = 1;
                $oldData = array();
            }
        }

        //удалить время на выполнение задания, если оно не валидное
        foreach($model['taskTimerData'] as $key => $value) {
            if(!is_numeric($value) || $value == '') $value = 0;
            if($value < 0) $value = -$value;
            $model['taskTimerData'][$key] = intval($value);
        }

        //записывает время числом (в миллисекундах)
        $timestamp = ($model['taskTimerData']['task_seconds'] +
                $model['taskTimerData']['task_minutes'] * 60 +
                $model['taskTimerData']['task_hours'] * 3600) * 1000;

        $model['taskTimerData'] = $timestamp;
        if(!is_numeric($model['taskTimerData']) || $model['taskTimerData'] <= 0) unset($model['taskTimerData']);


        $oldData['tasks'][$id] = $model;

        //возвращаемая модель для backbone.js
        $taskToReturn = json_encode($oldData['tasks'][$id]);

        $newData = json_encode($oldData);

        //write new data
        $fp = fopen($file, "w");

        if(fwrite($fp, $newData)) {
            fclose($fp);
            echo $taskToReturn;
        } else {
            echo 'error, failed to fwrite data<br>';
        }

    }

    //удаляет задание
    public function deleteTask($id)
    {
        $file = self::$file;
        $oldData = json_decode(file_get_contents($file), true);

        if(!$id > 0) exit("id isn't sent<br>");
        if(!isset($oldData) || !is_array($oldData) || !isset($oldData['tasks'])) exit("previous data is not found<br>");
        if(!isset($oldData['tasks'][$id])) exit("task data " . $id . " is not found<br>");

        unset($oldData['tasks'][$id]);

        $newData = json_encode($oldData);

        $fp = fopen($file, "w");
        if(fwrite($fp, $newData)) {
            fclose($fp);
            echo 'task ' . $id . ' deleted successfully!<br>';
        } else {
            echo 'failed to delete task<br> ' . $id;
        }

    }

    //делает выборку случайных заданий из разных вариантов теста
    public function getRandomTasks($tasksQuantity, $fileNamedata, $taskKeys)
    {
        $dir = $_SERVER['DOCUMENT_ROOT'] . $fileNamedata['dir'] . 'test-data/' . $fileNamedata['testTypeDir'] . '/' . $fileNamedata['fileName'] . '-*.json';
        $filesArr = [];
        $len = strlen($fileNamedata['fileName']) + 1;

        $gi = new GlobIterator($dir, FilesystemIterator::NEW_CURRENT_AND_KEY|FilesystemIterator::SKIP_DOTS);
        foreach ($gi as $file)
        {
            $filename = $file->getBasename();
            $fileNumber = substr($filename, $len, -5);
//            if(!in_array($fileNumber, [5])) continue; //delete this later
            if(is_numeric($fileNumber)) {
                $filesArr[] = $_SERVER['DOCUMENT_ROOT'] . $fileNamedata['dir'] . 'test-data/' . $fileNamedata['testTypeDir'] . '/' . $fileNamedata['fileName'] . '-' . intval($fileNumber) . '.json';
            }
        }

        $allTasks = [];
//        $allTasksCount = 0;
        foreach($filesArr as $key => $file) {
            $fileData = json_decode(file_get_contents($file), true);
            $fileData = $fileData['tasks'];
//            $data = json_encode($allTasks);
//            file_put_contents('./test.json', $data);
//            $allTasksCount++;
            $allTasks = array_merge($allTasks, $fileData);
        }

        $allTasksCount = count($allTasks);
        if($tasksQuantity > $allTasksCount) $tasksQuantity = $allTasksCount;

        $taskKeysCount = count($taskKeys);
        if($taskKeysCount > 0 && $allTasksCount > $taskKeysCount) {
            $allKeys = array_keys($allTasks);
            $randTaskKeys = array_diff($allKeys, $taskKeys);
        } elseif($taskKeysCount > 0 && $allTasksCount <= $taskKeysCount) {
            $randTaskKeys = [];
        } else {
            $randTaskKeys = array_rand($allTasks, $tasksQuantity);
        }

        $randTasks = [];
        foreach($randTaskKeys as $key) {
            $randTasks[$key] = $allTasks[$key];
        }

        return $randTasks;

    }

    //убирает пробелы в индексах в order_num (порядковый номер)
    public function resetOrderValues()
    {
        $file = self::$file;
        if(file_exists($file)) {
            $oldData = json_decode(file_get_contents($file), true);
        } else {
            exit('file ' . $file . ' not found <br>');
        }

        //sorting tasks by order_num
        function compare($a, $b) {
            return $a['order_num'] - $b['order_num'];
        }

        uasort($oldData['tasks'], "compare");

        $sorted = array();
        $i = 1;
        foreach($oldData['tasks'] as $taskID => $task) {
            $oldData['tasks'][$task['id']]['order_num'] = $i;
            $sorted[$i] = $oldData['tasks'][$task['id']];
            $i++;
        }

        uasort($oldData['tasks'], "compare");


        //записать новые данные
//        $oldData['tasks'] = $sorted;
        $newData = json_encode($oldData);
        if(file_put_contents($file, $newData)) {
//            echo ' order_num values reset successfully! <br>';
        }  else {
            echo ' error, failed to fwrite data (reset order_num values)';
        }
    }

    //создает укороченную версию файла теста для клиента
    public function createShortVersion()
    {
        $file = self::$file;
        $shortFile = self::$shortFile;

        $oldData = json_decode(file_get_contents($file), true);
        if(!isset($oldData) || !is_array($oldData) || !isset($oldData['tasks'])) exit("previous data is not found<br>");

        //создает укороченную версию данных из полной
        $shortData = $oldData;
        foreach($shortData['tasks'] as $key => $task) {
            unset($shortData['tasks'][$key]['task_content']);
            unset($shortData['tasks'][$key]['answers']);
            unset($shortData['tasks'][$key]['type']);
            unset($shortData['description']);
            unset($shortData['in_task_description']);
        }
        $shortData = json_encode($shortData);

        if(file_put_contents($shortFile, $shortData)) {
            echo 'short version of test file has been created!<br>';
        } else {
            echo 'error, failed to fwrite short data<br>';
        }
    }

    //перевод времени из таймстампа (в миллисекундах) в массив
    public function timestampToArray($timestamp) {
        $timeArr = array();

        $seconds = $timestamp/1000;

        //hours
        $timeArr['h'] = [];
        if($seconds > 3600) {
            $timeArr['h'] = floor($seconds/3600);
            $seconds = $seconds%3600;
        }
        if(count( $timeArr['h']) == 0) $timeArr['h'] = 0;

        //minutes
        $timeArr['m'] = [];
        if($seconds > 60) {
            $timeArr['m'] = floor($seconds/60);
            $seconds = $seconds%60;
        }
        if(count( $timeArr['m']) == 0) $timeArr['m'] = 0;

        $timeArr['s'] = floor($seconds);

        return $timeArr;
    }


}
