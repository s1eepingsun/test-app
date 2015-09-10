/**
 * Created by User on 09.09.2015.
 */
//коллекция заданий
var TestTasks = Backbone.Collection.extend({
    model: Task,
    url: 'controllers/adminAjax2.php',
    comparator: 'order_num',
    parse: function(data) {
        return data.tasks;
    }
});