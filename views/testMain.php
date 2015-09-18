<?php
/**
 * @var array $testData Массив данных теста для шаблона
 */
?>

<div class="in-task-description">
    <?=$testData['in_task_description'];?>
</div>

<div class="task-top-panel">
	<div id="time-left"></div>
    <div id ="test-time-left">&nbsp;<?php //=$testData['test_time'];?></div>
	<div>&nbsp;</div>
</div> 
<div id="close-result-task"><img src="images/icon_close.png"></div>

<div class="start-message">
    <?=$testData['start_message'];?>
</div>

<div class="test-description">
    <div class="close-test-description"><img src="images/icon_close.png"></div>
    <div>
        <?=$testData['description'];?>
    </div>
</div>

<div class="test-tasks">
		<?php foreach($testData['tasks'] as $task):?>
		<div class="single-test-data" id="vn<?=$task['view_number'];?>">
            <div class="task-timer"></div>
			<div class="task-number"><b><?php echo ucfirst($task['type']);?> №<?=$task['view_number'];?></b></div>
			<div class="task-content"><?=$task['task_content'];?></div>
			<div class="clear">&nbsp;</div>
            <div class="answers">
                <div class="tb-prev-task test-button disabled"><div></div><div>Предыдущий<br>вопрос</div></div>
                <div class="tb-next-task test-button disabled"><div></div><div>Следующий<br>вопрос</div></div>
                <div>
                    <?php foreach($task['answers'] as $key => $answer):?>
                    <div answer="<?=$key;?>" class="answer hoverable"><?=$answer;?></div>
                    <?php endforeach;?>
                </div>
            </div>
			<div class="clear">&nbsp;</div>
		</div>
		<?php endforeach;?>
</div>

<div id="nothing-answered">
Вы не решили ни одного задания.
</div>

<div id="test-result"></div>
<div class="response"></div>