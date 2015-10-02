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
        if(this._model.config.production != true) console.log('ListVIew ', this);
        var that = this;

        //клик на задачу на сайдбаре
        $.cache('#left-side-bar').find('.task-item').click(function (e) {
            var element = e.currentTarget;
            var id = $(element).attr('id');
            id = id.substring(2);

            that.fireEvent('view:sidebarClick', id);
        });
    },

    //включение режима стилей для прохождения теста
    setModeTestActive: function () {
        $.cache('#left-side-bar').find('.task-item').removeClass('answer-given answered-wrong answered-right');
    },

    //включение режиа стилей для просмотра результатов теста
    setModeTestResult: function () {
        $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
    },

    //выделяет выбранную задачу
    showTask: function (data) {
        var id = data['id'];
        $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#qn' + id).addClass('active-task');
    },

    //визуально отображает данные ответы
    reflectAnswers: function (data) {
        this._data = data;
        var id = this._data['id'];
        var answers = this._data['answers'];
        if(this._model.config.production != true) console.log('ListView reflectAnswers id, answer: ', id, answers);
        answers.length > 0 ? $('#qn' + id).addClass('answer-given') : $('#qn' + id).removeClass('answer-given');
    },

    //показывает результат прохождения теста
    showResult: function (data) {
        //ставит режим стилей для показа результата теста
        this.setModeTestResult();

        //окрашивает ответы на задания с данными ответамиданные ответами
        for (var property in data.allAnswered) {
            var taskNumber = data.allAnswered[property];
            if(this._model.config.production != true) console.log('property', property);
            if(this._model.config.production != true) console.log('data.allAnswered property', data.allAnswered[property]);
            if(this._model.config.production != true) console.log('task number', taskNumber);

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
    }

};


