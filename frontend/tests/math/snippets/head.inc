<?php
    echo "<script type='text/javascript' src='../../js/main.js?v=$v'></script> \n\r";
    echo "<link media='screen' href='../../css/game-layout.css?v=$v' rel='stylesheet' type='text/css'>\n\r";
?>

<meta name="description" content="Пройдите тест ЕГЭ по математике бесплатно">

<!-- styles -->
<link media="screen" href="../../css/test-main.css" rel="stylesheet" type="text/css">
<link media="screen" href="css/test-specific.css" rel="stylesheet" type="text/css">


<!-- assigning php data to js variable -->
<?php include '../../controllers/testDataToJS.php'; ?>

<!-- handlebars templates -->
<script id="test-result-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/result.hbs'; ?>
</script>

<script id="reference-book-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/reference-book.hbs'; ?>
</script>

<script id="task-list-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/side-bar.hbs'; ?>
</script>

<script id="task-main-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/test-main.hbs'; ?>
</script>

<script id="test-list-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/test-list.hbs'; ?>
</script>

<!-- thrid-party libraries -->
<script type="text/javascript" src="../../js/libs/handlebars.min-latest.js"></script>
<script type="text/javascript" src="../../mathjax/MathJax.js?config=TeX-AMS_HTML"></script>

<!-- modules -->
<script type="text/javascript" src="../../js/helpers.js"></script>
<script type="text/javascript" src="../../js/timer.js"></script>
<script type="text/javascript" src="../../js/models/test-model.js"></script>
<script type="text/javascript" src="../../js/views/list-view.js"></script>
<script type="text/javascript" src="../../js/views/horizontal-list-view.js"></script>
<script type="text/javascript" src="../../js/views/main-view.js"></script>
<script type="text/javascript" src="../../js/views/reference-book-view.js"></script>
<script type="text/javascript" src="../../js/controllers/test-controller.js"></script>

<!-- application core (should be positioned after modules) -->
<script type="text/javascript" src="../../js/main2.js"></script>
<script type="text/javascript" src="js/main-init.js"></script>
