<?php
/**
 * @var array $testData Массив данных теста для шаблона
 */
?>

<div class="list-group side-bar-tasks">
    <?php foreach($testData['tasks'] as $taskID => $task):?>
        <a href=# class="list-group-item" id="qn<?=$task['task_id'];?>"><?=$task['order_num']. ' ('. $task['task_id']. ') '. $task['type'];?></a>
    <?php endforeach;?>
</div>