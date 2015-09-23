var testApp = testApp || {};
testApp.ListView = function() {
    //метод для прослушивания событий
    this.listen = function(type, method, scope, context) {
        this.constructor.superclass.listen(type, method, scope, context);
    };

    //метод который запускается сразу после инициализации объекта
    this.init = function() {
        //event listeners
        this.listen('test:setModeTestActive', this.setModeTestActive, this);
        this.listen('test:showResult', this.showResult, this);
    };

    //включение режима стилей для прохождения теста
    this.setModeTestActive = function() {
        $.cache('#left-side-bar').find('.task-item').removeClass('answer-given answered-wrong answered-right');
    };

    //включение режиа стилей для просмотра результатов теста
    this.setModeTestResult = function() {
        $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
    };

    //выделяет выбранную задачу
    this.highlightTask = function(id) {
        $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#qn' + id).addClass('active-task');
    };

    //визуально отображает данные ответы
    this.reflectAnswers = function(id, answers) {
        console.log('ListView reflectAnswers id, answer: ', id, answers);
        answers.length > 0? $('#qn' + id).addClass('answer-given'): $('#qn' + id).removeClass('answer-given');
    };

    //показывает результат прохождения теста
    this.showResult = function(observable, eventType, data) {
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
                if (testApp.testModel.config.resultAnswersStyle == 'wrong-borders') {
                    $('#qn' + taskNumber).addClass('answered-wrong');
                } else {
                    $('#qn' + taskNumber).addClass('answered-wrong');
                }
            }
        }
    }

};

