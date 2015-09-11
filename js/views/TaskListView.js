//вьюшка списка задач
var testApp = testApp || {};
testApp.TaskListView = Backbone.View.extend({
    template: Handlebars.compile($('#admin-task-list-tmpl').html()),
    events: {
        'click .task-item': 'selectTask'//клик на задачу на сайдбаре
    },

    //отображает шаблон списка задач
    render: function() {
        var data = this.model;
        var rendered = this.template(data);
        $(this.el).html(rendered);
        return this;
    },

    //клик по задаче на сайдбаре
    selectTask: function(e) {
        var element = e.target;
        var id = $(element).parent().attr('id');
        id = id.substring(2);
        console.log('taskListView id', id);

        //this.model.selectTask(id);
        testApp.mainTestView.showTask(id);
        testApp.testEdit.showTask(Number(id));
        testApp.testEdit.showTaskEditBlock();

        console.log('THIS:', this);

    }
});