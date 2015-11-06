<?php
require_once("classes/TestsDB2.php");
$testsDB = new TestsDB(); 

$testsDB::$file = 'test-data/ege/math-ege-5.json';

//$testsDB->$file = 'test-data/ege/math-ege-5.json';
$data = $testsDB->getTestsData();
?>

<script type="text/javascript">
    var phpTestData = <?=$data?>;
//    console.log('testDataToJS: ', phpTestData);
</script>