var testApp = testApp || {};
testApp.ListView = function(model) {
    this._model = model;
};

//добавление возможности запускать и слушать события
extend(testApp.ListView, Observable);

//метод для запуска событий
testApp.ListView.prototype.fireEvent = function(type, data, context) {
    this.constructor.superclass.fireEvent(type, data, context);
};

//метод для прослушивания событий
testApp.ListView.prototype.listen = function (type, method, scope, context) {
    this.constructor.superclass.listen(type, method, scope, context);
};

//метод который запускается сразу после инициализации объекта
testApp.ListView.prototype.init = function () {
    console.log('ListVIew ', this);
    var that = this;

    /**
     * UI events block
     */

    //клик на задачу на сайдбаре
    $.cache('#left-side-bar').find('.task-item').click(function(e) {
        var element = e.target;
        var id = $(element).parent().attr('id');
        id = id.substring(2);
        var answerGiven;
        $(element).parent().hasClass('answer-given')? answerGiven = true: answerGiven = false; //if task has an answer = true

        var data = {id: id, element: element, answerGiven: answerGiven};
        that.fireEvent('view:sidebarClick', data);
    });
};

//включение режима стилей для прохождения теста
testApp.ListView.prototype.setModeTestActive = function () {
    $.cache('#left-side-bar').find('.task-item').removeClass('answer-given answered-wrong answered-right');
};

//включение режиа стилей для просмотра результатов теста
testApp.ListView.prototype.setModeTestResult = function () {
    $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
};

//выделяет выбранную задачу
testApp.ListView.prototype.showTask = function (data) {
    var id = data['id'];
    $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
    $('#qn' + id).addClass('active-task');
};

//визуально отображает данные ответы
testApp.ListView.prototype.reflectAnswers = function (data) {
    this._data = data;
    var id = this._data['id'];
    var answers = this._data['answers'];
    console.log('ListView reflectAnswers id, answer: ', id, answers);
    answers.length > 0 ? $('#qn' + id).addClass('answer-given') : $('#qn' + id).removeClass('answer-given');
};

//показывает результат прохождения теста
testApp.ListView.prototype.showResult = function(data) {
    //ставит режим стилей для показа результата теста
    this.setModeTestResult();

    //окрашивает ответы на задания с данными ответамиданные ответами
    for (var property in data.allAnswered) {
        var taskNumber = data.allAnswered[property];
        console.log('property', property);
        console.log('data.allAnswered property', data.allAnswered[property]);
        console.log('task number', taskNumber);

        if ($.inArray(taskNumber, data.correctAnswers) > -1) {
            $('#qn' + taskNumber).addClass('answered-right');
        } else {
            if (this._model.config.resultAnswersStyle == 'wrong-borders') {
                $('#qn' + taskNumber).addClass('answered-wrong');
            } else {
                $('#qn' + taskNumber).addClass('answered-wrong');
            }
        }
    }
};


