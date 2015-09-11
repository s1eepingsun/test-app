<?php
/**
 * @var array $testData Массив данных теста для шаблона
 */
?>
    <table class="side-bar-table" border="0" cellspacing="0" bordercolor="#999" rules="groups">
        <thead>
        <tr>
            <th>№</th><th>Id</th><th>Order</th><th>Баллы</th>
        </tr>
        </thead>
        <tbody>
        <?php foreach($testData['tasks'] as $key => $task):?>
            <tr class="task-item" id="qn<?=$task['id'];?>">
                <td><?=$task['view_number'];?></td>
                <td><?=$task['id'];?></td>
                <td><?=$task['order_num'];?></td>
                <td><?=$task['max_points'];?></td>
            </tr>
        <?php endforeach;?>
        </tbody>
    </table>
