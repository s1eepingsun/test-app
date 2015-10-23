var testApp = testApp || {};
testApp.ListView = function(model) {
    this._model = model;
};

testApp.ListView.prototype = {
    //метод для запуска событий
    fireEvent: function (type, data, context) {
        Observable.prototype.fireEvent(type, data, context);
    },

    //метод для прослушивания событий
    listen: function (type, method, scope, context) {
        Observable.prototype.listen(type, method, scope, context);
    },

    //метод который запускается сразу после инициализации объекта
    init: function () {
        console.log('ListVIew ', this);
        var that = this;

        //клик на задачу на сайдбаре
        $('#left-side-bar').find('.task-item').click(function (e) {
            var element = e.currentTarget;
            var id = $(element).attr('id');
            id = Number(id.substring(2));

            that.fireEvent('view:sidebarClick', id);
        });
    },

    //рендерит список заданий
    renderTasksList: function (data) {
        var templateSource = $('#task-list-tmpl').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template(data);
        $('#left-side-bar').html(rendered);
    },

    //включение режима стилей для прохождения теста
    setModeTestActive: function () {
        $('#left-side-bar').find('.task-item').removeClass('answer-given answered-wrong answered-right');
    },

    //включение режиа стилей для просмотра результатов теста
    setModeTestResult: function () {
        $('#left-side-bar').find('.task-item').removeClass('active-task');
    },

    //выделяет выбранную задачу
    showTask: function (data) {
        var id = data['id'];
        $('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#qn' + id).addClass('active-task');
    },

    //визуально отображает данные ответы
    reflectAnswers: function (data) {
        var id = data['id'];
        var answers = data['answers']; //ответы данные на это задание
        console.log('ListView reflectAnswers id, answer: ', id, answers);
        answers.length > 0 ? $('#qn' + id).addClass('answer-given') : $('#qn' + id).removeClass('answer-given');
    },

    //показывает результат прохождения теста
    showResult: function (data) {
        //ставит режим стилей для показа результата теста
        this.setModeTestResult();

        //окрашивает задания с данными ответами
        for (var property in data.allAnswered) {
            var taskNumber = data.allAnswered[property];
            console.log('property', property);
            console.log('data.allAnswered property', data.allAnswered[property]);
            console.log('task number', taskNumber);

            if ($.inArray(taskNumber, data.correctAnswers) > -1) {
                $('#qn' + taskNumber).addClass('answered-right');
            } else {
                $('#qn' + taskNumber).addClass('answered-wrong');
            }
        }
    }

};


