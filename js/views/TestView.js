var testApp = testApp || {};
testApp.TestView = Backbone.View.extend({
    el: '#gameArea',
    initialize: function () {
        this.testConfig = this.model.attributes.testConfig;
        this.activeTaskID = 0;//id задачи активной в данный момет
        this.resultMode = false;//служит для переключения стилей: false)прохождение теста; true)просмотр результатов
        this.sorted = false;//сделана ли сортировка, чтобы не сортировать дважды
        this.listenTo(Backbone, 'testTimerTick', this.testTimerShow);//передаётся из Timer.js
        if(this.testConfig.taskTimer == true) {
            this.listenTo(Backbone, 'testTimerTick', this.taskTimerShow);//передаётся из Timer.js
        }

        console.log('this from TestView', this);

        if(this.testConfig.freeTaskChange == false) {
            this.disableFreeTaskChange();
        }

    },
    template: Handlebars.compile($('#test-result-tmpl').html()),
    events: {
        'click #tb-new-test': 'startNewTest',//клик на Новый тест
        'click .answers .answer': 'giveAnswer',//клик на ответ
        'click #tb-prev-task': 'showPrevTask',//клик на Предыдущий вопрос в верхнем меню
        'click .single-test-data .tb-prev-task div:last-child': 'showPrevTask',//клик на Предыдущий вопрос в верхнем меню
        'click #tb-next-task': 'showNextTask',//клик на Следующий вопрос в задаче
        'click .single-test-data .tb-next-task div:last-child': 'showNextTask',//клик на Следующий вопрос в задаче
        'click #tb-finish-test': 'finishTest',//клик на Закончить тест
        'click #left-side-bar .task-item': 'sidebarHandler',//клик на задачу на сайдбаре
        'click #close-result-task': 'closeTask',//клик на крестик для зарытия задания при показе результата теста
        'click .close-test-description': 'closeDescription',//клик на крестик для зарытия описания
        'click #showDescription': 'showDescription'//клик на Описание
    },

    //отображает шаблон результата теста
    render: function() {
        var data = this.model.finalData;
        var rendered = this.template(data);
        $.cache('.single-test-data').hide();
        $.cache('#test-result').show();
        $.cache('#test-result').html(rendered);
    },

    //отключает и убирает кнопки "предыдущий вопрос"
    disableFreeTaskChange: function() {
        $.cache('#tb-prev-task').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').hide();
        $.cache('#tb-next-task').html('Пропустить вопрос');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').html('Пропустить вопрос');
    },

    //клик по задаче на сайдбаре
    sidebarHandler: function(e) {
        var element = e.target;
        var id = $(element).parent().attr('id');
        id = id.substring(2);

        console.log('result mode: ', this.resultMode);
        console.log('$(element).parent().hasClass(\'answer-given\'): ', $(element).parent().hasClass('answer-given'));

        //показ задания №id, если при просмотре результата - установка стилей
        if(this.resultMode) {
            if($(element).parent().hasClass('answer-given')) {
                $.cache('#test-result').hide();
                $.cache('#close-result-task').show();
                $.cache('#field').addClass('result-field');
                this.showTask(id);
            }
        } else if(this.activeTaskID > 0 && this.testConfig.freeTaskChange == true) { //если тест запущен
            this.showTask(id);
        }
    },

    //клик на Предыдущий вопрос
    showPrevTask: function(event) {
        if(this.activeTaskID == 0) return; //если тест не запущен

        var element = event.currentTarget;
        var id = Number(this.activeTaskID);

        if (!$(element).hasClass('disabled')) {
            if(this.resultMode == true) {
                var allAnswered = this.model.finalData.allAnswered;
                if (id > 1) {
                    while($.inArray(id - 1, allAnswered) < 0) {
                        id--;
                    }
                    this.showTask(id - 1);
                }
            } else {
                if (id > 1) this.showTask(id - 1);
            }
        }

        if (!$(element).hasClass('disabled') && this.testConfig.freeTaskChange == true) {
            if (id > 1) this.showTask(id - 1);
        }
    },

    //клик на следующий вопрос
    showNextTask: function(event) {
        if(this.activeTaskID == 0) return; //если тест запущен

        var element = event.currentTarget;
        var id = Number(this.activeTaskID);

        if (!$(element).hasClass('disabled')) {
            if(this.resultMode == true) {
                var allAnswered = this.model.finalData.allAnswered;
                if (id < this.model.tasksCount) {
                    while($.inArray(id + 1, allAnswered) < 0) {
                        id++;
                    }
                    this.showTask(id + 1);
                }
            } else {
                if (id < this.model.tasksCount) this.showTask(id + 1);
            }
        }

        //закончить тест если последний вопрос, сейчас действует от прямого вызова метода (по таймеру, не от кнопок)
        if (id == this.model.tasksCount && this.testConfig.lastTaskFinish == true && !$(element).hasClass('disabled')) {
            console.log('this.model.tasksCount, id', this.model.tasksCount, id);
            this.finishTest();
        }
    },

    //начать новый тест
    startNewTest: function() {
        console.log('new test start!');
        $.cache('#tb-finish-test').removeClass('disabled');
        $.cache('#left-side-bar').show();

        //сортирует ответы
        this.sortAnswers();

        //обнуляет заполненные данные из прошлых тестов
        this.model.testDataReset();

        //если это не первый запуск теста, обнулить данные и стили после показа результата
        if(this.model.answersGiven !== []) {
            this.model.answersGiven = [];
            this.setModeTestActive();
        }

        this.activeTaskID = 0;

        //показаывает задание 1
        this.showTask(1);

        //запускает таймер
        this.model.testTimerStart();
        this.testTimerShow();
    },

    //отображает таймер
    testTimerShow: function() {
        var timer = this.model.timer;
        var testTimerObj = timer.timeToObject(timer.timeNow);
        var timeString = timer.timeObToString(testTimerObj);
        $('#time-left').html(timeString);
    },

    taskTimerShow: function() {
        //console.log('taskTimerShow this', this);
        var id = this.activeTaskID;
        if(!this.model.taskTimer[id]) return;

        var timer = this.model.taskTimer[id];
        //console.log('taskTimerShow', timer.timeNow);
        //var taskTimerString = timer.timeObToString(timer.taskTimeNow[this.activeTaskID]);
        var taskTimerObj = timer.timeToObject(timer.timeNow);
        var taskTimerString = timer.timeObToString(taskTimerObj);
        //console.log('taskTimerShow id', id, $('#vn' + id + '.task-timer'));
        $('#vn' + id + ' .task-timer').html(taskTimerString);
    },

    //клик на ответ
    giveAnswer: function(e) {
        console.log('answer element', e);
        var element = e.currentTarget;
        if($(element).hasClass('disabled')) return;

        var id = $(element).parents('.single-test-data').attr('id');
        id = Number(id.substring(2));
        var answer = $(element).attr('answer');

        //отправляет данные в модель для записи
        this.model.recieveAnswer(id, answer);

        //показывает след. вопрос, в случае если это был последний вопрос показывает результат теста
        if(this.testConfig.multipleChoices != true) {
            if (id < this.model.tasksCount) {
                this.showTask(id + 1);
            } else if (id == this.model.tasksCount && this.testConfig.lastTaskFinish == true) {
                //$('#tb-finish-test').click();
                this.finishTest();
            }
        }
        console.log('this.model.tasksCount: ', this.model.tasksCount);
    },

    //визуально отображает данные ответы
    reflectAnswers: function(id, answers) {
        console.log('reflectAnswers: ', id, answers);
        if(answers.length > 0) {
            $('#qn' + id).addClass('answer-given');
            //$.cache('.test-tasks').removeClass('result-task');
        }

        $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
        answers.forEach(function(item) {
            $('#vn' + id + ' .answers .answer[answer="' + item + '"]').addClass('answer-chosen');
        })
    },

    //показать задание
    showTask: function(id) {
        var oldId = this.activeTaskID;
        this.activeTaskID = id;//for active task id to be available for other functions

        this.model.taskChange(id, oldId);//передаёт в модель новость о показе задачи
        this.taskTimerShow();

        $.cache('#test-result').hide();
        $.cache('.single-test-data').hide();
        $('#vn' + id).show();
        $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#qn' + id).addClass('active-task');
        var maxID;
        maxID = $.cache('.side-bar-table').find('tbody').children('tr').length;
        console.log('maxID, this.activeTaskID', maxID, this.activeTaskID);

        //отключает/включает кнопки навигции когда ответ последний или первый
        if(this.resultMode != true || this.testConfig.navInResult == true) {
            if (id == maxID) {
                $.cache('#tb-next-task').addClass('disabled');
                $.cache('.single-test-data').find('.tb-next-task div:last-child').addClass('disabled');
                $.cache('.single-test-data').find('.tb-next-task div:last-child').removeClass('hoverable');
            } else {
                $.cache('#tb-next-task').removeClass('disabled');
                $.cache('.single-test-data').find('.tb-next-task div:last-child').removeClass('disabled');
                $.cache('.single-test-data').find('.tb-next-task div:last-child').addClass('hoverable');
            }

            if (id == 1) {
                $.cache('#tb-prev-task').addClass('disabled');
                $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
                $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');
            } else {
                $.cache('#tb-prev-task').removeClass('disabled');
                $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('disabled');
                $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('hoverable');
            }
        }
    },

    //закончить тест
    finishTest: function() {
        if(this.activeTaskID > 0) { //если тест запущен
            //запускает метод в модели
            this.model.finishTest();
            console.log('finish test', this);
        }
    },

    //закрытие ответа при просмотре результатов теста
    closeTask: function() {
        $.cache('#field').removeClass('result-field');
        $.cache('#test-result').show();
        $.cache('.single-test-data').hide();
        $.cache('#close-result-task').hide();
        $.cache('.mainLayout').find('.in-task-description').hide();
    },

    //закрытие и показ описания
    closeDescription: function(e) {
        $(e.currentTarget).parent().hide();
    },
    showDescription: function() {
        $.cache('.test-description').show();
    },

    //включение режиа стилей для просмотра результатов теста
    setModeTestResult: function() {
        this.resultMode = true;

        if(this.testConfig.navInResult != true) {
            //отключает навигацию
            $.cache('#tb-prev-task').addClass('disabled');
            $.cache('#tb-next-task').addClass('disabled');
            $.cache('.single-test-data').find('.test-button').hide();
        }

        $.cache('#tb-finish-test').addClass('disabled');
        $.cache('.single-test-data').find('.answers .answer').removeClass('hoverable');
        $.cache('.single-test-data').find('.answers .answer').addClass('disabled');
        $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
        $.cache('#field').find('.in-task-description').hide();
        $.cache('.task-timer').addClass('in-result');
        $.cache('#time-left').hide();
    },

    //включение режима стилей для прохождения теста
    setModeTestActive: function() {
        this.resultMode = false;

        if(this.testConfig.navInResult != true) {
            //подключает навигацию
            $.cache('#tb-prev-task').removeClass('disabled');
            $.cache('#tb-next-task').removeClass('disabled');
            $.cache('.single-test-data').find('.test-button').show();
        }
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
        $.cache('#left-side-bar').find('.task-item').removeClass('answer-given answered-wrong answered-right');

        $.cache('#close-result-task').hide();
        $.cache('#field').removeClass('result-field');
    },

    //показывает результат теста
    showResult: function(data) {
        //ставит режим стилей и работы кнопок для показа результата теста
        this.setModeTestResult();

        console.log('finalData', data);
        console.log('this.model', this.model);
        console.log('this.model.correctAnswers', this.model.correctAnswers);
        console.log('data.allAnswered', data.allAnswered);
        console.log('data.wrongAnswers', data.wrongAnswers);

        //окрашивает ответы на задания с данными ответамиданные ответами
        for (var property in data.allAnswered) {
            var taskNumber = data.allAnswered[property];
            var allCorrectAnswers = this.model.correctAnswers;//массив правильных ответов на все вопрсы
            var answersGiven = this.model.answersGiven;
            console.log('property', property);
            console.log('data.allAnswered property', data.allAnswered[property]);
            console.log('task number', taskNumber);

            //обработка ответов на сайдбаре
            if($.inArray(taskNumber, data.correctAnswers) > -1) {
                $('#qn' + taskNumber).addClass('answered-right');
            } else {
                if(this.testConfig.resultAnswersStyle == 'wrong-borders') {
                    $('#qn' + taskNumber).addClass('answered-wrong');
                } else {
                    $('#qn' + taskNumber).addClass('answered-wrong');
                }
            }

            //обработка ответов в основном поле
            for (property in allCorrectAnswers[taskNumber]) {
                var AnswerPoints = allCorrectAnswers[taskNumber][property];
                var answerNum = property.substring(0, 7);

                //если ответ отмечен пользователем
                if($.inArray(answerNum, answersGiven[taskNumber]) > -1) {
                    if(this.testConfig.resultAnswersStyle == 'wrong-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').removeClass('answer-chosen');
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                        if (AnswerPoints <= 0) {
                            $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                        }
                    } else if(this.testConfig.resultAnswersStyle == 'answered-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                    } else {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                    }
                }

                //все правильные ответы
                if(AnswerPoints > 0) {
                    if(this.testConfig.resultAnswersStyle == 'right-wrong-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right-border');
                    } else {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right');
                    }
                } else if(this.testConfig.resultAnswersStyle == 'right-wrong-borders') {
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                }
            }
        }

        //показывает результат теста
        this.render();
    },

    //сортировка вопросов
    sortAnswers: function() {
        var config = this.model.attributes.testConfig;
        var tasksCount = this.model.tasksCount;
        console.log('sorting answers config', config);

        //сортировка dec - по убыванию
        if(config['answerOrder'] === 'dec') {
            //сортировка переворачивает список ответов, поэтому если сделать дважы снова будет дефолтный порядок
            if(this.sorted == true) return;
            for(var i = 1; i < tasksCount; i++) {
                var divs = $( '#vn' + i + ' .answers .answer').get().reverse();
                var answersHTML = domToString(divs);
                $( '#vn' + i + ' .answers').html(answersHTML);
            }
            this.sorted = true;

        //сортировка rand - случайный порядок
        } else if(config['answerOrder'] === 'rand') {
            for(i = 1; i < tasksCount; i++) {
                divs = $( '#vn' + i + ' .answers > div:last-child .answer').get();
                //console.log('divs: ', divs);
                divs = shuffle(divs);
                //console.log('divs after shuffle: ', divs[0]);
                answersHTML = domToString(divs[0]);
                $( '#vn' + i + ' .answers > div:last-child').html(answersHTML);
            }
        }

        //helper: делает строку из массива дом элементов
        function domToString(divs) {
            var a = '';
            for ( var j = 0; j < divs.length; j++ ) {
                var tmp = document.createElement("div");
                tmp.appendChild(divs[j]);
                a += tmp.innerHTML;
            }
            return a;
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
    }
});