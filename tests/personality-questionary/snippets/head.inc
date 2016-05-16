<?php
    echo "<script type='text/javascript' src='../../js/main.js?v=$v'></script> \n\r";
    echo "<link media='screen' href='../../css/game-layout.css?v=$v' rel='stylesheet' type='text/css'>\n\r";
?>

<meta name="description" content="Пройдите тест и определите к какому из 4 типов темперамента (сангвиник, холерик, меланхолик, флегматик) вы относитесь бесплатно">

<!-- styles -->
<link media="screen" href="../../css/test-main.css" rel="stylesheet" type="text/css">
<link media="screen" href="css/test-specific.css" rel="stylesheet" type="text/css">


<!-- assigning php data to js variable -->
<?php include '../../controllers/testDataToJS.php'; ?>

<!-- handlebars templates -->
<script id="test-result-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/temperament-result.hbs'; ?>
</script>

<script id="reference-book-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/reference-book.hbs'; ?>
</script>

<script id="task-list-tmpl" type="text/x-handlebars-template">
    <?php include '../../tmpl/side-bar-short2.hbs'; ?>
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
<script type="text/javascript" src="../../js/libs/handlebars-v4.0.5.js"></script>

<!-- modules -->
<script type="text/javascript" src="../../js/helpers.js"></script>
<script type="text/javascript" src="../../js/Timer.js"></script>
<script type="text/javascript" src="../../js/models/TestModel.js"></script>
<script type="text/javascript" src="../../js/views/ListView.js"></script>
<script type="text/javascript" src="../../js/views/HorizontalListView.js"></script>
<script type="text/javascript" src="../../js/views/MainView.js"></script>
<script type="text/javascript" src="../../js/views/ReferenceBookView.js"></script>
<script type="text/javascript" src="../../js/controllers/TestController.js"></script>

<!-- application core (should be positioned after modules) -->
<script type="text/javascript" src="../../js/main2.js"></script>
<script type="text/javascript" src="js/main-init.js"></script>
