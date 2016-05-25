<?php
    echo "<script type='text/javascript' src='../../js/main.js?v=$v'></script> \n\r";
    echo "<link media='screen' href='../../css/game-layout.css?v=$v' rel='stylesheet' type='text/css'>\n\r";
?>

<meta name="description" content="Пройдите тест на знание следов животных бесплатно">

<!-- styles -->
<link media="screen" href="../../css/test-main.css" rel="stylesheet" type="text/css">
<link media="screen" href="css/test-specific.css" rel="stylesheet" type="text/css">


<!-- assigning php data to js variable -->
<?php include '../../controllers/testDataToJS.php'; ?>

<!-- handlebars templates -->
<script id="test-result-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/result-mark.hbs'; ?>
</script>

<script id="task-list-horizontal" type="text/x-handlebars-template">
    <?php include '../../tmpl/task-list-horizontal.hbs'; ?>
</script>

<script id="task-main-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/test-main.hbs'; ?>
</script>

<script id="test-list-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/test-list.hbs'; ?>
</script>

<!-- thrid-party libraries -->
<script type="text/javascript" src="../../js/libs/handlebars.min-latest.js"></script>

<!-- modules -->
<script type="text/javascript" src="../../js/helpers.js"></script>
<script type="text/javascript" src="../../js/timer.js"></script>
<script type="text/javascript" src="../../js/models/test-model.js"></script>
<script type="text/javascript" src="../../js/views/list-view.js"></script>
<script type="text/javascript" src="../../js/views/horizontal-list-view.js"></script>
<script type="text/javascript" src="../../js/views/main-view.js"></script>
<script type="text/javascript" src="../../js/controllers/test-controller.js"></script>

<!-- application core (should be positioned after modules) -->
<script type="text/javascript" src="../../js/main2.js"></script>
<script type="text/javascript" src="js/main-init.js"></script>
