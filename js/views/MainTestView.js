//вьюшка окна детального отображения задач
var testApp = testApp || {};
testApp.MainTestView = Backbone.View.extend({
    initialize: function () {
        this.activeTaskID = 0;//задача активная в данный момет
        this.resultMode = false;//служит для переключения стилей: false)прохождение теста; true)просмотр результатов
        this.listenTo(Backbone, 'showResult', this.showResult);
    },
    template: Handlebars.compile($('#test-main-tmpl').html()),

    //отображает шаблон детального окна задач
    render: function() {
        var data = this.model;
        var rendered = this.template(data);
        $(this.el).html(rendered);
        return this;
    },

    //показать задание
    showTask: function(id) {
        this.activeTaskID = id; //for active task id to be available for other functions
        console.log('show Task: ', id);
        $('#test-result').hide();
        $('.start-message').hide();
        $('.test-button').hide();
        $('.single-test-data').hide();
        $('#vn' + id).show();
        $('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#qn' + id).addClass('active-task');
        $('.mainLayout').find('.in-task-description').show();
    }

});
