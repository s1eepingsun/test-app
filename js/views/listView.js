var testApp = testApp || {};
testApp.ListView = function(model) {
    this._model = model;
};

//добавление возможности запускать и слушать события
extend(testApp.ListView, Observable);

//метод для прослушивания событий
testApp.ListView.prototype.listen = function (type, method, scope, context) {
    this.constructor.superclass.listen(type, method, scope, context);
};

//метод который запускается сразу после инициализации объекта
testApp.ListView.prototype.init = function () {
    console.log('ListVIew ', this);
    //event listeners
    this.listen('test:setModeTestActive', this.setModeTestActive, this);
    this.listen('test:showResult', this.showResult, this);
    this.listen('test:reflectAnswers', this.reflectAnswers, this);
    this.listen('test:showTask', this.showTask, this);
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
testApp.ListView.prototype.showTask = function (observable, eventType, data) {
    this._data = data;
    var id = this._data['id'];
    $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
    $('#qn' + id).addClass('active-task');
};

//визуально отображает данные ответы
testApp.ListView.prototype.reflectAnswers = function (observable, eventType, data) {
    this._data = data;
    var id = this._data['id'];
    var answers = this._data['answers'];
    console.log('ListView reflectAnswers id, answer: ', id, answers);
    answers.length > 0 ? $('#qn' + id).addClass('answer-given') : $('#qn' + id).removeClass('answer-given');
};

//показывает результат прохождения теста
testApp.ListView.prototype.showResult = function(observable, eventType, data) {
    this._data = data;
    //ставит режим стилей для показа результата теста
    this.setModeTestResult();

    //окрашивает ответы на задания с данными ответамиданные ответами
    for (var property in this._data.allAnswered) {
        var taskNumber = this._data.allAnswered[property];
        console.log('property', property);
        console.log('data.allAnswered property', this._data.allAnswered[property]);
        console.log('task number', taskNumber);

        if ($.inArray(taskNumber, this._data.correctAnswers) > -1) {
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


