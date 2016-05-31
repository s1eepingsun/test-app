var testApp = testApp || {};
testApp.MainView = function(model) {
    this._model = model;
    this._config = this._model.config;
    this.renderedAnswers = [];
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
        var model = this._model;
        var config = this._config;
        //console.log('MainView init', model, model.config);

        if (window._isFb || window._isVk) {
            $('body').addClass('social-bg');
        }

        $('.answers').find('.answer').off();
        $('.answers').find('.answer').click(function (e) {
            console.log2('click on answer');
            var element = e.currentTarget;
            if ($(element).hasClass('disabled')) return;

            var id = $(element).parents('.single-test-data').attr('id');
            id = Number(id.substring(2));
            var answer = $(element).attr('answer');

            var data = {id: id, answer: answer};
            //отправляет данные в модель для записи
            that.fireEvent('view:giveAnswer', data);
        });

        $('.answers').find('.answer2').off();
        $('.answers').find('.answer2').click(function(e) {
            var element = e.currentTarget;
            if ($(element).hasClass('disabled')) return;

            var id = $(element).parents('.single-test-data').attr('id');
            id = Number(id.substring(2));
            var answer = $(element).attr('answer');
            var answerData = $(element).data('answer-collate');

            var data = {id: id};

            if(typeof answer !== 'undefined') data['answer'] = answer;
            if(typeof answerData !== 'undefined') {
                data['answer'] = answerData;
                data['collateType'] = true;
            }

            that.fireEvent('view:collateAnswerClick', data);
        });

        //клик на "OK" (ответить)
        $('#field .single-test-data .answers .input-button').off();
        $('#field .single-test-data .answers .input-button').click(function (e) {
            var element = e.currentTarget;
            if ($(element).hasClass('disabled')) return;

            var id = $(element).parents('.single-test-data').attr('id');
            id = Number(id.substring(2));

            //var answer = $(element).parent('.input-answer').find('input').val();
            //var answer = $(element).parents('.answers').find('input').val();
            var answers = {};
            $(element).parents('.answers').find('input').each(function(i, elem) {
                console.log2('elems', i, elem.value);
                var key = i + 1;
                if($(elem).attr('answer')) key = $(elem).attr('answer');
                answers[key] = elem.value;
            });

            var data = {id: id, answer: answers};
            that.fireEvent('view:giveAnswer', data);
        });

        //клик на "OK" (multiple answers confirm)
        $('#field .single-test-data .answers .multiple-confirm').off();
        $('#field .single-test-data .answers .multiple-confirm').click(function (e) {
            var element = e.currentTarget;
            var id = $(element).parents('.single-test-data').attr('id');
            id = Number(id.substring(2));

            that.fireEvent('view:confirmAnswer', id);
        });

        //клик на "Новый тест"
        $('#tb-new-test').off();
        $('#tb-new-test').click(function () {
            that.fireEvent('view:newTestBtnClick');
        });

        $('#field').find('.landing-test-start').off();
        $('#field').find('.landing-test-start').click(function () {
            testApp.loadNewTest2(config);
        });

        //клик на "Закончить тест"
        $('#tb-finish-test').off();
        $('#tb-finish-test').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickFinish');
        });

        //клик на "Предыдущий вопрос" в верхнем меню
        $('#tb-prev-task').off();
        $('#tb-prev-task').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickPrev');
        });

        //клик на "Предыдущий вопрос" в задаче
        $('.single-test-data').find('.tb-prev-task div:last-child').off();
        $('.single-test-data').find('.tb-prev-task div:last-child').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickPrev');
        });

        //клик на "Следующий вопрос" в верхнем меню
        $('#tb-next-task').off();
        $('#tb-next-task').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickNext');
        });

        //клик на "Следующий вопрос" в задаче
        $('.single-test-data').find('.tb-next-task div:last-child').off();
        $('.single-test-data').find('.tb-next-task div:last-child').click(function (e) {
            if ($(e.currentTarget).hasClass('disabled')) return;
            that.fireEvent('view:clickNext');
        });

        //клик на крестик для закрытия задания при показе результата теста
        $('#close-result-task').off();
        $('#close-result-task').click(function () {
            that.closeTask();
        });


        $('#not-all-answered .unanswered-finish').off();
        $('#not-all-answered .unanswered-finish').click(function() {
            that.fireEvent('view:clickFinishNoMatterWhat');
            $('#not-all-answered').hide();
        });

        $('#not-all-answered .unanswered-continue').off();
        $('#not-all-answered .unanswered-continue').click(function() {
            that.fireEvent('view:showUnanswered');
            $('#not-all-answered').hide();
        });

        $('#prompt-quit-test .quit-yes').off();
        $('#prompt-quit-test .quit-yes').click(function() {
            var event = $('#prompt-quit-test').data('event');
            that.fireEvent('view:clickQuitConfirm', event);
            $('#prompt-quit-test').hide();
        });

        $('#prompt-quit-test .quit-no').off();
        $('#prompt-quit-test .quit-no').click(function() {
            $('#prompt-quit-test').hide();
        });



        $('#immediate-answer-check input').off();
        $('#immediate-answer-check input').change(function() {
            config.immediateAnswers = $('#immediate-answer-check input:checked').length;
            console.log2('config.immediateAnswers', config.immediateAnswers);

            if(config.immediateAnswers == 1) {
                $('#field .single-test-data .multiple-confirm').show();
            } else {
                $('#field .single-test-data .multiple-confirm').hide();
            }
        });

        $('#temperament-tabs > div:first-child > div').off();
        $('#temperament-tabs > div:first-child > div').click(function() {
            var temperamentType = $(this).attr('class');
            $('#temperament-tabs > div:last-child > div').hide();
            $('#temperament-tabs > div:last-child > div.' + temperamentType).show();

            //$('#temperament-tabs > div:first-child > div > div').removeClass('active-tab');
            //$('#temperament-tabs > div:first-child > div.' + temperamentType + ' > div').addClass('active-tab');

            $('#temperament-tabs > div:first-child > div img').removeClass('active-img');
            $('#temperament-tabs > div:first-child > div.' + temperamentType + ' img').addClass('active-img');
        });

        /*$('#temperament-tabs > div:first-child > div').mouseenter(function() {
            var temperamentType = $(this).attr('class');
            //$('#temperament-tabs > div:first-child > div.' + temperamentType + ' img').addClass('hover-img');
            $('#temperament-tabs > div:first-child > div.' + temperamentType + ' > div').addClass('hover-tab');
        }).mouseleave(function() {
            var temperamentType = $(this).attr('class');
            //$('#temperament-tabs > div:first-child > div.' + temperamentType + ' img').removeClass('hover-img');
            $('#temperament-tabs > div:first-child > div.' + temperamentType + ' > div').removeClass('hover-tab');
        });*/

        $('#tbPreviousGame').off();
        $('#tbPreviousGame').click(function() {
            that.fireEvent('view:showPrevTest');
        });

        //клик на "Описание"
        $('#showDescription').off();
        $('#showDescription').click(function () {
            $('#description').toggle();
        });

        //клик на крестик для зарытия описания
        $('#closeDescription').off();
        $('#closeDescription').click(function () {
            $('#description').hide();
        });

        $('#bbParameters').off();
        $('#bbParameters').click(function(e) {
            $('#options-window').toggle();
        });

        $('#options-window .close-options-window').click(function() {
            $('#options-window').hide();
        });

        $('#options-window .cancel').click(function() {
            $('#options-window').hide();
        });

        $('#options-window .accept').click(function() {
            $("#options-window form").submit();
        });

        $("#options-window form").submit(function(e) {
            var formData = $(this).serializeArray();
            that.fireEvent('view:submitOptions', formData);
            e.preventDefault();
        });


        $('#tb-training').off();
        $('#tb-training').click(function() {
            that.fireEvent('view:trainingBtnClick');
        });


        //добавляет список тестов
        this.renderTestList(phpTestList);

        $('#bbTestList').off();
        $('#bbTestList').click(function() {
            $('#test-list-wrapper').toggle();
            $('#bottom-block').find('.bubblePanel.bottomSubPanel').hide();
        });

        $('#test-list .close-test-list').off();
        $('#test-list .close-test-list').click(function() {
            $('#test-list-wrapper').hide();
        });

        $('#test-list .clickable-td').off();
        $('#test-list .clickable-td').click(function(e) {
            var testLinkData = $(e.currentTarget).parent().attr('data-test-num');
            that.fireEvent('view:selectTestFromList', testLinkData);
        });

        $('#bbHistory, #bbRatings, #bbProfile').click(function() {
            $('#test-list-wrapper').hide();
        });

        $('.single-test-data').find('.task-switcher .prev-task-switcher').mouseenter(function() {
            $(this).parent().children('.left-arrow').addClass('highlighted');
        });
        $('.single-test-data').find('.task-switcher .prev-task-switcher').mouseleave(function() {
            $(this).parent().children('.left-arrow').removeClass('highlighted');
        });

        $('.single-test-data').find('.task-switcher .next-task-switcher').mouseenter(function() {
            $(this).parent().children('.right-arrow').addClass('highlighted');
        });
        $('.single-test-data').find('.task-switcher .next-task-switcher').mouseleave(function() {
            $(this).parent().children('.right-arrow').removeClass('highlighted');
        });

        $('.single-test-data').find('.task-switcher .prev-task-switcher').click(function(e) {
            if ($(e.currentTarget).parent().hasClass('prev-disabled')) return;
            that.fireEvent('view:clickPrev');
        });

        $('.single-test-data').find('.task-switcher .next-task-switcher').click(function(e) {
            if ($(e.currentTarget).parent().hasClass('next-disabled')) return;
            that.fireEvent('view:clickNext');
        });

        $('.soundtrack').find('audio').bind('play', function(e) {
            var element = e.currentTarget;
            var id = $(element).parents('.single-test-data').attr('id');
            id = Number(id.substring(2));

            that.fireEvent('view:musicPlayClick', id);
        });

        $('.soundtrack').find('audio').bind('pause', function(e) {
            var element = e.currentTarget;
            var id = $(element).parents('.single-test-data').attr('id');
            id = Number(id.substring(2));

            that.fireEvent('view:musicStopClick', id);
        });

        //добавляет описание теста
        //var description = model.data.description;
        //$('#description .description-container').html(description);

        //отключает прокрутку страницы при прокрутке элемента
        testHelpers.singleScrolling('#field');

        //if it's directory without tests php will show 0, so fix it with JS
        if($('#options-window .max-test-number').text() == 0) {
            $('#options-window .max-test-number').text(model.maxTestNumber);
        }

        if(window.sessionStorage.randomTests == 'true') {
            $('#options-window form input[value="random"]').prop('checked', true);
        } else {
            $('#options-window form input[value="linear"]').prop('checked', true);
        }

    },

    //рендерит задания в основном окне
    renderTaskMainView: function (data) {
        var that = this;
        for(var task in data['tasks']) {
            if(!data['tasks'].hasOwnProperty(task)) continue;

            if(data['tasks'][task]['multiple_answer_view'] ||
                data['tasks'][task]['multiple-thin_answer_view'] ||
                data['tasks'][task]['multiple-wide_answer_view'] ||
                data['tasks'][task]['input1_answer_view'] ||
                data['tasks'][task]['collate_answer_view'] ||
                data['tasks'][task]['right-side_answer_view'] ||
                data['tasks'][task]['sequence_answer_view'] ||
                data['tasks'][task]['sequence-abv_answer_view']) {
                //data['complex-answers-view'] = 1;
                data['tasks'][task]['complex-answers-view'] = 1;
                //break;
            }

            if(data['tasks'][task]['right-side_answer_view']) {
                data['tasks'][task]['answers_view'] = 'right-side';
            }
        }

        data['maxTestNumber'] = this._model.maxTestNumber;
        if(this._model.config.tips) data['tips'] = this._model.config.tips;
            var templateSource = $('#task-main-tmpl').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template(data);

        console.log('render data', data);

        //crutch
        $.when($('#field').html(rendered)).then(function() {
            that.readjustPrevNext();
        });
    },

    renderTaskListHorizonal: function(data) {
        var templateSource = $('#task-list-horizontal').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template(data);
        $('#bottom-task-list').html(rendered);
    },

    renderTestList: function(data) {
        if(data['multiple_test_types']) {
            delete data['multiple_test_types'];
        } else {
            data.forEach(function (item, i) {
                delete data[i]['testTitle'];
            });
        }

        var templateSource = $('#test-list-tmpl').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template({data: data});
        $('#test-list-wrapper').html(rendered);
    },

    //рендерит результат теста по шаблону
    renderResultScore: function (data) {
        var that = this;
        var templateSource = $('#test-result-tmpl').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template(data);
        $('.single-test-data').hide();
        $('#test-result').show();
        $('#test-result').html(rendered);

        if (this._config.showWrongs == true && this._model.wrongAnswersArr.length > 0) {
            $('#test-result').find('.show-wrongs-btn').show();
        }

        if(this._config.showWrongs == true) {
            this.showSuccessOrFail(data.correctAnswers, data.totalTasks);

            $('#test-result').find('.show-wrongs-btn').off();
            $('#test-result').find('.show-wrongs-btn').click(function() {
                that.fireEvent('view:clickShowWrongs');
            });
        }
    },

    showTemperamentResultScore: function(data) {
        var that = this;
        var templateSource = $('#test-result-tmpl').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template(data);
        $('.single-test-data').hide();
        $('#test-result').show();
        $('#test-result').html(rendered);

        var extraversion = data.extraversionScore;
        var neuroticism = data.neuroticismScore;
        var lies = data.liesScore;
        var temperTypeEng = data.temperTypeEng;

        if(extraversion > 19) {
            $('#test-result').find('.extraversion-5').show();
        } else if(extraversion > 15 && extraversion <= 19) {
            $('#test-result').find('.extraversion-4').show();
        } else if(extraversion > 8 && extraversion <= 15) {
            $('#test-result').find('.extraversion-3').show();
        } else if(extraversion > 4 && extraversion <= 8) {
            $('#test-result').find('.extraversion-2').show();
        } else if(extraversion <= 4) {
            $('#test-result').find('.extraversion-1').show();
        }

        if(neuroticism > 19) {
            $('#test-result').find('.neuroticism-4').show();
        } else if(neuroticism > 14 && neuroticism <= 19) {
            $('#test-result').find('.neuroticism-3').show();
        } else if(neuroticism > 6 && neuroticism <= 13) {
            $('#test-result').find('.neuroticism-2').show();
        } else if(neuroticism <= 6) {
            $('#test-result').find('.neuroticism-1').show();
        }

        if(lies > 3) {
            $('#test-result').find('.lies-3').show();
        } else if(lies > 0 && lies <= 3) {
            $('#test-result').find('.lies-2').show();
        } else if(lies == 0) {
            $('#test-result').find('.lies-1').show();
        }

        if(temperTypeEng === 'choleric') {
            $('#eysenck-circle-bg').addClass('rotate90');
            $('#choleric-traits').find('h2').addClass('actual-type');
        } else if(temperTypeEng === 'sanguine') {
            $('#eysenck-circle-bg').addClass('rotate180');
            $('#sanguine-traits').find('h2').addClass('actual-type');
        } else if(temperTypeEng === 'phlegmatic') {
            $('#eysenck-circle-bg').addClass('rotate270');
            $('#phlegmatic-traits').find('h2').addClass('actual-type');
        } else {
            $('#melancholic-traits').find('h2').addClass('actual-type');
        }

       /* var graphicExtraversion = 88 + extraversion * 18 - Math.floor(extraversion / 4);
        var graphicNeuroticism = 461 - neuroticism * 18 + (Math.floor(extraversion / 4) + 1) + Math.floor(extraversion / 12);
        $('#graphic-result > div:first-child').css({
            left: graphicExtraversion + 'px',
            top: graphicNeuroticism + 'px'
        })*/

        if (this._config.showAllAnswers == true) {
            $('#test-result').find('.show-all-answers').show();

            $('#test-result').find('.show-all-answers').off();
            $('#test-result').find('.show-all-answers').click(function() {
                that.fireEvent('view:clickShowAllAnswers');
            });
        }

    },

    //настраивает высоту кнопок "пред/сдед вопрос" при появлении полосы прокрутки
    readjustPrevNext: function() {
        var that = this;
        var fieldWrapperHeight = $('#field-inside-wrapper').css('height');
        fieldWrapperHeight = Number(fieldWrapperHeight.slice(0,-2));

        $('#field').find('.single-test-data').each(function() {
            var id = $(this).attr('id');
            var taskHeight = $('#' + id).css('height');
            taskHeight = Number(taskHeight.slice(0,-2));

            var diff = fieldWrapperHeight - taskHeight;
            if(diff < 0) {
                $('#' + id).addClass('long-task');
            }

            if($('#' + id).find('.answers').hasClass('multiple-wide')) {
                if(diff < 103) {
                    $('#' + id).css('height', (55 + taskHeight) + 'px');
                    $('#' + id).find('.answers .tb-prev-task, .answers .tb-next-task').css({
                        top: 'auto',
                        bottom: '10px'
                    })
                }
            } /*else if($('#' + id).find('.answers').hasClass('collate')) {
                if(diff < 103) {
                    var idNum = id.substring(2);
                    var answersArr = Object.keys(that._model.data.tasks[idNum]['answers']);
                    var mod = (answersArr.length - 3) * 8;
                    console.log2('readjust id, diff, mod', id, diff, mod);

                    $('#' + id).css('height', (0 + taskHeight + mod) + 'px');
                    $('#' + id).find('.answers .tb-prev-task, .answers .tb-next-task').addClass('position-readjusted');
                }
            }*/

        });
    },

    readjustPrevNext2: function(id, notAnsweredCorrectly) {
        var fieldWrapperHeight = $('#field-inside-wrapper').css('height');
        fieldWrapperHeight = Number(fieldWrapperHeight.slice(0,-2));
        var taskHeight = $('#vn' + id).css('height');
        taskHeight = Number(taskHeight.slice(0,-2));
        var diff = fieldWrapperHeight - taskHeight;
        var mod;

        //console.log2('readjust2 id, wrapperH, taskH, diff', id, fieldWrapperHeight, taskHeight, diff);

        if(diff < 103) {
            mod = 35 + notAnsweredCorrectly * 50;
            //console.log2('diff < 103, mod', diff, mod);
            $('#vn' + id).find('.answers .tb-prev-task, .answers .tb-next-task').addClass('static-button');
            //$('#vn' + id).css('height', (taskHeight + mod) + 'px');
            //$('#vn' + id).find('.answers .tb-prev-task, .answers .tb-next-task').addClass('position-readjusted');
        } /*else if(notAnsweredCorrectly > 2) {
            mod = 25 + (notAnsweredCorrectly - 2) * 50;
            //console.log2('diff >= 103, mod', diff, mod);
            $('#vn' + id).css('height', (taskHeight + mod) + 'px');
            $('#vn' + id).find('.answers .tb-prev-task, .answers .tb-next-task').addClass('position-readjusted');
        }*/
    },

    loadingAnimationOn: function() {
        $('#field').find('.loading-in-progress').show();
    },

    loadingAnimationOff: function() {
        $('#field').find('.loading-in-progress').hide();
    },

    showSuccessOrFail: function (correctAnswersArr, totalTasks) {
        var correctAnswers = correctAnswersArr.length;
        if(totalTasks - correctAnswers > 2) {
            $('#test-result').find('.test-fail').show();
        } else {
            $('#test-result').find('.test-success').show();
        }
    },

    //начинает новый тест
    startNewTest: function () {
        console.log2('main view start new test');
        var config = this._config;

        if(config.trainingMode == false) {
            if(config.horizontalTaskList == true) {
                $('#horizontal-task-list').show();
                if(config.testTypeDir === 'personality-questionary') {
                    var fieldHeight = $('#field').css('height');
                    fieldHeight = Number(fieldHeight.substring(0, 3)) - 25;
                    $('#field').css('height', fieldHeight + 'px');
                }

                if(config.allTasksAtOnce == true) {
                    $('#field').addClass('allTasksAtOnce');
                    $('#bottom-task-list').hide();
                }
            } else {
                $('#left-side-bar').show();
            }

            $('#tb-finish-test').removeClass('disabled');
            if(config.displayTestNumber != false) $('.test-number-div').show();

        } else {
            $('#left-side-bar').hide();
            $('#horizontal-task-list').hide();
            //$('#left-side-bar').show();
        }

        if(config.allTasksAtOnce == true) {
            $('#field').addClass('allTasksAtOnce');
        }

        if(config.disableTaskChange == true) {
            $('#field').find('.test-tasks .answers .test-button').hide();
        }


        var testNumber = testApp.testModel.currentTestNumber;
        $('.test-number-div span').text(testNumber);

        $('#field').find('.in-task-description').html(phpTestData.in_task_description);
        //$('#description').find('.description-container').html(phpTestData.description);
        $('#vn1').addClass('first-task-style');

        $('#test-list .test-list-table tr').removeClass('active-test');
        $('#test-num-' + testNumber).addClass('active-test');

        //сортировка ответов
        if (config.answerOrder) {
            this.sortAnswers(this._model.config.answerOrder);
        }

        if(config.immediateAnswers == true) {
            $('#answers-check').prop('checked', true);
            $('#field .single-test-data .multiple-confirm').show();
        } else if(config.immediateAnswers == false && this._config.trainingMode != true) {
            $('#answers-check').prop('checked', false);
            $('#field .single-test-data .multiple-confirm').hide();
        }

        //to trigger testHelpers.singleScrolling
        $('#field').trigger('mouseleave');
        $('#field').trigger('mouseenter');

        //$('.single-test-data').find('.explanation').show();
    },

    //включение стилей для прохождения теста
    setModeTestActive: function () {
        console.log2('setModeTestActive');
        //подключает навигацию
        $('#tb-prev-task').removeClass('disabled');
        $('#tb-next-task').removeClass('disabled');
        $('.single-test-data').find('.test-button').show();

        $('.single-test-data').find('.task-switcher').removeClass('prev-disabled');
        $('.single-test-data').find('.task-switcher').removeClass('next-disabled');
        $('.single-test-data').find('.task-switcher').show();

        if (this._config.testTimer == false) {
            $('#time-left').css('visibility', 'hidden');
            $('#time-spent').css('visibility', 'hidden');
            if(this._config.allTasksAtOnce == true) {
                $('#field .task-top-panel').css('height', '15px');
            }
        }

        $('#time-left').show();
        $('#time-spent').show();
        $('.start-message').hide();
        $('#tb-finish-test').removeClass('disabled');
        $('.single-test-data').find('.answers .answer, .answers .answer2').addClass('hoverable');
        $('.single-test-data').find('.answers .answer, .answers .answer2').removeClass('disabled');
        $('#field').find('.in-task-description').show();
        $('.task-timer').removeClass('in-result');
        $('#field').find('.test-number-div').removeClass('in-result-margin');
        if(this._config.immediateAnswersOption == true) $('#immediate-answer-check').show();
        $('#field-inside-wrapper').addClass('separator');
        $('#field-inside-wrapper').removeClass('training-mode');

        //убирает окраску ответов
        $('.single-test-data').find('.answer').removeClass('answer-chosen answered-wrong answered-right');
        $('.single-test-data').find('.answer2').removeClass('answer-chosen answered-wrong answered-right');
        $('.single-test-data').find('.answer').removeClass('answered-basic-border answered-right-border answered-wrong-border');
        $('.single-test-data').find('.answer2').removeClass('answered-basic-border answered-right-border answered-wrong-border');

        $('#close-result-task').hide();
        $('.single-test-data').find('.explanation').hide();
        $('#field').removeClass('result-field');
    },

    //включение стилей для просмотра результатов теста
    setModeTestResult: function () {
        //отключает навигацию
        $('#tb-prev-task').addClass('disabled');
        $('#tb-next-task').addClass('disabled');
        $('.single-test-data').find('.task-switcher').hide();
        if(this._config.navInResult != true) {
            $('.single-test-data').find('.test-button').hide();
        }



        $('.single-test-data').find('.blocking-layer').hide();
        $('.single-test-data').find('.soundtrack').find('span.tips-left').text('');

        $('#field').find('.test-number-div').addClass('in-result-margin');
        $('#tb-finish-test').addClass('disabled');
        $('.single-test-data').find('.answers .answer, .answers .answer2').removeClass('hoverable');
        $('.single-test-data').find('.answers .answer, .answers .answer2').addClass('disabled');
        if(this._config.immediateAnswersOption == true) {
            $('.single-test-data').find('.answers .answer').removeClass('answer-chosen');
            $('.single-test-data').find('.answers .answer2').removeClass('answer-chosen');
        }
        $('#field').find('.in-task-description').hide();
        $('.task-timer').addClass('in-result');
        $('#time-left').hide();
        $('#time-spent').hide();
        $('#vn1').find('.test-button').removeClass('first-task-button');
        if(this._config.immediateAnswersOption == true) $('#immediate-answer-check').hide();
        $('#field-inside-wrapper').removeClass('separator');
        //$('.single-test-data').find('.explanation').show();

        var fieldInsideWrapperHeight = $('#field-inside-wrapper').css('height');
        fieldInsideWrapperHeight = Number(fieldInsideWrapperHeight.substring(0, 3)) + 22;
        $('#field-inside-wrapper').css('height', fieldInsideWrapperHeight + 'px');

        $('#field-inside-wrapper').scrollTop(0);
    },

    setModeTraining: function() {
        $('.test-number-div').hide();
        $('.in-task-description').hide();
        $('#tb-finish-test').addClass('disabled');
        //$('#field').find('.task-top-panel').hide();
        //$('#field').find('.single-test-data .task-number').hide();
        if(this._config.immediateAnswersOption == true) $('#immediate-answer-check').hide();
        $('#field-inside-wrapper').removeClass('separator');
        $('#field-inside-wrapper').addClass('training-mode');
        $('#field .single-test-data .multiple-confirm').show();
        $('.single-test-data').find('.soundtrack').find('span.tips-left').text('');

        $('.task-top-panel').addClass('hidden');
        $('#field').find('.single-test-data .task-number').addClass('hidden');
    },

    //отображает таймер теста
    testTimerShow: function (timeNow) {
        //console.log2('timeNow 1', timeNow);
        var timer = this._model.timer;
        var testTimerObj = timer.timeToObject(timeNow);
        var timeString = timer.timeObToLongString(testTimerObj);
        $('#time-left span').html(timeString);
    },

    testTimeSpentShow: function (data) {
        var timer = this._model.timer;
        var timeSpent = data.timerData - data.timeNow;
        var timeSpentObj = timer.timeToObject(timeSpent);
        var timeSpentString = timer.timeObToLongString(timeSpentObj);
        $('#time-spent span').html(timeSpentString);
    },

    //отображает таймер отдельной задачи
    taskTimerShow: function (timeNow) {
        var id = this._model.selectedTaskID;
        if (!this._model.taskTimer[id]) return;

        var timer = this._model.taskTimer[id];
        //console.log2('taskTimerShow', timer.timeNow);
        var taskTimerObj = timer.timeToObject(timer.timeNow);
        var taskTimerString = timer.timeObToString(taskTimerObj);
        //console.log2('taskTimerShow id', id, $('#vn' + id + '.task-timer'));
        $('#vn' + id + ' .task-timer').html(taskTimerString);
    },

    showWrongs: function(wrongAnswersArr) {
        console.log2('showWrongs in view', wrongAnswersArr);
        $('#close-result-task').show();
        $('#field').addClass('result-field');
        $('#test-result').hide();
        $('.single-test-data').find('.test-button').hide();
        //$('.single-test-data').find('.explanation').addClass('no-img-margin-off');
        $('.single-test-data').addClass('scrolling-result');
        $('.test-tasks').addClass('scrolling-result');

        wrongAnswersArr.forEach(function(id) {
            $('#vn' + id).show();
        });

        var maxID = Array.max(wrongAnswersArr);
        $('#vn' + maxID).addClass('last-scrolling-task');
    },

    showAllAnswers: function() {
        $('#close-result-task').show();
        $('#field').addClass('result-field');
        $('#test-result').hide();
        $('.single-test-data').find('.test-button').hide();
        //$('.single-test-data').find('.explanation').addClass('no-img-margin-off');
        //$('.single-test-data').addClass('scrolling-result');
        $('.single-test-data').show();
    },

    //показать задание
    showTask: function (data) {
        var id = data['id'];
        var oldID = data['oldID'];
        var minID = data['minID'];
        var maxID = data['maxID'];
        var freeTaskChange = this._config.freeTaskChange;
        //this._model.taskChange(id, oldID);//передаёт в модель новость о показе задачи
        if(this._config.taskTimer == true) {
            this.taskTimerShow();
        }

        console.log2('mainVIew showTask id, oldID', id, oldID);
        $('#test-result').hide();

        if(this._config.allTasksAtOnce != true) {
            $('.single-test-data').hide();
            if (id != 1 && $('#game-field').find('.in-task-description').css('display') != 'none') {
                $('#game-field').find('.in-task-description').hide();
                $('#field').find('.test-number-div').removeClass('first-task-margin');
            } else if (id == 1 && this._model.resultMode != true && this._config.trainingMode != true) {
                $('#game-field').find('.in-task-description').show();
                $('#vn1').find('.test-button').addClass('first-task-button');
                $('#field').find('.test-number-div').addClass('first-task-margin');
            }
            $('#vn' + id).show();

            if (this._model.resultMode == true) {
                $('#close-result-task').show();
                $('#field').addClass('result-field');

                if (this._config.showWrongs == true) {
                    //$('.single-test-data').find('.explanation').removeClass('no-img-margin-off');
                    $('.single-test-data').removeClass('scrolling-result');
                    $('.test-tasks').removeClass('scrolling-result');
                }
            }

            //отключает/включает кнопки навигции когда ответ последний или первый
            if (this._model.resultMode != true) {
                maxID = this._model.tasksCount;
                id == minID || freeTaskChange != true ? this.disablePrevButtons() : this.enablePrevButtons();
                if (this._config.trainingMode != true) {
                    id == maxID ? this.disableNextButtons() : this.enableNextButtons();
                } else {
                    if (id != maxID) this.enableNextButtons();
                }
            } else if (this._config.navInResult == true) {
                id == maxID ? this.disableNextButtons() : this.enableNextButtons();
                id == minID ? this.disablePrevButtons() : this.enablePrevButtons();
            }
        }

        this.hidePromptUnanswered();
    },

    readjustTestNumber: function(id) {
        $('.test-number-div').css('margin-top', 0);
        var tasksHeight = $('.test-tasks').height();
        var standard = 552; //it's #field 's height
        if(id == 1) {
            variableHeight = $('#vn' + id).height() + 100;//109
        } else {
            variableHeight = $('#vn' + id).height() + 62;//71
        }

        var margin = 0;
        console.log2('margin1, variableHeight, tasksHeight', margin, variableHeight, tasksHeight);
        if(tasksHeight < standard) {
            margin = standard;
        } else {
            margin = tasksHeight;
        }
        console.log2('margin2', margin);
        margin = margin - variableHeight;
        console.log2('margin3,  var, id ===========', margin, variableHeight, id);

        $('.test-number-div').css('margin-top', margin + 'px');
    },

    promptUnanswered: function() {
        $('#not-all-answered').show();
    },

    promptQuitTest: function(event) {
        $('#prompt-quit-test').data('event', event);
        $('#prompt-quit-test').show();
    },

    optionsFormDataAccepted: function() {
        $('.options-response').find('div').text('');
        $('#options-window').hide();
    },

    optionsFormDataNotValid: function(message) {
        $('.options-response').find('div').text(message);
    },

    makePlayerUnblockable: function(id) {
        $('#vn' + id).find('.soundtrack').addClass('unblockable-player');
    },

    blockAudioPlayers: function() {
        $('.single-test-data').find('.soundtrack').not('.unblockable-player').find('.blocking-layer').show();
    },

    adjustTipsNum: function(tipsLeft) {
        if(this._model.resultMode != true) {
            $('.single-test-data').find('.soundtrack').find('span.tips-left').text('(' + tipsLeft + ')');
        }
    },

    stopPlayer: function(currentlyPlaying) {
        currentlyPlaying.forEach(function(item, id) {
            $('#vn' + id).find('.soundtrack audio')[0].pause();
        });
    },

    //визуально отображает данные ответы
    reflectAnswers: function (data) {
        var that = this;
        var id = data['id'];
        var answers = data['answers'];
        //console.log2('MainView reflectAnswers() id, answer: ', id, answers);

        $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
        if(data['answers']) {
            answers.forEach(function (item) {
                $('#vn' + id + ' .answers .answer[answer="' + item + '"]').addClass('answer-chosen');
            })
        }

        if(this._model.data.tasks[id]['collate_answer_view']) {
            $('#vn' + id + ' .answers .answer2').removeClass('answer-chosen');

            //var connectionType = 'chosen';
            this.connectCollateAnswers(id, answers);

            /*answers.forEach(function(item, i) {
                var prevCollateTag, nextCollateTag;
                var answerTag = $('#vn' + id + ' .answers .answer2[answer="' + item + '"]');
                var answerIndex = answerTag.index();
                var collateTag = $('#vn' + id + ' .answers .answer2[data-answer-collate="' + (i + 1) + '"]');
                var collateIndex = collateTag.index();
                var collateTypeLength = $('#vn' + id + ' .answers .collate-type > div').length;
                var notCollateTypeLength = $('#vn' + id + ' .answers .not-collate-type > div').length;

                if(answerIndex > collateIndex) {
                    answerTag.detach();
                    $('#vn' + id + ' .answers .not-collate-type .answer2:eq(' + collateIndex + ')').before(answerTag);

                    nextCollateTag = $('#vn' + id + ' .answers .not-collate-type .answer2:eq(' + (collateIndex + 1) + ')');
                    nextCollateTag.detach();
                    $('#vn' + id + ' .answers .not-collate-type').append(nextCollateTag);
                } else if(answerIndex < collateIndex && answerIndex > -1) {
                    answerTag.detach();

                    if(collateTypeLength < notCollateTypeLength) {
                        if(collateIndex - answerIndex > 1) {
                            $('#vn' + id + ' .answers .not-collate-type .answer2:eq(' + collateIndex + ')').before(answerTag);

                            prevCollateTag = $('#vn' + id + ' .answers .not-collate-type .answer2:eq(' + (collateIndex - 1) + ')');
                            prevCollateTag.detach();
                            $('#vn' + id + ' .answers .not-collate-type').prepend(prevCollateTag);
                        } else {
                            $('#vn' + id + ' .answers .not-collate-type .answer2:eq(' + collateIndex + ')').before(answerTag);
                        }
                    } else if(collateTypeLength >= notCollateTypeLength) {
                        if(collateIndex - answerIndex > 1) {
                            $('#vn' + id + ' .answers .not-collate-type').append(answerTag);

                            prevCollateTag = $('#vn' + id + ' .answers .not-collate-type .answer2:eq(' + (collateIndex - 1) + ')');
                            prevCollateTag.detach();
                            $('#vn' + id + ' .answers .not-collate-type').prepend(prevCollateTag);
                        } else {
                            $('#vn' + id + ' .answers .not-collate-type').append(answerTag);
                        }
                    }
                }

                answerTag.addClass('answer-chosen');

                if(item != undefined) {
                    collateTag.addClass('answer-chosen');
                    collateTag.find('.answer-connector').show();
                } else {
                    collateTag.find('.answer-connector').hide();
                }
            });*/
        }
    },

    connectCollateAnswers: function(id, answers, correctAnswers, incorrectAnswers) {
        //console.log2('connectCollateAnswers id, answers, type', id, answers, correctAnswers, incorrectAnswers);

        var answerTag, answerIndex, collateTag, collateIndex, color, leftAnswer, rightAnswer;
        var answerHeight = 34;
        var answerMedian = answerHeight / 2 - 2;

        /*switch(connectionType) {
            case 'correct':
                color = '#0f0';
                break;
            case 'incorrect':
                color = '#f00';
                break;
            default:
                color = '#222';
        }*/

        color = '#222';
        var canvasJQuery = $('#vn' + id).find('.answers-wrapper').children('.collate-answers-canvas');
        var canvas = canvasJQuery[0];
        var totalAnswersCount = Object.keys(this._model.data.tasks[id]['answers']).length;
        var canvasHeight = answerHeight * totalAnswersCount - answerMedian;
        canvasJQuery.attr('height', canvasHeight);
        var context = canvas.getContext('2d');
        context.translate(0.5, 0.5);
        //context.clearRect(0, 0, 74, canvasHeight);

        if(answers) {
            answers.forEach(function(item, i) {
                if(item) {
                    answerTag = $('#vn' + id + ' .answers .answer2[answer="' + item + '"]');
                    answerIndex = answerTag.index();
                    collateTag = $('#vn' + id + ' .answers .answer2[data-answer-collate="' + (i + 1) + '"]');
                    collateIndex = collateTag.index();
                    collateTag.addClass('answer-chosen');
                    answerTag.addClass('answer-chosen');

                    context.strokeStyle = color;
                    leftAnswer = answerHeight * collateIndex + answerMedian;
                    rightAnswer = answerHeight * answerIndex + answerMedian;
                    context.beginPath();
                    context.moveTo(0, leftAnswer);
                    context.lineTo(75, rightAnswer);
                    context.stroke();
                }
            });
        }

        if(correctAnswers) {
            color = '#2E8B57';
            context.lineWidth = 1.5;
            correctAnswers.forEach(function(item, i) {
                if(item) {
                    if($.isNumeric(item)) item = 'answer' + item;
                    answerTag = $('#vn' + id + ' .answers .answer2[answer="' + item + '"]');
                    answerIndex = answerTag.index();
                    collateTag = $('#vn' + id + ' .answers .answer2[data-answer-collate="' + (i + 1) + '"]');
                    collateIndex = collateTag.index();
                    collateTag.addClass('answer-chosen');
                    answerTag.addClass('answer-chosen');

                    context.strokeStyle = color;
                    leftAnswer = answerHeight * collateIndex + answerMedian;
                    rightAnswer = answerHeight * answerIndex + answerMedian;
                    context.beginPath();
                    context.moveTo(0, leftAnswer);
                    context.lineTo(75, rightAnswer);
                    context.stroke();
                }
            });
        }

        if(incorrectAnswers) {
            color = '#F08080';
            context.lineWidth = 1;
            incorrectAnswers.forEach(function(item, i) {
                if(item) {
                    answerTag = $('#vn' + id + ' .answers .answer2[answer="' + item + '"]');
                    answerIndex = answerTag.index();
                    collateTag = $('#vn' + id + ' .answers .answer2[data-answer-collate="' + (i + 1) + '"]');
                    collateIndex = collateTag.index();
                    collateTag.addClass('answer-chosen');
                    answerTag.addClass('answer-chosen');

                    context.strokeStyle = color;
                    leftAnswer = answerHeight * collateIndex + answerMedian;
                    rightAnswer = answerHeight * answerIndex + answerMedian;
                    context.beginPath();
                    context.moveTo(0, leftAnswer);
                    context.lineTo(75, rightAnswer);
                    context.stroke();
                }
            });
        }
    },

    //показывает результат прохождения теста
    showResult: function (data) {
        //ставит режим стилей и работы кнопок для показа результата теста
        this.setModeTestResult();

        if(data.testType === 'temperament') {
            this.showTemperamentResultScore(data);
        } else {
            this.showGivenAnswers(data);
            this.renderResultScore(data);
        }
    },

    showGivenAnswers: function(data) {
        var allTasks = this._model.data.tasks;
        var allCorrectAnswers = this._model.correctAnswers;
        //console.log2('showGivenAnswers() data', data);

        //окрашивает ответы на задания с данными ответами
        for (var property in data.allAnswered) {
            if(!data.allAnswered.hasOwnProperty(property)) continue;

            var taskNumber = data.allAnswered[property];
            if(this.renderedAnswers.indexOf(taskNumber) > -1) continue;

            if(this._config.trainingMode == true && typeof data.answersGiven !== 'undefined') {
                var answersGiven = data.answersGiven;
            } else {
                answersGiven = this._model.answersGiven;
            }

            this.blockAnswers(taskNumber);

            //console.log2('property, allCorrectAnswers, answersGiven', property, allCorrectAnswers, answersGiven);
            //console.log2('data', data);
            //console.log2('task number', taskNumber);

            if(allTasks[taskNumber]['answers_view'] === 'sequence' ||
               allTasks[taskNumber]['answers_view'] === 'sequence-abv') {
                for(var prop in data.wrongAnswersObj[taskNumber]) {
                    if(!data.wrongAnswersObj[taskNumber].hasOwnProperty(prop)) continue;

                    var i = data.wrongAnswersObj[taskNumber][prop] - 1;
                    var answerNum = 'answer' + data.wrongAnswersObj[taskNumber][prop];
                    $('#vn' + taskNumber + ' .sequence_answer_view > div:eq(' + i + ') input').addClass('answered-wrong2');
                    var correctedAnswer = allTasks[taskNumber]['answers'][answerNum];
                    $('#vn' + taskNumber + ' .sequence_answer_view > div:eq(' + i + ')').append('<div>' + correctedAnswer +'</div>');
                }

                for(prop in data.rightAnswersObj[taskNumber]) {
                    if(!data.rightAnswersObj[taskNumber].hasOwnProperty(prop)) continue;

                    i = data.rightAnswersObj[taskNumber][prop] - 1;
                    $('#vn' + taskNumber + ' .sequence_answer_view > div:eq(' + i + ') input').addClass('answered-right2');
                }

                //no input fields
                for(prop in allTasks[taskNumber]['answers']) {
                    if(!allTasks[taskNumber]['answers'].hasOwnProperty(prop)) continue;

                    var answer = allTasks[taskNumber]['answers'][prop];
                    answerNum = prop.substring(6);

                    if($.inArray(answerNum, data.rightAnswersObj[taskNumber]) == -1 && $.inArray(answerNum, data.wrongAnswersObj[taskNumber]) == -1) {
                        i = Number(answerNum) - 1;
                        $('#vn' + taskNumber + ' .sequence_answer_view > div:eq(' + i + ')').append('<div>' + answer +'</div>');
                    }
                }
            }

            /*if(allTasks[taskNumber]['answers_view'] === 'collate') {
                var elem, index, showCorrectAnswers = 0;

                for(prop in data.wrongAnswersObj[taskNumber]) {
                    if (!data.wrongAnswersObj[taskNumber].hasOwnProperty(prop)) continue;
                    answerNum = data.wrongAnswersObj[taskNumber][prop];
                    elem = $('#vn' + taskNumber + ' .answers .answer2[answer="' + answerNum + '"]');
                    index = elem.index();

                    elem.addClass('answered-wrong');
                    $('#vn' + taskNumber).find('.left-answers .answer2:eq(' + index + ')').addClass('answered-wrong');
                }

                for(prop in data.rightAnswersObj[taskNumber]) {
                    if (!data.rightAnswersObj[taskNumber].hasOwnProperty(prop)) continue;
                    answerNum = data.rightAnswersObj[taskNumber][prop];
                    elem = $('#vn' + taskNumber + ' .answers .answer2[answer="' + answerNum + '"]');
                    index = elem.index();

                    elem.addClass('answered-right');
                    $('#vn' + taskNumber).find('.left-answers .answer2:eq(' + index + ')').addClass('answered-right');
                }

                function renderCorrectAnswers(taskNumber, answerNum, index) {
                    var leftAnswerCopy = $('#vn' + taskNumber).find('.answer2[data-answer-collate="' + (index + 1) + '"]').clone();
                    var rightAnswerCopy = $('#vn' + taskNumber).find('.answer2[answer="answer' + answerNum + '"]').clone();
                    $('#vn' + taskNumber).find('.correct-answers .left-answers').append(leftAnswerCopy);
                    $('#vn' + taskNumber).find('.correct-answers .right-answers').append(rightAnswerCopy);
                    showCorrectAnswers = 1;
                }

                notAnsweredCorrectly = 0;
                allTasks[taskNumber]['collateTo'].forEach(function(answerNum, index) {
                    if(answerNum > 0 && data['rightAnswersObj'][taskNumber] === undefined) {
                        renderCorrectAnswers(taskNumber, answerNum, index);
                        notAnsweredCorrectly++;
                    } else if(answerNum > 0 && data['rightAnswersObj'][taskNumber].length > 0 && data['rightAnswersObj'][taskNumber].indexOf('answer' + answerNum) == -1) {
                        renderCorrectAnswers(taskNumber, answerNum, index);
                        notAnsweredCorrectly++;
                    }
                });

                this.collateHighlightOff({id: taskNumber});

                if(showCorrectAnswers == 1) $('#vn' + taskNumber).find('.correct-answers').show();
                this.readjustPrevNext2(taskNumber, notAnsweredCorrectly);
            }*/

            if(allTasks[taskNumber]['answers_view'] === 'collate') {
                var chosenAnswers, correctAnswers, incorrectAnswers;
                correctAnswers = this._model.data.tasks[taskNumber]['collateTo'];

                //console.log2('answersGiven, data.wrongAnswersObj[taskNumber]', answersGiven, data.wrongAnswersObj[taskNumber]);
                incorrectAnswers = [];
                answersGiven[taskNumber].forEach(function(item, i) {
                    if(data.wrongAnswersObj[taskNumber] && data.wrongAnswersObj[taskNumber].indexOf(item) > -1) {
                        incorrectAnswers[i] = item;

                        $('#vn' + taskNumber + ' .answers .answer2[data-answer-collate="' + (i + 1) + '"]').addClass('answered-wrong');
                    }

                    if(data.rightAnswersObj[taskNumber] && data.rightAnswersObj[taskNumber].indexOf(item) > -1) {
                        $('#vn' + taskNumber + ' .answers .answer2[data-answer-collate="' + (i + 1) + '"]').addClass('answered-right');
                    }
                });

                this.connectCollateAnswers(taskNumber, chosenAnswers, correctAnswers, incorrectAnswers);
            }


            //parsing 'input1' view
            if(Object.keys(allTasks[taskNumber].answers).length == 1 || allTasks[taskNumber]['answers_view'] === 'input1') {

                var rightAnswerText = '';
                if(allTasks[taskNumber]['points_counting_method'] = 'input-possibilities') {
                    var answerCounter = 1;
                    for(var answerKey in allTasks[taskNumber]['answers']) {
                        if(!allTasks[taskNumber]['answers'].hasOwnProperty(answerKey)) continue;

                        if(answerCounter == 1) {
                            rightAnswerText += '"' + allTasks[taskNumber]['answers'][answerKey] + '"';
                            answerCounter++;
                        } else {
                            rightAnswerText += ' или <br>"' + allTasks[taskNumber]['answers'][answerKey] + '"';
                        }
                    }
                } else {
                    rightAnswerText = allTasks[taskNumber]['answers']['answer1'];
                }

                if(!data['correctAnswers']) data['correctAnswers'] = data['correctAnswersArr'];

                if(data['correctAnswers'].indexOf(taskNumber) > -1) {
                    $('#vn' + taskNumber + ' .answers .input-answer > div:first-child').addClass('input-answered-right');
                } else {
                    $('#vn' + taskNumber + ' .answers .input-answer > div:first-child').addClass('input-answered-wrong');
                    $('#vn' + taskNumber + ' .correct-answer div:last-child').html(rightAnswerText);
                    $('#vn' + taskNumber + ' .answers .input-answer .correct-answer').show();
                }

                /*if(answersGiven[taskNumber][0][1] === allTasks[taskNumber].answers['answer1']) {
                    $('#vn' + taskNumber + ' .answers .input-answer > div:first-child').addClass('input-answered-right');
                } else {
                    $('#vn' + taskNumber + ' .answers .input-answer > div:first-child').addClass('input-answered-wrong');
                    $('#vn' + taskNumber + ' .correct-answer div:last-child').text(rightAnswerText);
                    $('#vn' + taskNumber + ' .answers .input-answer .correct-answer').show();
                }*/
            }

            for (prop in allCorrectAnswers[taskNumber]) {
                if(!allCorrectAnswers[taskNumber].hasOwnProperty(prop)) continue;

                var answerPoints = allCorrectAnswers[taskNumber][prop];
                answerNum = prop.substring(0, 7);
                //console.log2('answerNum, answerPoints', answerNum, answerPoints);


                //если ответ отмечен пользователем
                if ($.inArray(answerNum, answersGiven[taskNumber]) > -1) {
                    if (this._config.resultAnswersStyle == 'wrong-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').removeClass('answer-chosen');
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                        if (answerPoints <= 0) {
                            $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                        }
                    } else if (this._config.resultAnswersStyle == 'answered-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                        if (answerPoints <= 0) {
                            $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                        }
                    } else {
                        if (answerPoints <= 0) {
                            $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                        }
                    }

                    $('#vn' + taskNumber).find('.explanation').show();

                    //var height = $('#vn' + taskNumber).find('.answers').css('height');
                    //height = Number(height.substr(0, 3));
                    //if(height > 300) $('#vn' + taskNumber).find('.explanation').removeClass('no-img-margin');
                }

                //все правильные ответы
                if (answerPoints > 0) {
                    if (this._config.resultAnswersStyle == 'right-wrong-borders') {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right-border');
                    } else {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right');
                    }
                } else if (this._config.resultAnswersStyle == 'right-wrong-borders') {
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                }
            }

            this.renderedAnswers.push(taskNumber);
        }

    },

    showTrainingEnd: function() {
        $('#field').find('.test-tasks').hide();
        $('#field').find('.training-end').show();
    },

    showTrainingAnswer: function(data) {
        var allTasks = this._model.data.tasks;
        var allCorrectAnswers = this._model.correctAnswers;
        var taskID = data['id'];
        this.blockAnswers(taskID);

        var taskNumber = data.allAnswered[property];

        if(this._config.trainingMode == true) {
            var answersGiven = data.answersGiven;
        } else {
            answersGiven = this._model.answersGiven;
        }

        console.log2('property, allCorrectAnswers, answersGiven', property, allCorrectAnswers, answersGiven);
        console.log2('data.allAnswered property', data.allAnswered[property]);
        console.log2('task number', taskNumber);

        //if(this._model.data['complex-answers-view']) {
        if(allTasks[taskNumber]['answers_view'] === 'sequence'
            || allTasks[taskNumber]['answers_view'] === 'sequence-abv') {
            for(var prop in data.wrongAnswersObj[taskNumber]) {
                if(!data.wrongAnswersObj[taskNumber].hasOwnProperty(prop)) continue;
                var i = data.wrongAnswersObj[taskNumber][prop] - 1;
                var answerNum = 'answer' + data.wrongAnswersObj[taskNumber][prop];
                $('#vn' + taskNumber + ' .sequence_answer_view > div:eq(' + i + ') input').addClass('answered-wrong2');
                var correctedAnswer = allTasks[taskNumber]['answers'][answerNum];
                $('#vn' + taskNumber + ' .sequence_answer_view > div:eq(' + i + ')').append('<div>' + correctedAnswer +'</div>');
            }

            for(prop in data.rightAnswersObj[taskNumber]) {
                if(!data.rightAnswersObj[taskNumber].hasOwnProperty(prop)) continue;
                i = data.rightAnswersObj[taskNumber][prop] - 1;
                $('#vn' + taskNumber + ' .sequence_answer_view > div:eq(' + i + ') input').addClass('answered-right2');
            }

            //no input fields
            for(prop in allTasks[taskNumber]['answers']) {
                if(!allTasks[taskNumber]['answers'].hasOwnProperty(prop)) continue;
                var answer = allTasks[taskNumber]['answers'][prop];
                answerNum = prop.substring(6);

                if($.inArray(answerNum, data.rightAnswersObj[taskNumber]) == -1 && $.inArray(answerNum, data.wrongAnswersObj[taskNumber]) == -1) {
                    i = Number(answerNum) - 1;
                    $('#vn' + taskNumber + ' .sequence_answer_view > div:eq(' + i + ')').append('<div>' + answer +'</div>');
                }
            }
        }
        //}

        //parsing 'input1' view
        if(Object.keys(allTasks[taskNumber].answers).length == 1) {

            if(answersGiven[taskNumber][0][1] === allTasks[taskNumber].answers['answer1']) {
                $('#vn' + taskNumber + ' .answers .input-answer > div:first-child').addClass('input-answered-right');
            } else {
                $('#vn' + taskNumber + ' .answers .input-answer > div:first-child').addClass('input-answered-wrong');
                $('#vn' + taskNumber + ' .correct-answer div:last-child').text(allTasks[taskNumber].answers['answer1']);
                $('#vn' + taskNumber + ' .answers .input-answer .correct-answer').show();
            }
        }

        for (prop in allCorrectAnswers[taskNumber]) {
            if(!allCorrectAnswers[taskNumber].hasOwnProperty(prop)) continue;

            var answerPoints = allCorrectAnswers[taskNumber][prop];
            answerNum = prop.substring(0, 7);

            //если ответ отмечен пользователем
            if ($.inArray(answerNum, answersGiven[taskNumber]) > -1) {
                if (this._config.resultAnswersStyle == 'wrong-borders') {
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').removeClass('answer-chosen');
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                    if (answerPoints <= 0) {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
                    }
                } else if (this._config.resultAnswersStyle == 'answered-borders') {
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-basic-border');
                    if (answerPoints <= 0) {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                    }
                } else {
                    if (answerPoints <= 0) {
                        $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong');
                    }
                }

                $('#vn' + taskNumber).find('.explanation').show();

                //var height = $('#vn' + taskNumber).find('.answers').css('height');
                //height = Number(height.substr(0, 3));
                //if(height > 300) $('#vn' + taskNumber).find('.explanation').removeClass('no-img-margin');
            }

            //все правильные ответы
            if (answerPoints > 0) {
                if (this._config.resultAnswersStyle == 'right-wrong-borders') {
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right-border');
                } else {
                    $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-right');
                }
            } else if (this._config.resultAnswersStyle == 'right-wrong-borders') {
                $('#vn' + taskNumber + ' .answers .answer[answer="' + answerNum + '"]').addClass('answered-wrong-border');
            }
        }

        /*if(data['rightAnswers']) {
            $('#vn' + taskID + ' .answers .answer[answer="' + data['answer'] + '"]').addClass('answered-wrong');

            data['rightAnswers'].forEach(function(answer) {
                $('#vn' + taskID + ' .answers .answer[answer="' + answer + '"]').addClass('answered-right');
            });
        } else if(data['rightAnswer']) {
            if(data['answer'][0] === data['rightAnswer']) {
                $('#vn' + taskID + ' .answers .input-answer > div:first-child').addClass('input-answered-right');
            } else {
                $('#vn' + taskID + ' .answers .input-answer > div:first-child').addClass('input-answered-wrong');
                $('#vn' + taskID + ' .correct-answer div:last-child').text(this._model.data.tasks[taskID].answers['answer1']);
                $('#vn' + taskID + ' .answers .input-answer .correct-answer').show();
            }
        }

        $('#vn' + taskID + ' .explanation').show();*/
    },

    //блокирует возможность давать ответы в задании
    blockAnswers: function(taskID) {
        $('#vn' + taskID).find('.answers .answer, .answers .answer2').removeClass('hoverable');
        $('#vn' + taskID).find('.answers .answer, .answers .answer2').addClass('disabled');

        $('#vn' + taskID).find('.answers input').attr('disabled', 'disabled');
        $('#vn' + taskID).find('.answers input').addClass('disabled');
        $('#vn' + taskID).find('.answers .input-button').hide();
        $('#vn' + taskID).find('.answers .multiple-confirm').hide();
    },

    //закрытие ответа при просмотре результатов теста
    closeTask: function () {
        $('#field').removeClass('result-field');
        $('#test-result').show();
        $('.single-test-data').hide();
        $('#close-result-task').hide();
        $('.mainLayout').find('.in-task-description').hide();
    },

    collateHighlightPending: function(data) {
        if(data.collateType == true) {
            $('#vn' + data['id']).find('.answer2[data-answer-collate="' + data['answer'] + '"]').addClass('collate-pending3');
        } else {
            $('#vn' + data['id']).find('.answer2[answer="' + data['answer'] + '"]').addClass('collate-pending3');
        }
    },

    collateHighlightChoices: function(data) {
        var selectorClass;
        if(data.collateType == true) {
            selectorClass = '.not-collate-type';
        } else {
            selectorClass = '.collate-type';
        }

        $('#vn' + data['id']).find(selectorClass).children('.answer2').addClass('collate-pending2');
        setTimeout(function(){
            $('#vn' + data['id']).find(selectorClass).children('.answer2').removeClass('collate-pending2');
        }, 400);
        this.collateHighlightInterval = setInterval(function() {
            $('#vn' + data['id']).find(selectorClass).children('.answer2').addClass('collate-pending2');
            setTimeout(function(){
                $('#vn' + data['id']).find(selectorClass).children('.answer2').removeClass('collate-pending2');
            }, 400);
        }, 800);
    },

    collateHighlightComplete: function(data) {
        if(data.collateType == true) {
            $('#vn' + data['id']).find('.answer2[data-answer-collate="' + data['answer'] + '"]').addClass('collate-complete');
        } else {
            $('#vn' + data['id']).find('.answer2[answer="' + data['answer'] + '"]').addClass('collate-complete');
        }
    },

    collateHighlightOff: function(data) {
        /*if(data.collateType == true) {
         $('#vn' + data['id']).find('.answer2[data-answer-collate="' + data['answer'] + '"]').removeClass('collate-pending2');
         $('#vn' + data['id']).find('.answer2[data-answer-collate="' + data['answer'] + '"]').removeClass('collate-complete');
         } else {
         $('#vn' + data['id']).find('.answer2[answer="' + data['answer'] + '"]').removeClass('collate-pending2');
         $('#vn' + data['id']).find('.answer2[answer="' + data['answer'] + '"]').removeClass('collate-complete');
         }*/

        clearInterval(this.collateHighlightInterval);
        $('#vn' + data['id']).find('.answer2').removeClass('collate-pending2').removeClass('collate-pending3');
        //$('#vn' + data['id']).find('.answer2').removeClass('collate-complete');
    },

    hidePromptUnanswered: function() {
        $('#not-all-answered').hide();
    },

    //отключает кнопки "предыдущий вопрос"
    disablePrevButtons: function () {
        $('#tb-prev-task').addClass('disabled');
        $('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
        $('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');

        $('.single-test-data').find('.task-switcher').addClass('prev-disabled');
    },

    //отключает кнопки "следующий вопрос"
    disableNextButtons: function () {
        $('#tb-next-task').addClass('disabled');
        $('.single-test-data').find('.tb-next-task div:last-child').addClass('disabled');
        $('.single-test-data').find('.tb-next-task div:last-child').removeClass('hoverable');

        $('.single-test-data').find('.task-switcher').addClass('next-disabled');
    },

    //делает кнопки "предыдущий вопрос" активными
    enablePrevButtons: function () {
        $('#tb-prev-task').removeClass('disabled');
        $('.single-test-data').find('.tb-prev-task div:last-child').removeClass('disabled');
        $('.single-test-data').find('.tb-prev-task div:last-child').addClass('hoverable');

        $('.single-test-data').find('.task-switcher').removeClass('prev-disabled');
    },

    //делает кнопки "следующий вопрос" активными
    enableNextButtons: function () {
        $('#tb-next-task').removeClass('disabled');
        $('.single-test-data').find('.tb-next-task div:last-child').removeClass('disabled');
        $('.single-test-data').find('.tb-next-task div:last-child').addClass('hoverable');

        $('.single-test-data').find('.task-switcher').removeClass('next-disabled');
    },

    //показывает описание теста
    /*showDescription: function () {
        $('.test-description').show();
    },

    //закрывает описание теста
    closeDescription: function () {
        $('.test-description').hide();
    },*/

    //отключает и убирает кнопки "предыдущий вопрос"
    disableFreeTaskChange: function () {
        $('#tb-prev-task').addClass('disabled');
        $('.single-test-data').find('.tb-prev-task div:last-child').addClass('disabled');
        $('.single-test-data').find('.tb-prev-task div:last-child').removeClass('hoverable');
        $('.single-test-data').find('.tb-prev-task div:last-child').hide();
        $('#tb-next-task').html('Пропустить вопрос');
        $('.single-test-data').find('.tb-next-task div:last-child').html('Пропустить вопрос');
        $('.single-test-data').find('.task-switcher').addClass('prev-disabled');
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
                //console.log2('divs after reverse: ', divs);
                $('#vn' + i + ' .answers').append(divs);
            }
            this.sorted = true;
        //сортировка rand - случайный порядок
        } else if (answerOrder === 'rand') {
            for (i = 1; i <= tasksCount; i++) {
                if(this._model.data.tasks[i]['answers_view'] === 'multiple-thin') continue;

                divs = $('#vn' + i + ' .answers > div.answers-wrapper .answer').get();
                //console.log2('divs: ', divs);
                divs = shuffle(divs);
                //console.log2('divs after shuffle: ', divs[0]);
                $('#vn' + i + ' .answers > div.answers-wrapper').prepend(divs[0]);
            }
        }

        //перемешивает массив
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
};