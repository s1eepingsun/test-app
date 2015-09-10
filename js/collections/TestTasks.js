//коллекция заданий
var testApp = testApp || {};
testApp.TestTasks = Backbone.Collection.extend({
    model: testApp.Task,
    url: 'controllers/adminAjax2.php',
    comparator: 'order_num',
    parse: function(data) {
        return data.tasks;
    }
});