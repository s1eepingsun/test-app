/**
 * Created by User on 26.08.2015.
 */
var TestView;
TestView = Backbone.View.extend({
    el: '#gameArea',
    initialize: function () {
        this.activeTaskID = 0;//задача активная в данный момет
        this.resultMode = false;//служит для переключения стилей: false)прохождение теста; true)просмотр результатов
        this.listenTo(Backbone, 'testTimerTick', this.testTimerShow);//передаётся из Timer.js
    },
    events: {
        'click #tb-new-test': 'startNewTest',//клик на Новый тест
        'click .answers .answer': 'giveAnswer',//клик на ответ
        'click #tb-prev-task': 'showPrevTask',//клик на Предыдущий вопрос
        'click .single-test-data .tb-prev-task div:last-child': 'showPrevTask',//клик на Предыдущий вопрос
        'click #tb-next-task': 'showNextTask',//клик на Следующий вопрос
        'click .single-test-data .tb-next-task div:last-child': 'showNextTask',//клик на Следующий вопрос
        'click #tb-finish-test': 'finishTest',//клик на Закончить тест
        'click #left-side-bar .task-item': 'SidebarHandler',//клик на задачу на сайдбаре
        'click #close-result-task': 'closeTask',//клик на крестик для зарытия теста
        'click .close-test-description': 'closeDescription',//клик на крестик для зарытия описания
        'click #showDescription': 'showDescription'//клик на Описание
    },

    //отображает шаблон результата теста
    render: function() {
        var data = this.model.finalData;
        $.get('./tmpl/result.hbs', function(source) {
            console.log('render tmpl data: ', data);
            var template = Handlebars.compile(source);
            var rendered = template(data);
            $('.single-test-data').hide();
            $('#test-result').show();
            $('#test-result').html(rendered);
        });
    },

    //клик по задаче на сайдбаре
    SidebarHandler: function(e) {
        var element = e.target;
        var id = $(element).parent().attr('id');
        id = id.substring(2);

        console.log('result mode: ', this.resultMode);
        console.log('$(element).parent().hasClass(\'answer-given\'): ', $(element).parent().hasClass('answer-given'));

        //показ задания №id, если при просмотре результата - установка стилей
        if(this.resultMode) {
            if($(element).parent().hasClass('answer-given')) {
                $('#test-result').hide();
                $('#close-result-task').show();
                $('#field').addClass('result-field');
                this.showTask(id);
            }
        } else if(this.activeTaskID > 0) { //если тест запущен
            this.showTask(id);
        }
    },

    //клик на Предыдущий вопрос
    showPrevTask: function(event) {
        if(this.activeTaskID > 0) { //если тест запущен
            var element = event.currentTarget;
            if (!$(element).hasClass('disabled')) {
                var id = Number(this.activeTaskID);
                if (id > 1) this.showTask(id - 1);
            }
        }
    },

    //клик на следующий вопрос
    showNextTask: function(event) {
        if(this.activeTaskID > 0) { //если тест запущен
            var element = event.currentTarget;
            if (!$(element).hasClass('disabled')) {
                var id = Number(this.activeTaskID);
                if (id < this.model.tasksCount) this.showTask(id + 1);
            }
        }
    },

    //начать новый тест
    startNewTest: function() {
        console.log('new test start!');
        $('#tb-finish-test').removeClass('disabled');
        $('#left-side-bar').show();

        //сортирует ответы
        this.sortAnswers();

        //если это не первый запуск теста, обнулить данные и стили после показа результата
        if(this.model.answersGiven !== []) {
            this.model.answersGiven = [];
            this.setModeTestActive();
        }

        //показаывает задание 1
        this.showTask(1);

        //запускает таймер
        this.model.testTimerStart();
        this.testTimerShow();
    },

    testTimerShow: function() {
        var timeString = this.model.timer.timeObToString(this.model.timer.timeNow);
        $('#time-left').html(timeString);
    },

    //клик на ответ
    giveAnswer: function(e) {
        var element = e.target;
        if(!$(element).hasClass('disabled')) {
            var id = $(e.currentTarget).parents('.single-test-data').attr('id');
            id = Number(id.substring(2));
            var answer = $(e.currentTarget).attr('answer');
            var args = [id, answer, e];

            //выделяет ответ как выбранный
            $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
            $(e.currentTarget).addClass('answer-chosen');
            $('#qn' + id).addClass('answer-given');
            $('.test-tasks').removeClass('result-task');

            //отправляет данные в модель для записи
            this.model.recieveAnswer(args);

            //показывает след. вопрос, в случае если это был последний вопрос показывает результат теста
            if (id < this.model.tasksCount) {
                this.showTask(id + 1);
            } else if (id == this.model.tasksCount) {
                //$('#tb-finish-test').click();
                this.finishTest();
            }
            console.log('this.model.tasksCount: ', this.model.tasksCount);
        }
    },

    //показать задание
    showTask: function(id) {
        this.activeTaskID = id; //for active task id to be available for other functions

        $('#test-result').hide();
        $('.single-test-data').hide();
        $('#vn' + id).show();
        $('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#qn' + id).addClass('active-task');
        var maxID;
        maxID = $('.side-bar-table').find('tbody').children('tr').length;

        if(this.resultMode == false) {
            //отключает/включает кнопки навигции когда ответ последний или первый
            if (id == maxID) {
                $('#tb-next-task').addClass('disabled');
                $('.single-test-data').find('.tb-next-task div:last-child').addClass('disabled');
                $('.single-test-data').find('.tb-next-task div:last-child').removeClass('hoverable');
            } else {
                $('#tb-next-task').removeClass('disabled');
                $('.single-test-data').find('.tb-next-task div:last-child').removeClass('disabled');
                $('.single-test-data').find('.tb-next-task div:last-child').addClass('hoverable');
            }

            if (id == 1) {
                $('#tb-prev-task').addClass('disabled');
                $('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
                $('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');
            } else {
                $('#tb-prev-task').removeClass('disabled');
                $('.single-test-data').find('.tb-prev-task div:last-child').removeClass('disabled');
                $('.single-test-data').find('.tb-prev-task div:last-child').addClass('hoverable');
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
        $('#field').removeClass('result-field');
        $('#test-result').show();
        $('.single-test-data').hide();
        $('#close-result-task').hide();
        $('.mainLayout .in-task-description').hide();
    },

    //закрытие и показ описания
    closeDescription: function(e) {
        $(e.currentTarget).parent().hide();
    },
    showDescription: function() {
        $('.test-description').show();
    },

    //включение режиа стилей для просмотра результатов теста
    setModeTestResult: function() {
        this.resultMode = true;
        $('#tb-prev-task').addClass('disabled');
        $('#tb-next-task').addClass('disabled');
        $('#tb-finish-test').addClass('disabled');
        $('.single-test-data .answers .answer').removeClass('hoverable');
        $('.single-test-data .test-button div:last-child').removeClass('hoverable');
        $('.single-test-data .answers .answer').addClass('disabled');
        $('.single-test-data .test-button div:last-child').addClass('disabled');
        $('#left-side-bar .task-item').removeClass('active-task');
        $('.single-test-data .test-button').hide();
        $('#field .in-task-description').hide();

        $('#time-left').hide();
        $('.mainLayout .in-task-description').hide();
    },

    //включение режима стилей для прохождения теста
    setModeTestActive: function() {
        this.resultMode = false;
        $('.start-message').hide();
        $('#time-left').show();
        $('#tb-prev-task').removeClass('disabled');
        $('#tb-next-task').removeClass('disabled');
        $('#tb-finish-test').removeClass('disabled');
        $('.single-test-data .test-button').show();
        $('.single-test-data .answers .answer').addClass('hoverable');
        $('.single-test-data .answers .answer').removeClass('disabled');
        $('#field .in-task-description').show();

        //убирает окраску ответов
        $('.single-test-data ').find('.answer').removeClass('answer-chosen');
        $('.single-test-data').find('.answer').removeClass('answered-wrong');
        $('.single-test-data').find('.answer').removeClass('answered-right');
        $('#left-side-bar').find('.task-item').removeClass('answer-given');
        $('#left-side-bar ').find('.task-item').removeClass('answered-wrong');
        $('#left-side-bar ').find('.task-item').removeClass('answered-right');

        $('#close-result-task').hide();
        $('#field').removeClass('result-field');
    },

    //показывает результат теста
    showResult: function(data) {
        //ставит режим стилей и работы кнопок для показа результата теста
        this.setModeTestResult();

        //в основном поле окрашивает все данные ответы как неправильные (правильные будут перекрашены в след. цикле)
        $('.single-test-data').find('.answer-chosen').addClass('answered-wrong');

        console.log('finalData', data);
        console.log('this.model.correctAnswers', this.model.correctAnswers);

        console.log('data.allAnswered', data.allAnswered);
        console.log('data.wrongAnswers', data.wrongAnswers);
        //окрашивает отвены на задания с данными ответамиданные ответами
        for (var property in data.allAnswered) {
            var taskNumber = data.allAnswered[property];
            var allCorrectAnswers = this.model.correctAnswers;//массив правильных ответов на все вопрсы
            console.log('property', property);
            console.log('data.allAnswered property', data.allAnswered[property]);

            //ответы на сайдбаре
            if($.inArray(taskNumber, data.correctAnswers) > -1) {
                $('#qn' + taskNumber).addClass('answered-right');
            } else {
                $('#qn' + taskNumber).addClass('answered-wrong');
            }

            //правильные ответы в основном поле
            for (property in allCorrectAnswers[taskNumber]) {
                var AnswerPoints = allCorrectAnswers[taskNumber][property];
                if($.isNumeric(AnswerPoints) && AnswerPoints > 0) {
                    console.log('correctAnswers[' + taskNumber + '][property]: ', AnswerPoints);
                    console.log('property223: ', property.substring(0, 7));
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + property.substring(0, 7) + '"]').addClass('answered-right');
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

        //console.log('model 898989', config);
        if(config['answerOrder'] === 'dec') {
            //console.log('config[answerOrder] 898989', config['answerOrder']);
            for(var i = 1; i < tasksCount; i++) {
                var divs = $( '#vn' + i + ' .answers .answer').get().reverse();
                var answersHTML = domToString(divs);
                $( '#vn' + i + ' .answers').html(answersHTML);
            }
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