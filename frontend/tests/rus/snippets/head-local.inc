<?php
   // echo "<script type='text/javascript' src='js/main.js?v=$v'></script> \n\r";
    echo "<link media='screen' href='../css/game-layout.css?v=$v' rel='stylesheet' type='text/css'>\n\r";
?>
<script>
    console.log('qqfff');
    </script>

<!-- styles -->
<link rel="shortcut icon" type="image/x-icon" href="http://logic-games.spb.ru/freecell/favicon.ico">
<link rel="stylesheet" type="text/css" href="../css/jasmine.css">
<link media="screen" href="../css/test-main.css" rel="stylesheet" type="text/css">
<link media="screen" href="css/test-specific.css" rel="stylesheet" type="text/css">


<!-- assigning php data to js variable -->
<?php include '../../controllers/testDataToJS.php'; ?>

<!-- handlebars templates -->
<script id="test-result-tmpl" type="text/x-handlebars-template">
    <?php include '../tmpl/result.hbs'; ?>
</script>

<script id="task-list-tmpl" type="text/x-handlebars-template">
    <?php include '../tmpl/side-bar-short2.hbs'; ?>
</script>

<script id="task-main-tmpl" type="text/x-handlebars-template">
    <?php include '../tmpl/test-main.hbs'; ?>
</script>

<script id="test-list-tmpl" type="text/x-handlebars-template">
    <?php include '../tmpl/test-list.hbs'; ?>
</script>

<!-- thrid-party libraries -->
<script type="text/javascript" src="../js/libs/handlebars-v3.0.3.js"></script>
<script type="text/javascript" src="../js/libs/jasmine/jasmine.js"></script>
<script type="text/javascript" src="../js/libs/jasmine/jasmine-html.js"></script>
<!--<script type="text/javascript" src="js/libs/jasmine/boot.js"></script>-->

<!-- modules -->
<script type="text/javascript" src="../js/helpers.js"></script>
<script type="text/javascript" src="../js/Timer.js"></script>
<script type="text/javascript" src="../js/models/TestModel.js"></script>
<script type="text/javascript" src="../js/views/ListView.js"></script>
<script type="text/javascript" src="../js/views/MainView.js"></script>
<script type="text/javascript" src="../js/controllers/TestController.js"></script>

<!-- application core (should be positioned after modules) -->
<script type="text/javascript" src="js/main2.js"></script>

<!-- unit tests -->
<!--<script type="text/javascript" src="js/unitTests.js"></script>-->
