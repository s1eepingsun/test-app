<?php
//класс для редактирования задач
require_once("../classes/TestsDB.php");
$testsDB = new TestsDB(); 

// $testsDB::$file =  'test-data/math1.json';
$testsDB::$file =   '../test-data/math1.json';
$testsDB::$shortFile =   '../test-data/math1-short.json';


//создать новое задание
if(isset($_POST['create']) && $_POST['create'] === 'true') {
    $testsDB->createTask();
    $testsDB->resetOrderValues();
   
//удалить задание
} else if(isset($_POST['delete']) && $_POST['delete'] === 'true') {
    $testsDB->deleteTask();
    $testsDB->resetOrderValues();
  
//редактировать задание
} else if(isset($_POST['modify']) && $_POST['modify'] === 'true') {
    $testsDB->modifyTask();
    $testsDB->resetOrderValues();

//вывести начальную страницу админки
} else {
   $data = $testsDB->getTestsData();
   echo $data;
}
