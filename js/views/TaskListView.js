var TaskListView;
TaskListView = Backbone.View.extend({
    defaults: {
        templateFile: 'side-bar2.hbs'
    },
    initialize: function (attributes, options) {
        console.log('SidebarView init model, options:', this, options);
        this.templateFile = options.templateFile;
    },
    events: {
        'click .task-item': 'selectTask'//клик на задачу на сайдбаре
    },

    //отображает шаблон списка задач
    render: function() {
        var that = this;
        var data = this.model;
        $.get('./tmpl/' + this.templateFile, function(source) {
            console.log('TaskListView render tmpl data 3: ', data);
            var template = Handlebars.compile(source);
            var rendered = template(data);
            $(that.el).html(rendered);
        });
        return this;
    },

    //клик по задаче на сайдбаре
    selectTask: function(e) {
        var element = e.target;
        var id = $(element).parent().attr('id');
        id = id.substring(2);
        console.log('taskListView id', id);

        //this.model.selectTask(id);
        adminTestApp.mainTestView.showTask(id);
        adminTestApp.testEdit.showTask(Number(id));
        adminTestApp.testEdit.showTaskEditBlock();

        console.log('THIS:', this);

    }
});