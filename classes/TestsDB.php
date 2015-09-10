<?php

class TestsDB
{
    public static $file = 'test-data/math1.json';
    public static $shortFile = 'test-data/math1-short.json';
    
    public function getTestsData()
    {
        $file = self::$file;
        
        if(file_exists($file) && $data = file_get_contents(self::$file)) {
            return $data;
        } else {
            return 'couldn\'t get contents';
        }
        
    }
    
    public function createTask()
    {
        $file = self::$file;
        $shortFile = self::$shortFile;

       if(file_exists($file)) $oldData = json_decode(file_get_contents($file), true);
    
        //set task id
        if(!isset($_POST['task_id']) ||  strlen($_POST['task_id']) == 0) {
            if(isset($oldData) && is_array($oldData) && isset($oldData['tasks']) && count($oldData) > 0) {
                $maxKey = max(array_keys($oldData['tasks']));
                $_POST['task_id'] = $maxKey + 1;
            } else {
                $_POST['task_id'] = 1;
                $oldData = array();
            }
        }
        
        //set task order number
        if(!isset($_POST['order_num']) ||  strlen($_POST['order_num']) == 0) {
            if(isset($oldData) && count($oldData) > 0) {
                $orderKeys = array();
                foreach($oldData['tasks'] as $task) {
                    $orderKeys[] = $task['order_num'];
                }
                $maxKey = max($orderKeys);
                $_POST['order_num'] = $maxKey + 1;
            } else {
                $_POST['order_num'] = 1;
                $oldData = array();
            }
        } else {
            if(isset($oldData) && count($oldData) > 0) {
                $orderKeys = array();
                foreach($oldData['tasks'] as $taskID => $task) {
                    $orderKeys[] = $task['order_num'];             
                }
                //raise order_num of tasks with same or higher order_num
                if(in_array($_POST['order_num'], $orderKeys)) {
                    foreach($oldData['tasks'] as $key => $task) {
                        if($task['order_num'] >= $_POST['order_num']) {
                           $oldData['tasks'][$key]['order_num'] += 1;
                        }
                    }
                }
            } else {
                $_POST['order_num'] = 1;
                $oldData = array();
            }
        }
        


        //prepare new data
        unset($_POST['create']);
        $taskID = $_POST['task_id'];

        //описание теста
        if($_POST['description'] != '') {
            $description = $_POST['description'];
        } else if($oldData['description'] == '' || !isset($oldData['description'])) {
            $description = '';
        } else {
            $description = $oldData['description'];
        }
        unset($_POST['description']);

        //время на тест
        $timerData = array();
        if(($_POST['test_hours'] != 0 || $_POST['test_minutes'] != 0 || $_POST['test_seconds'] != 0) &&
            ($_POST['test_hours'] != '' || $_POST['test_minutes'] != '' || $_POST['test_seconds'] != '')) {
            $timerData['h'] = $_POST['test_hours'];
            $timerData['m'] = $_POST['test_minutes'];
            $timerData['s'] = $_POST['test_seconds'];
        } else if(isset($oldData['timerData'])) {
            $timerData = $oldData['timerData'];
        } else {
            $timerData['h'] = 0;
            $timerData['m'] = 30;
            $timerData['s'] = 0;
        }
        unset($_POST['test_hours']);
        unset($_POST['test_minutes']);
        unset($_POST['test_seconds']);

        //описание теста в задаче
        if($_POST['in_task_description'] != '') {
            $inTaskDescription = $_POST['in_task_description'];
        } else if($oldData['in_task_description'] == '' || !isset($oldData['in_task_description'])) {
            $inTaskDescription = '';
        } else {
            $inTaskDescription = $oldData['in_task_description'];
        }
        unset($_POST['in_task_description']);

        //запись и перемещение ответов и баллов в отдельные массивы
        $answers = array();
        $answer_points = array();

        foreach($_POST as $key => $value) {
            if($key == 'answer1' || $key == 'answer2' || $key == 'answer3' || $key == 'answer4' || $key == 'answer5' || $key == 'answer6') {
                $answers[$key] = $value;
                unset($_POST[$key]);
            }
            
            if($key == 'answer1_points' || $key == 'answer2_points' || $key == 'answer3_points' || $key == 'answer4_points' || $key == 'answer5_points' || $key == 'answer6_points') {
                $answer_points[$key] = $value;
                unset($_POST[$key]);
            }
        }
        
        $oldData['tasks'][$taskID] = $_POST;
        $oldData['tasks'][$taskID]['answers'] = $answers;
        $oldData['tasks'][$taskID]['answer_points'] = $answer_points;
        $oldData['description'] = $description;
        $oldData['in_task_description'] = $inTaskDescription;
        $oldData['timerData'] = $timerData;

        //создать укороченную версию данных для клиента
        $shortData = $oldData;
        foreach($shortData['tasks'] as $key => $task) {
            unset($shortData['tasks'][$key]['task_content']);
            unset($shortData['tasks'][$key]['answers']);
            unset($shortData['tasks'][$key]['type']);
            unset($shortData['description']);
            unset($shortData['in_task_description']);
        }
        $shortData = json_encode($shortData);

        $newData = json_encode($oldData);

        //write new data
        $fp = fopen($file, "w");
     
        if(fwrite($fp, $newData)) {
            fclose($fp);
            echo 'task is created!<br>';
        } else {
            echo 'error, failed to fwrite data<br>';
        }

        if(file_put_contents($shortFile, $shortData)) {
            echo 'short data is modified!<br>';
        } else {
            echo 'error, failed to fwrite short data<br>';
        }
    
    }
    
    
    //редактировать задание
    public function modifyTask()
    {
        $file = self::$file;
        $shortFile = self::$shortFile;

        if(file_exists($file)) $oldData = json_decode(file_get_contents($file), true);
    
        //set task id
        if(!isset($_POST['task_id']) ||  strlen($_POST['task_id']) == 0) {
            if(isset($oldData) && is_array($oldData) && isset($oldData['tasks']) && count($oldData) > 0) {
                $maxKey = max(array_keys($oldData['tasks']));
                $_POST['task_id'] = $maxKey + 1;
            } else {
                $_POST['task_id'] = 1;
                $oldData = array();
            }
        }
        
        //set task order number
        if(!isset($_POST['order_num']) ||  strlen($_POST['order_num']) == 0) {
            if(isset($oldData) && count($oldData) > 0) {
                $orderKeys = array();
                foreach($oldData['tasks'] as $task) {
                    $orderKeys[] = $task['order_num'];
                }
                $maxKey = max($orderKeys);
                $_POST['order_num'] = $maxKey + 1;
            } else {
                $_POST['order_num'] = 1;
                $oldData = array();
            }
        } else {
            if(isset($oldData) && count($oldData) > 0) {
                $orderKeys = array();
                foreach($oldData['tasks'] as $taskID => $task) {
                    $orderKeys[] = $task['order_num'];             
                }
                //raise order_num of tasks with same or higher order_num
                if(in_array($_POST['order_num'], $orderKeys)) {
                    foreach($oldData['tasks'] as $key => $task) {
                        if($task['order_num'] >= $_POST['order_num']) {
                            $oldData['tasks'][$key]['order_num'] += 1;
                        }
                    }
                }
            } else {
                $_POST['order_num'] = 1;
                $oldData = array();
            }
        }

        //prepare new data
        unset($_POST['modify']);
        $taskID = $_POST['task_id'];

        //описание теста
        if($_POST['description'] != '') {
            $description = $_POST['description'];
        } else if($oldData['description'] == '' || !isset($oldData['description'])) {
            $description = '';
        } else {
            $description = $oldData['description'];
        }
        unset($_POST['description']);

        //описание теста в задаче
        if($_POST['in_task_description'] != '') {
            $inTaskDescription = $_POST['in_task_description'];
        } else if($oldData['in_task_description'] == '' || !isset($oldData['in_task_description'])) {
            $inTaskDescription = '';
        } else {
            $inTaskDescription = $oldData['in_task_description'];
        }
        unset($_POST['in_task_description']);

        //время на тест
        $timerData = array();
        if(($_POST['test_hours'] != 0 || $_POST['test_minutes'] != 0 || $_POST['test_seconds'] != 0) &&
            ($_POST['test_hours'] != '' || $_POST['test_minutes'] != '' || $_POST['test_seconds'] != '')) {
            $timerData['h'] = $_POST['test_hours'];
            $timerData['m'] = $_POST['test_minutes'];
            $timerData['s'] = $_POST['test_seconds'];
        } else if(isset($oldData['timerData'])) {
            $timerData = $oldData['timerData'];
        } else {
            $timerData['h'] = 0;
            $timerData['m'] = 30;
            $timerData['s'] = 0;
        }
        unset($_POST['test_hours']);
        unset($_POST['test_minutes']);
        unset($_POST['test_seconds']);

        //запись и перемещение ответов и баллов в отдельные массивы
        $answers = array();
        $answer_points = array();

        foreach($_POST as $key => $value) {
            if($key == 'answer1' || $key == 'answer2' || $key == 'answer3' || $key == 'answer4' || $key == 'answer5' || $key == 'answer6') {
                if($value !== '') {
                    $answers[$key] = $value;
                }
                unset($_POST[$key]);
            }
            
            if($key == 'answer1_points' || $key == 'answer2_points' || $key == 'answer3_points' || $key == 'answer4_points' || $key == 'answer5_points' || $key == 'answer6_points') {
                //check if corresponding answer exists
                $answerKey = substr($key, 0, 7);
                if(array_key_exists($answerKey, $answers)) {
                    $answer_points[$key] = $value;
                }
                unset($_POST[$key]);
            }
        }
        
        $oldData['tasks'][$taskID] = $_POST;
        $oldData['tasks'][$taskID]['answers'] = $answers;
        $oldData['tasks'][$taskID]['answer_points'] = $answer_points;
        $oldData['description'] = $description;
        $oldData['in_task_description'] = $inTaskDescription;
        $oldData['timerData'] = $timerData;

        //создать укороченную версию данных для клиента
        $shortData = $oldData;
        foreach($shortData['tasks'] as $key => $task) {
            unset($shortData['tasks'][$key]['task_content']);
            unset($shortData['tasks'][$key]['answers']);
            unset($shortData['tasks'][$key]['type']);
            unset($shortData['description']);
            unset($shortData['in_task_description']);
        }
        $shortData = json_encode($shortData);
        
        $newData = json_encode($oldData);   

        //записать новые данные
        if(file_put_contents($file, $newData)) {
            echo 'data is modified!<br>';
        } else {
            echo 'error, failed to fwrite data<br>';
        }
        
        if(file_put_contents($shortFile, $shortData)) {
            echo 'short data is modified!<br>';
        } else {
            echo 'error, failed to fwrite short data<br>';
        }
        
    }    
    
    //удалить задание
    public function deleteTask()
    {
        $file = self::$file;
        $shortFile = self::$shortFile;
        
        if($_POST['id'] > 0) {
        $id = $_POST['id'];
        } else {
            exit("id isn't sent<br>");
        }
        
        if(file_exists($file)) $oldData = json_decode(file_get_contents($file), true);
        
        if(!isset($oldData) || !is_array($oldData) || !isset($oldData['tasks'])) exit("previous data is not found<br>");
        if(!isset($oldData['tasks'][$id])) exit("previous data id is not found<br>");

        unset($oldData['tasks'][$id]);

        $shortData = $oldData;
        foreach($shortData['tasks'] as $key => $task) {
            unset($shortData['tasks'][$key]['task_content']);
            unset($shortData['tasks'][$key]['answers']);
            unset($shortData['tasks'][$key]['type']);
            unset($shortData['description']);
            unset($shortData['in_task_description']);
        }
        $shortData = json_encode($shortData);

        $newData = json_encode($oldData);
        $fp = fopen($file, "w");

        if(fwrite($fp, $newData)) {
            fclose($fp);
            echo 'task ' . $id . ' deleted successfully!<br>';
        } else {
            echo 'failed to delete task<br> ' . $id;
        }

        if(file_put_contents($shortFile, $shortData)) {
            echo 'short data ' . $id . ' has been deleted!<br>';
        } else {
            echo 'error, failed to fwrite short data<br>';
        }
        
    }
    
    public function resetOrderValues() {
        $file = self::$file;
        if(file_exists($file)) $oldData = json_decode(file_get_contents($file), true);
         
        //sorting tasks by order_num
        function compare($a, $b) {
            return $a['order_num'] - $b['order_num'];
        }
        
        uasort($oldData['tasks'], "compare");
         
        $i = 1;
        foreach($oldData['tasks'] as $taskID => $task) {
            $oldData['tasks'][$task['task_id']]['order_num'] = $i;
            $i++;
        }
         
        $newData = json_encode($oldData);
        //записать новые данные
        if(file_put_contents($file, $newData)) {
            echo ' order_num values resetted successfully! <br>';
        }  else {
            echo ' error, failed to fwrite data (reset order_num values)';
        }
        
        //same for short version
        $shortFile = self::$shortFile;
        if(file_exists($shortFile)) $oldData = json_decode(file_get_contents($shortFile), true);
        
        uasort($oldData['tasks'], "compare");
         
        $i = 1;
        foreach($oldData['tasks'] as $taskID => $task) {
            $oldData['tasks'][$task['task_id']]['order_num'] = $i;
            $i++;
        }
         
        $newData = json_encode($oldData);
        //записать новые данные
        if(file_put_contents($shortFile, $newData)) {
            echo ' order_num values resetted successfully!<br>';
        }  else {
            echo ' error, failed to fwrite data (reset order_num values)<br>';
        }
         
    }
    
    
}
