<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <title>Админка</title>	    
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
    <link href="css/admin.css" rel="stylesheet">
    <script src="js/libs/jquery-1.11.3.min.js"></script>
    <script src="js/libs/bootstrap.min.js"></script>
    <script src="js/libs/mustache.js"></script>
	<script type="text/javascript" src="mathjax/MathJax.js?config=TeX-AMS_HTML"></script>
	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
    <script src="js/admin.js"></script> 

</head>
<body>
	<div class="content">
        <!--<div class="mathjax-tests">
            <div>
                <p><span class="math-tex">\(x = {-b \pm \sqrt{b^2-4ac} \over 2a}\)</span></p>
            </div>
        </div>-->
        
        <div id="admin-section">
        </div>
                
        <div class="result">

            <h3>Новое задание для теста:</h3>
            <button type="button" class="btn btn-default create-new-task">Создать новое задание</button>

            <form id="task-form"  action="javascript:void(null);" onsubmit="createQuestion()" method="post">
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

                <div class="form-left">
                    <div><label>Тип задачи</label></div>
                    <div><label>Порядковый номер</label></div>
                    <!--<div><label>Вариант ответа 1</label></div>
                    <div><label>Вариант ответа 2</label></div>
                    <div><label>Вариант ответа 3</label></div>
                    <div><label>Вариант ответа 4</label></div>
                    <div><label>Вариант ответа 5</label></div>
                    <div><label>Вариант ответа 6</label></div>-->
                </div>
                <div class="form-right">
                    <div><input type="text" class="form-input" name="type" maxlength="255"  value="задание"></div>
                    <div><input type="text" class="form-input" name="order_num" maxlength="10" size="6"></div>
                    <!--<div><input type="text" class="form-input" name="answer1" maxlength="255"></div>
                    <div><input type="text" class="form-input" name="answer2" maxlength="255"></div>
                    <div><input type="text" class="form-input" name="answer3" maxlength="255"></div>
                    <div><input type="text" class="form-input" name="answer4" maxlength="255"></div>
                    <div><input type="text" class="form-input" name="answer5" maxlength="255"></div>
                    <div><input type="text" class="form-input" name="answer6" maxlength="255"></div>-->
                </div>
                
                <div class="clear">&nbsp;</div>
                
                 <div class="form-left">
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
                </div>
                
                 <input type="hidden"  name="task_id" maxlength="10" size="6" value="" >

                <div class="clear">&nbsp;</div>
                
                <div class="submit">
                    <input value="Создать"  id="task-create" type="submit">
                </div>
            </form>   
            
            <div class="response"></div>
        </div>
 

    </div>
    
</body>
</html>