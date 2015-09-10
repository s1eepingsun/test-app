<?php
/**
 * @var array $testData Массив данных теста для шаблона
 */
/*echo '<pre>';
print_r($testData);
echo '</pre>';*/

?>

<div class="result">
    <!--<div class="container">-->
        <h3>Задачи:</h3>
        
            <div class="test-tasks">
                <?php foreach($testData['tasks'] as $taskID => $task):?>
                    <div class="single-test-data" id="task_<?=$task['task_id'];?>">
                        
                        <div class="task-full">Порядковый номер: <?=$task['order_num']?> Id: <span class="task-id"><?=$task['task_id'];?>   Тип задачи: <?=$task['type'];?></span> <span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></div>
                        <div>Задание</div>
                        <div class="task-content"><?=$task['task_content']?></div>
                        <div class="answers">
                            <div>Варианты ответов</div>
                            <?php foreach($task['answers'] as $answerNumber => $answer):?>
                                <div><?=$answer;?></div>
                            <?php endforeach;?>
                        </div>   
                        
                        <div class="answer-points">
                            <div>Баллы за ответ</div>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <?php foreach($task['answer_points'] as $answerNumber => $answerPoints):?>
                                        <td><?=$answerPoints;?></td>
                                        <?php endforeach;?>
                                    </tr>
                                </tbody>
                            </table>
                         </div> 
                       
                        <div class="clear">&nbsp;</div>
                        <button type="button" class="btn btn-default delete-task">Удалить задачу</button>
                        <button type="button" class="btn btn-default modify-task">Редактировать задачу</button>
                    </div>
                    <div class="task-short"><span class="task-id">Порядковый номер: <?=$task['order_num']?> Id: <?=$task['task_id'];?> </span> Тип вопроса (название): <?=$task['type'];?> <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></div>
                   <!-- <div class="clear">&nbsp;</div>-->
                <?php endforeach;?>

            </div>
        </div>
    <!--</div>-->
    
    <div class="response"></div>
</div>

