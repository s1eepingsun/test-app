var testApp = testApp || {};
testApp.MainView = function(attrs) {
    //метод для прослушивания событий
    this.listen = function(event, listenerHandler, listener) {
        this.constructor.superclass.listen(event, listenerHandler, listener);
    };

    //метод который запускается сразу после инициализации объекта
    this.init = function() {
        //event listeners
        this.listen('test:setModeTestActive', this.setModeTestActive, this);
        this.listen('test:showResult', this.showResult, this);
    };

    //начинает новый тест
    this.startNewTest = function() {
        console.log('main view start new test');
        $.cache('#tb-finish-test').removeClass('disabled');
        $.cache('#left-side-bar').show();

        if(testApp.testModel.config.answerOrder) {
            this.sortAnswers(testApp.testModel.config.answerOrder);
        }
    };

    //рендерит результат теста по шаблону
    this.renderResultScore = function(data) {
        var templateSource = attrs.resultTmeplate;
        var template = Handlebars.compile($(templateSource).html());
        var rendered = template(data);
        $.cache('.single-test-data').hide();
        $.cache('#test-result').show();
        $.cache('#test-result').html(rendered);
    };

    //включение режима стилей для прохождения теста
    this.setModeTestActive = function() {
        //подключает навигацию
        $.cache('#tb-prev-task').removeClass('disabled');
        $.cache('#tb-next-task').removeClass('disabled');
        $.cache('.single-test-data').find('.test-button').show();

        $.cache('.start-message').hide();
        $.cache('#time-left').show();
        $.cache('#tb-finish-test').removeClass('disabled');
        $.cache('.single-test-data').find('.answers .answer').addClass('hoverable');
        $.cache('.single-test-data').find('.answers .answer').removeClass('disabled');
        $.cache('#field').find('.in-task-description').show();
        $.cache('.task-timer').removeClass('in-result');

        //убирает окраску ответов
        $.cache('.single-test-data').find('.answer').removeClass('answer-chosen answered-wrong answered-right');
        $.cache('.single-test-data').find('.answer').removeClass('answered-basic-border answered-right-border answered-wrong-border');

        $.cache('#close-result-task').hide();
        $.cache('#field').removeClass('result-field');
    };

    //включение режиа стилей для просмотра результатов теста
    this.setModeTestResult = function() {
        //отключает навигацию
        $.cache('#tb-prev-task').addClass('disabled');
        $.cache('#tb-next-task').addClass('disabled');
        $.cache('.single-test-data').find('.test-button').hide();

        $.cache('#tb-finish-test').addClass('disabled');
        $.cache('.single-test-data').find('.answers .answer').removeClass('hoverable');
        $.cache('.single-test-data').find('.answers .answer').addClass('disabled');
        $.cache('#field').find('.in-task-description').hide();
        $.cache('.task-timer').addClass('in-result');
        $.cache('#time-left').hide();
    };

    //отображает таймер теста
    this.testTimerShow = function(timeNow) {
        var timer = testApp.testModel.timer;
        var testTimerObj = timer.timeToObject(timeNow);
        var timeString = timer.timeObToString(testTimerObj);
        $('#time-left').html(timeString);
    };

    //отображает таймер отдельной задачи
    this.taskTimerShow = function() {
        var id = testApp.testModel.activeTaskID;
        if(!testApp.testModel.taskTimer[id]) return;

        var timer = testApp.testModel.taskTimer[id];
        //console.log('taskTimerShow', timer.timeNow);
        var taskTimerObj = timer.timeToObject(timer.timeNow);
        var taskTimerString = timer.timeObToString(taskTimerObj);
        //console.log('taskTimerShow id', id, $('#vn' + id + '.task-timer'));
        $('#vn' + id + ' .task-timer').html(taskTimerString);
    };

    //показать задание
    this.showTask = function(id, oldID) {
        //testApp.testModel.taskChange(id, oldID);//передаёт в модель новость о показе задачи
        this.taskTimerShow();
        console.log('mainVIew showTask id, oldID', id, oldID);
        $.cache('#test-result').hide();
        $.cache('.single-test-data').hide();
        $('#vn' + id).show();

        if(testApp.testModel.resultMode == true) {
            $.cache('#test-result').hide();
            $.cache('#close-result-task').show();
            $.cache('#field').addClass('result-field');
        }
    };

    //визуально отображает данные ответы
    this.reflectAnswers = function(id, answers) {
        console.log('MainView reflectAnswers id, answer: ', id, answers);
        $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
        answers.forEach(function(item) {
            $('#vn' + id + ' .answers .answer[answer="' + item + '"]').addClass('answer-chosen');
        })

    };

    //показывает результат прохождения теста
    this.showResult = function(observable, eventType, data) {
        //ставит режим стилей и работы кнопок для показа результата теста
        this.setModeTestResult();

        //окрашивает ответы на задания с данными ответамиданные ответами
        for (var property in data.allAnswered) {
            var taskNumber = data.allAnswered[property];
            var config = testApp.testModel.config;
            var allCorrectAnswers = testApp.testModel.correctAnswers;//массив правильных ответов на все вопрсы
            var answersGiven = testApp.testModel.answersGiven;
            console.log('property', property);
            console.log('data.allAnswered property', data.allAnswered[property]);
            console.log('task number', taskNumber);

            //обработка ответов в основном поле
            for (property in allCorrectAnswers[taskNumber]) {
                var answerPoints = allCorrectAnswers[taskNumber][property];
                var answerNum = property.substring(0, 7);

                //если ответ отмечен пользователем
                if($.inArray(answerNum, answersGiven[taskNumber]) > -1) {
                    if(config.resultAnswersStyle == 'wrong-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').removeClass('answer-chosen');
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                        if (answerPoints <= 0) {
                            $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                        }
                    } else if(config.resultAnswersStyle == 'answered-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                    } else {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                    }
                }

                //все правильные ответы
                if(answerPoints > 0) {
                    if(config.resultAnswersStyle == 'right-wrong-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right-border');
                    } else {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right');
                    }
                } else if(config.resultAnswersStyle == 'right-wrong-borders') {
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                }
            }
        }

        this.renderResultScore(data);
    };

    //закрытие ответа при просмотре результатов теста
    this.closeTask = function() {
        $.cache('#field').removeClass('result-field');
        $.cache('#test-result').show();
        $.cache('.single-test-data').hide();
        $.cache('#close-result-task').hide();
        $.cache('.mainLayout').find('.in-task-description').hide();
    };

    //отключает кнопки "предыдущий вопрос"
    this.disablePrevButtons = function() {
        $.cache('#tb-prev-task').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');
    };

    //отключает кнопки "следующий вопрос"
    this.disableNextButtons = function() {
        $.cache('#tb-next-task').addClass('disabled');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').addClass('disabled');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').removeClass('hoverable');
    };

    //делает кнопки "предыдущий вопрос" активными
    this.enablePrevButtons = function() {
        $.cache('#tb-prev-task').removeClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('hoverable');
    };

    //делает кнопки "следующий вопрос" активными
    this.enableNextButtons = function() {
        $.cache('#tb-next-task').removeClass('disabled');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').removeClass('disabled');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').addClass('hoverable');
    };

    //показывает описание теста
    this.showDescription = function() {
        $.cache('.test-description').show();
    };

    //закрывает описание теста
    this.closeDescription = function() {
        $.cache('.test-description').hide();
    };

    //отключает и убирает кнопки "предыдущий вопрос"
    this.disableFreeTaskChange = function() {
        $.cache('#tb-prev-task').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').hide();
        $.cache('#tb-next-task').html('Пропустить вопрос');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').html('Пропустить вопрос');
    };

    //сортировка вопросов
    this.sortAnswers = function(answerOrder) {
        var tasksCount = testApp.testModel.tasksCount;

        //сортировка dec - по убыванию
        if(answerOrder === 'dec') {
            //сортировка dec переворачивает список ответов, поэтому если сделать дважы снова будет дефолтный порядок
            if(this.sorted == true) return;
            for(var i = 1; i <= tasksCount; i++) {
                var divs = $( '#vn' + i + ' .answers .answer').get().reverse();
                console.log('divs after reverse: ', divs);
                $( '#vn' + i + ' .answers').append(divs);
            }
            this.sorted = true;

        //сортировка rand - случайный порядок
        } else if(answerOrder === 'rand') {
            for(i = 1; i <= tasksCount; i++) {
                divs = $( '#vn' + i + ' .answers > div:last-child .answer').get();
                //console.log('divs: ', divs);
                divs = shuffle(divs);
                //console.log('divs after shuffle: ', divs[0]);
                $( '#vn' + i + ' .answers > div:last-child').append(divs[0]);
            }
        }

        //helper: перемешивает массив
        function shuffle(array) {
            var counter = array.length, temp, index;
            while (counter > 0) {
                index = Math.floor(Math.random() * counter);
                counter--;
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return [array];
        }
    };

};


