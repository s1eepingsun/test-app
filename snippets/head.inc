<?php
    echo "<script type='text/javascript' src='js/main.js?v=$v'></script> \n\r";
    echo "<link media='screen' href='css/game-layout.css?v=$v' rel='stylesheet' type='text/css'>\n\r";
?>

<!-- styles -->
<link rel="shortcut icon" type="image/x-icon" href="http://logic-games.spb.ru/freecell/favicon.ico">
<link media="screen" href="./Example_files/shared.css" rel="stylesheet" type="text/css">
<link media="screen" href="./Example_files/game-layout.css" rel="stylesheet" type="text/css">
<link media="screen" href="css/test-main.css" rel="stylesheet" type="text/css">

<!-- assigning php data to js variable -->
<?php include 'controllers/testDataToJS.php'; ?>

<!-- handlebars templates -->
<script id="test-result-tmpl" type="text/x-handlebars-template">
    <?php include 'tmpl/result.hbs'; ?>
</script>

<!-- thrid-party libraries -->
<script type="text/javascript" src="js/libs/handlebars-v3.0.3.js"></script>
<script type="text/javascript" src="../mathjax/MathJax.js?config=TeX-AMS_HTML"></script>

<!-- modules -->
<script type="text/javascript" src="js/helpers.js"></script>
<script type="text/javascript" src="js/Timer.js"></script>
<script type="text/javascript" src="js/models/TestModel.js"></script>
<script type="text/javascript" src="js/views/ListView.js"></script>
<script type="text/javascript" src="js/views/MainView.js"></script>
<script type="text/javascript" src="js/controllers/TestController.js"></script>

<!-- application core (should be positioned after modules) -->
<script type="text/javascript" src="js/main2.js"></script>
