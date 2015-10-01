var testApp = testApp || {};
testApp.MainView = function(model) {
    this._model = model;
};

testApp.MainView.prototype = {
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
        var that = this;
        console.log('MainView init');

        /**
         * UI events block
         */

            //клик на ответ
        $.cache('.answers').find('.answer').click(function (e) {
            var element = e.currentTarget;
            if ($(element).hasClass('disabled')) return;

            var id = $(element).parents('.single-test-data').attr('id');
            id = Number(id.substring(2));
            var answer = $(element).attr('answer');

            var data = {id: id, answer: answer};
            //отправляет данные в модель для записи
            that.fireEvent('view:giveAnswer', data);
        });

        //клик на "Новый тест"
        $.cache('#tb-new-test').click(function () {
            that.fireEvent('view:clickStart');
        });

        //клик на "Закончить тест"
        $.cache('#tb-finish-test').click(function () {
            that.fireEvent('view:clickFinish');
        });

        //клик на "Предыдущий вопрос" в верхнем меню
        $.cache('#tb-prev-task').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickPrev');
        });

        //клик на "Предыдущий вопрос" в задаче
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickPrev');
        });

        //клик на "Следующий вопрос" в верхнем меню
        $.cache('#tb-next-task').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickNext');
        });

        //клик на "Следующий вопрос" в задаче
        $.cache('.single-test-data').find('.tb-next-task div:last-child').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickNext');
        });

        //клик на крестик для закрытия задания при показе результата теста
        $.cache('#close-result-task').click(function () {
            that.closeTask();
        });

        //клик на "Описание"
        $.cache('#showDescription').click(function () {
            $.cache('.test-description').toggle();
        });

        //клик на крестик для зарытия описания
        $.cache('.close-test-description').click(function (e) {
            $.cache('.test-description').hide();
        });


        //отключает прокрутку страницы при прокрутке центрального блока
        this.singleScrolling();
    },

    //начинает новый тест
    startNewTest: function () {
        console.log('main view start new test');
        $.cache('#tb-finish-test').removeClass('disabled');
        $.cache('#left-side-bar').show();

        //сортировка ответов
        if (this._model.config.answerOrder) {
            this.sortAnswers(this._model.config.answerOrder);
        }
    },

    //рендерит результат теста по шаблону
    renderResultScore: function (data) {
        var templateSource = $('#test-result-tmpl').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template(data);
        $.cache('.single-test-data').hide();
        $.cache('#test-result').show();
        $.cache('#test-result').html(rendered);
    },

    //включение стилей для прохождения теста
    setModeTestActive: function () {
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
    },

    //включение стилей для просмотра результатов теста
    setModeTestResult: function () {
        //отключает навигацию
        $.cache('#tb-prev-task').addClass('disabled');
        $.cache('#tb-next-task').addClass('disabled');
        if (this._model.config.navInResult != true) {
            $.cache('.single-test-data').find('.test-button').hide();
        }

        $.cache('#tb-finish-test').addClass('disabled');
        $.cache('.single-test-data').find('.answers .answer').removeClass('hoverable');
        $.cache('.single-test-data').find('.answers .answer').addClass('disabled');
        $.cache('#field').find('.in-task-description').hide();
        $.cache('.task-timer').addClass('in-result');
        $.cache('#time-left').hide();
    },

    //отображает таймер теста
    testTimerShow: function (timeNow) {
        //console.log('timeNow 1', timeNow);
        var timer = this._model.timer;
        var testTimerObj = timer.timeToObject(timeNow);
        var timeString = timer.timeObToString(testTimerObj);
        $('#time-left').html(timeString);
    },

    //отображает таймер отдельной задачи
    taskTimerShow: function (timeNow) {
        var id = this._model.selectedTaskID;
        if (!this._model.taskTimer[id]) return;

        var timer = this._model.taskTimer[id];
        //console.log('taskTimerShow', timer.timeNow);
        var taskTimerObj = timer.timeToObject(timer.timeNow);
        var taskTimerString = timer.timeObToString(taskTimerObj);
        //console.log('taskTimerShow id', id, $('#vn' + id + '.task-timer'));
        $('#vn' + id + ' .task-timer').html(taskTimerString);
    },

    //показать задание
    showTask: function (data) {
        var id = data['id'];
        var oldID = data['oldID'];
        //this._model.taskChange(id, oldID);//передаёт в модель новость о показе задачи
        this.taskTimerShow();
        console.log('mainVIew showTask id, oldID', id, oldID);
        $.cache('#test-result').hide();
        $.cache('.single-test-data').hide();
        $('#vn' + id).show();

        if (this._model.resultMode == true) {
            $.cache('#test-result').hide();
            $.cache('#close-result-task').show();
            $.cache('#field').addClass('result-field');
        }
    },

    //визуально отображает данные ответы
    reflectAnswers: function (data) {
        var id = data['id'];
        var answers = data['answers'];
        console.log('MainView reflectAnswers id, answer: ', id, answers);
        $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
        answers.forEach(function (item) {
            $('#vn' + id + ' .answers .answer[answer="' + item + '"]').addClass('answer-chosen');
        })

    },

    //показывает результат прохождения теста
    showResult: function (data) {
        //ставит режим стилей и работы кнопок для показа результата теста
        this.setModeTestResult();

        //окрашивает ответы на задания с данными ответамиданные ответами
        for (var property in data.allAnswered) {
            var taskNumber = data.allAnswered[property];
            var config = this._model.config;
            var allCorrectAnswers = this._model.correctAnswers;//массив правильных ответов на все вопрсы
            var answersGiven = this._model.answersGiven;
            console.log('property', property);
            console.log('data.allAnswered property', data.allAnswered[property]);
            console.log('task number', taskNumber);

            //обработка ответов в основном поле
            for (property in allCorrectAnswers[taskNumber]) {
                var answerPoints = allCorrectAnswers[taskNumber][property];
                var answerNum = property.substring(0, 7);

                //если ответ отмечен пользователем
                if ($.inArray(answerNum, answersGiven[taskNumber]) > -1) {
                    if (config.resultAnswersStyle == 'wrong-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').removeClass('answer-chosen');
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                        if (answerPoints <= 0) {
                            $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                        }
                    } else if (config.resultAnswersStyle == 'answered-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                    } else {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                    }
                }

                //все правильные ответы
                if (answerPoints > 0) {
                    if (config.resultAnswersStyle == 'right-wrong-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right-border');
                    } else {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right');
                    }
                } else if (config.resultAnswersStyle == 'right-wrong-borders') {
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                }
            }
        }

        this.renderResultScore(data);
    },

    //закрытие ответа при просмотре результатов теста
    closeTask: function () {
        $.cache('#field').removeClass('result-field');
        $.cache('#test-result').show();
        $.cache('.single-test-data').hide();
        $.cache('#close-result-task').hide();
        $.cache('.mainLayout').find('.in-task-description').hide();
    },

    //отключает кнопки "предыдущий вопрос"
    disablePrevButtons: function () {
        $.cache('#tb-prev-task').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');
    },

    //отключает кнопки "следующий вопрос"
    disableNextButtons: function () {
        $.cache('#tb-next-task').addClass('disabled');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').addClass('disabled');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').removeClass('hoverable');
    },

    //делает кнопки "предыдущий вопрос" активными
    enablePrevButtons: function () {
        $.cache('#tb-prev-task').removeClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('hoverable');
    },

    //делает кнопки "следующий вопрос" активными
    enableNextButtons: function () {
        $.cache('#tb-next-task').removeClass('disabled');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').removeClass('disabled');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').addClass('hoverable');
    },

    //показывает описание теста
    showDescription: function () {
        $.cache('.test-description').show();
    },

    //закрывает описание теста
    closeDescription: function () {
        $.cache('.test-description').hide();
    },

    //отключает и убирает кнопки "предыдущий вопрос"
    disableFreeTaskChange: function () {
        $.cache('#tb-prev-task').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');
        $.cache('.single-test-data').find('.tb-prev-task div:last-child').hide();
        $.cache('#tb-next-task').html('Пропустить вопрос');
        $.cache('.single-test-data').find('.tb-next-task div:last-child').html('Пропустить вопрос');
    },

    //сортировка вопросов
    sortAnswers: function (answerOrder) {
        var tasksCount = this._model.tasksCount;

        //сортировка dec - по убыванию
        if (answerOrder === 'dec') {
            //сортировка dec переворачивает список ответов, поэтому если сделать дважы снова будет дефолтный порядок
            if (this.sorted == true) return;
            for (var i = 1; i <= tasksCount; i++) {
                var divs = $('#vn' + i + ' .answers .answer').get().reverse();
                console.log('divs after reverse: ', divs);
                $('#vn' + i + ' .answers').append(divs);
            }
            this.sorted = true;

            //сортировка rand - случайный порядок
        } else if (answerOrder === 'rand') {
            for (i = 1; i <= tasksCount; i++) {
                divs = $('#vn' + i + ' .answers > div:last-child .answer').get();
                //console.log('divs: ', divs);
                divs = shuffle(divs);
                //console.log('divs after shuffle: ', divs[0]);
                $('#vn' + i + ' .answers > div:last-child').append(divs[0]);
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
    },

    //отключает прокрутку страницы при прокрутке центрального блока
    singleScrolling: function () {
        $.cache('#field').on('mouseenter', function () {
            if ($.cache('#field')[0].scrollHeight > $.cache('#field')[0].offsetHeight) {
                $.cache('html, body').on('mousewheel', function (e) {
                    e.preventDefault();
                });
                $.cache('#field').on('mousewheel', function (e) {
                    var step = 30;
                    var direction = e.originalEvent.deltaY > 0 ? 1 : -1;
                    $(this).scrollTop($(this).scrollTop() + step * direction);
                });
            }
        });
        $.cache('#field').on('mouseleave', function () {
            $.cache('html,body').off('mousewheel');
        });
    }

};