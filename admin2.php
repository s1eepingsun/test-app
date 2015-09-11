<!DOCTYPE html>
<!-- saved from url=(0044)http://getbootstrap.com/examples/offcanvas/# -->
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="http://getbootstrap.com/favicon.ico">

    <title>Off Canvas Admin</title>
    
    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="css/offcanvas.css" rel="stylesheet">
    
    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    
    <link href="css/admin.css" rel="stylesheet">  
    
    <script src="js/libs/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="http://test.logic-games.spb.ru//js/lib/mathjax/MathJax.js?config=TeX-AMS_HTML"></script>
  </head>

  <body>
    <!--<nav class="navbar navbar-top navbar-inverse">
      <div class="container">
        <div class="row">
            <div class="col-xs-6 col-sm-3"></div>
            <div class="col-xs-12 col-sm-9">
                <div class="navbar-header">
                  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="./Off Canvas Template for Bootstrap_files/Off Canvas Template for Bootstrap.html">Математический тест</a>
                </div>
                <div id="navbar" class="collapse navbar-collapse">
                  <ul class="nav navbar-nav">
                    <li class="active"><a href="./Off Canvas Template for Bootstrap_files/Off Canvas Template for Bootstrap.html">Описание</a></li>
                    <li><a href="http://getbootstrap.com/examples/offcanvas/#about">About</a></li>
                    <li><a href="http://getbootstrap.com/examples/offcanvas/#contact">Перейти на другие игры</a></li>
                  </ul>
                </div>
            </div>
        </div>
      </div>
    </nav>--><!-- /.navbar -->

    <div class="container">

      <div class="row row-offcanvas row-offcanvas-left">
      
        <div class="col-xs-6 col-sm-3 sidebar-offcanvas" id="sidebar">
             <?php include('controllers/adminTaskList.php'); ?>
        </div><!--/.sidebar-offcanvas-->

        <div class="col-xs-12 col-sm-9">
            <p class="pull-left visible-xs">
                <button type="button" class="btn btn-primary btn-xs" data-toggle="offcanvas">Toggle nav</button>
            </p>
            <div class="test-nav">
                <button type="button" class="btn btn-lg btn-default create-new-task"><span class="hidden-xs hidden-sm">Создать</span><span class="visible-sm-inline visible-xs-inline">Созд.</span></button>
                <button type="button" class="btn btn-lg btn-default collapse-all-tasks"><span class="hidden-xs hidden-sm">Свернуть задачи</span><span class="visible-sm-inline visible-xs-inline">Сверн.</span></button>
                <button type="button" class="btn btn-lg btn-default expand-all-tasks"><span class="hidden-xs hidden-sm">Развернуть задачи</span><span class="visible-sm-inline visible-xs-inline">Разв.</span></button>
            </div>
          
            <div>
                <?php include('views/adminMain.php'); ?>
            </div>
          
            <div class="test-main">
          
            </div>
            
            
         <div class="row">
            <div class="col-xs-6 col-sm-3">
            </div>
            <div class="col-xs-12 col-sm-9">
                <div class="result">
                    <h3>Новое задание для теста:</h3>
                    <button type="button" class="btn btn-default create-new-task">Создать новое задание</button>

                    <form id="task-form"  action="javascript:void(null);" onsubmit="createTask()" method="post">
                        <div class="task-description">
                            <div>Описание теста</div>
                            <div><textarea id="editor-d1" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="description"></textarea></div>
                        </div>
                        <div class="task-description">
                            <div>Описание теста при просмотре задания</div>
                            <div><textarea id="editor-d2" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="in_task_description"></textarea></div>
                        </div>

                        <div class="task-description">
                            <div>Время на выполнение теста</div>
                            <div>
                                <label>Часов: <input type="text" class="form-input" name="test_hours" maxlength="4" size="2" value="0"></label>&nbsp;
                                <label>Минут: <input type="text" class="form-input" name="test_minutes" maxlength="4" size="2" value="0"></label>&nbsp;
                                <label>Секунд: <input type="text" class="form-input" name="test_seconds" maxlength="4" size="2" value="0"></label>
                            </div>
                        </div>

                        <div>Текст задачи</div>
                        <div><textarea id="editor1" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="task_content"></textarea></div>
                        <div>Вариант ответа 1</div>
                        <div><textarea id="editor-a1" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer1"></textarea></div>
                        <div>Вариант ответа 2</div>
                        <div><textarea id="editor-a2" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer2"></textarea></div>
                        <div>Вариант ответа 3</div>
                        <div><textarea id="editor-a3" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer3"></textarea></div>
                        <div>Вариант ответа 4</div>
                        <div><textarea id="editor-a4" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer4"></textarea></div>
                        <div>Вариант ответа 5</div>
                        <div><textarea id="editor-a5" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer5"></textarea></div>
                        <div>Вариант ответа 6</div>
                        <div><textarea id="editor-a6" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer6"></textarea></div>
                        
                        <div class="list-form">
                            <div class="row">
                                    <div class="col-xs-4 col-sm-4 col-xl-3"><label>Тип задачи</label></div>
                                    <div class="col-xs-8 col-sm-8 col-xl-9"><input type="text" class="form-input" name="type" maxlength="255"  value="задание"></div>
                                    
                            </div>
                            
                            <div class="row">
                                    <div class="col-xs-6 col-sm-4 col-xl-3"><label>Порядковый номер</label></div>
                                    <div class="col-xs-6 col-sm-8 col-xl-9"><input type="text" class="form-input" name="order_num" maxlength="10" size="6"></div>
                            </div>
                        </div>
                        
                        <div class="clear">&nbsp;</div>
                        
                         <!--<div class="form-left">
                            <div><label>баллы за ответ 1</label></div>
                            <div><label>баллы за ответ 2</label></div>
                            <div><label>баллы за ответ 3</label></div>
                            <div><label>баллы за ответ 4</label></div>
                            <div><label>баллы за ответ 5</label></div>
                            <div><label>баллы за ответ 6</label></div>
                        </div>
                        <div class="form-right">
                            <div><input type="text" class="form-input" name="answer1_points" maxlength="10" size="6" value="0"></div>
                            <div><input type="text" class="form-input" name="answer2_points" maxlength="10" size="6" value="0"></div>
                            <div><input type="text" class="form-input" name="answer3_points" maxlength="10" size="6" value="0"></div>
                            <div><input type="text" class="form-input" name="answer4_points" maxlength="10" size="6" value="0"></div>
                            <div><input type="text" class="form-input" name="answer5_points" maxlength="10" size="6" value="0"></div>
                            <div><input type="text" class="form-input" name="answer6_points" maxlength="10" size="6" value="0"></div>
                        </div>-->
                        
                        <div>Баллы за ответы</div>
                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input type="text" class="form-input" name="answer1_points" maxlength="10" size="6" value="0"></td>
                                        <td><input type="text" class="form-input" name="answer2_points" maxlength="10" size="6" value="0"></td>
                                        <td><input type="text" class="form-input" name="answer3_points" maxlength="10" size="6" value="0"></td>
                                        <td><input type="text" class="form-input" name="answer4_points" maxlength="10" size="6" value="0"></td>
                                        <td><input type="text" class="form-input" name="answer5_points" maxlength="10" size="6" value="0"></td>
                                        <td><input type="text" class="form-input" name="answer6_points" maxlength="10" size="6" value="0"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                         <input type="hidden"  name="task_id" maxlength="10" size="6" value="" >

                        <div class="submit">
                            <input value="Создать"  id="task-create" type="submit">
                        </div>
                    </form>   
                    
                    <div class="response"></div>
                </div>
            
            
            </div><!--/col-xs-12.col-sm-9-->
        </div><!--/.row-->

        
      </div><!--/row-->

      <hr>

      <footer>
        <p>© Company 2015</p>
      </footer>

    </div><!--/.container-->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="js/libs/bootstrap.min.js"></script>

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="js/libs/ie10-viewport-bug-workaround.js"></script>

    <script src="js/libs/offcanvas.js"></script>
    <script type="text/javascript" src="../ckeditor/ckeditor.js"></script>
    <script src="js/admin2.js"></script>


  

</body></html>