var testApp = testApp || {};
testApp.HorizontalListView = function(model) {
    this._model = model;
};

testApp.HorizontalListView.prototype = {
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
        console.log2('ListVIew ', this);
        var that = this;

        //клик на задачу на сайдбаре
        $('#horizontal-task-list').find('li').click(function (e) {
            var element = e.currentTarget;
            var id = $(element).attr('id');
            id = Number(id.substring(3));

            that.fireEvent('view:sidebarClick', id);
        });
    },

    renderTaskList: function(data) {
        if(this._model.config.horListHeightAdjusted != true) {
            this.shortedField();
        }

        var templateSource = $('#task-list-horizontal').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template(data);
        $('#bottom-task-list').html(rendered);
    },

    shortedField: function() {
        var fieldHeight = $('#field').css('height');
        fieldHeight = Number(fieldHeight.slice(0, -2));
        fieldHeight -= 32;
        $('#field').css('height', fieldHeight + 'px');
        this._model.config.horListHeightAdjusted = true;
    },

    lengthenField: function() {
        var fieldHeight = $('#field').css('height');
        fieldHeight = Number(fieldHeight.slice(0, -2));
        fieldHeight += 32;
        $('#field').css('height', fieldHeight + 'px');
    },

    //включение режима стилей для прохождения теста
    setModeTestActive: function () {
        $('#bottom-task-list').find('li').removeClass('answer-given answered-wrong answered-right');
    },

    //включение режиа стилей для просмотра результатов теста
    setModeTestResult: function (keepActiveSelection) {
        if(typeof keepActiveSelection === 'undefined') {
            this.removeSelection();
        }
    },

    removeSelection: function() {
        $('#bottom-task-list').find('li').removeClass('active-task');
    },

    //выделяет выбранную задачу
    showTask: function (data) {
        var id = data['id'];
        $('#bottom-task-list').find('li').removeClass('active-task');
        $('#hvn' + id).addClass('active-task');

        console.log2('horiz veiw conf', this._model.config);
        if(this._model.config.testTypeDir == 'personality-questionary') {
            $('#hvn' + id)[0].scrollIntoView(false);
        }
    },

    //визуально отображает данные ответы
    reflectAnswers: function (data) {
        var id = data['id'];
        var answers = data['answers']; //ответы данные на это задание
        console.log2('HorizontalListView reflectAnswers id, answer: ', id, answers);
        if(data['answers']) {
            answers.length > 0 ? $('#hvn' + id).addClass('answer-given') : $('#hvn' + id).removeClass('answer-given');
        } else {
            $('#hvn' + id).removeClass('answer-given');
        }
    },

    showTrainingAnswer: function(data) {
        /*if($.inArray(data['answer'][0], data['rightAnswers']) > -1) {
            $('#hvn' + data['id']).addClass('answered-right');
        } else {
            $('#hvn' + data['id']).addClass('answered-wrong');
        }*/

        if(data['rightAnswers']) {
            if($.inArray(data['answer'][0], data['rightAnswers']) > -1) {
                $('#hvn' + data['id']).addClass('answered-right');
            } else {
                $('#hvn' + data['id']).addClass('answered-wrong');
            }
        } else if(data['rightAnswer']) {
            if(data['answer'][0] === data['rightAnswer']) {
                $('#hvn' + data['id']).addClass('answered-right');
            } else {
                $('#hvn' + data['id']).addClass('answered-wrong');
            }
        }
    },

    showResult: function (data, keepActiveSelection) {
        this.setModeTestResult(keepActiveSelection);

        if(this._model.config.immediateAnswersOption == false) return;

        //окрашивает задания с данными ответами
        for (var property in data.allAnswered) {
            if(!data.allAnswered.hasOwnProperty(property)) continue;

            var taskNumber = data.allAnswered[property];

            if(!data.correctAnswers) data.correctAnswers = data.correctAnswersArr;
            if(!data.skippedAnswers) data.skippedAnswers = data.skippedAnswersArr;
            if(!data.wrongAnswers) data.wrongAnswers = data.wrongAnswersArr;

            if ($.inArray(taskNumber, data.wrongAnswers) > -1) {
                $('#hvn' + taskNumber).addClass('answered-wrong');
            } else if ($.inArray(taskNumber, data.correctAnswers) > -1) {
                $('#hvn' + taskNumber).addClass('answered-right');
            }
        }
    }

};


