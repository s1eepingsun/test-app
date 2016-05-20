<?php
$paths = explode('/', $_SERVER['SCRIPT_NAME']);
if(count($paths) == 6) {
    require_once("../../../classes/TestsDB2.php");
} else {
    require_once("../../classes/TestsDB2.php");
}

$testsDB = new TestsDB();

//$testsDB::$file = 'test-data/ege/math-ege-5.json';
$testsDB::$file = 'test-data/common.json';

$data = $testsDB->getTestsData();

$testList = $testsDB->getTestList();
?>

<script type="text/javascript">
    var phpTestData = <?=$data?>;
    var phpTestList = <?=$testList?>;

//    console.log('testDataToJS phpTestList: ', phpTestList);
</script>