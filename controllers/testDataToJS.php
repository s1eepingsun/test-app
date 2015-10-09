<?php
require_once("classes/TestsDB2.php");
$testsDB = new TestsDB(); 

$testsDB::$file = 'test-data/math1-short.json';
$data = $testsDB->getTestsData();
?>

<script type="text/javascript">
    var phpTestData = <?=$data?>;
//    console.log('test data php1: ', phpTestData);
</script> 