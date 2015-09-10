<?php
require_once("classes/TestsDB.php");
$testsDB = new TestsDB(); 

$testsDB::$file = 'test-data/math1.json';
$data = $testsDB->getTestsData();
?>

<script type="text/javascript">
    var phpTestData = <?=$data?>;
    console.log('test data php1: ', phpTestData);
</script> 