/**
Конфиг:
testConfig: {
    answerOrder: 'inc' //сортировка вопросов
}
Варианты сортировки для конфига:
dec - по убыванию order_num,
rand - случайный порядок
 */

var testApp = testApp || {};
testApp.Test = Backbone.Model.extend({
    defaults: {
        testConfig: {
            answerOrder: 'inc'
        }
    },
    initialize: function () {
        this.data = phpTestData; //берёт данные теста из json'а посланного при загрузке страницы
        this.correctAnswers = [];
        this.answersGiven = [];
        this.taskTimer = []; //array of Timer instances
        this.tasksTimeSpent = [];
        this.tasksCount = 0;
        console.log('this data: ', this);

        //заполняет массив correctAnswers и считает задачи
        this.prepareData();

        //передаёт обработчик во View
        this.testView = new testApp.TestView({model: this});

        //слушает каждое изменение таймеры, если время == 0, заканчивает тест
        this.listenTo(Backbone, 'testTimerTick', this.testTimerCheck);//передаётся из Timer.js

        if(this.attributes.testConfig.taskTimerMode == 'dec') {
            this.listenTo(Backbone, 'testTimerTick', this.taskTimerCheck);//передаётся из Timer.js
        }
    },

    //записывает данные ответы в this.answersGiven; если элемент найден в массиве, удаляет его
    //передаёт выбранные ответы в метод вьюшки для отображения ответов
    recieveAnswer: function(id, answer) {
        //this.answersGiven[id] = answer;
        if (!this.answersGiven[id]) this.answersGiven[id] = [];
        var index = $.inArray(answer, this.answersGiven[id]);

        if(this.attributes.testConfig.multipleChoices == true) {
            if (index > -1) {
                this.answersGiven[id].splice(index, 1);
            } else {
                this.answersGiven[id].push(answer);
            }
        } else {
            if (index > -1) {
                this.answersGiven[id] = [];
            } else {
                this.answersGiven[id] = [];
                this.answersGiven[id].push(answer);
            }
        }

        this.testView.reflectAnswers(id, this.answersGiven[id]);
    },

    //проводит первичную обработку полученных с сервера данных
    prepareData: function() {
        var data = this.data;

        data = this.sortByOrderNum(data);

        for (var property in data.tasks) {
            if(data.tasks.hasOwnProperty(property)) {
                //заполняет correctAnswers
                console.log(' data.tasks[property]',  data.tasks[property]);
                this.correctAnswers[property] = data.tasks[property]['answer_points'];

                //считает задачи
                this.tasksCount++;
            }
        }

        this.data = data;
        console.log('data after prepareData: ', this.data);
        console.log('this.correctAnswers: ', this.correctAnswers);
    },

    //сортирует задания по order_num
    sortByOrderNum: function(data) {
        var sorted = _.sortBy(data.tasks, 'order_num');
        data.tasks = {};
        sorted.forEach(function(item, i) {
            data.tasks[i + 1] = item; //if not put +1 here, 0 index will break assignments
        });
        return data;
    },

    //resets test data (needed for initiating new tests)
    testDataReset: function() {
        this.answersGiven = [];
        this.taskTimer = []; //array of Timer instances
        this.tasksTimeSpent = [];
    },

    //при переключении задачи запускает таймер и записывает результат предыдущего таймера, если он был
    taskChange: function(id, oldId) {
        console.log('------- taskChange', id, oldId, this.data.tasks[id]);
        console.log('Test this', this);

        if(this.attributes.testConfig.taskTimer == false) return;
        if(this.testView.resultMode == true) return;
        if(id === oldId) return; //защита от нажатия на ту же задачу, что приводит к торможению таймера

        //stop prev timer and save data
        console.log('is timer an inctance of Timer', this.taskTimer instanceof Timer);
        if(this.taskTimer[oldId] instanceof Timer) {
            this.taskTimer[oldId].stop();
            var timeSpent = this.taskTimer[oldId].getTimeSpent();
            console.log('taskTimer timespent', timeSpent);

            if(oldId != 0) {
                this.tasksTimeSpent[oldId] = timeSpent;
            }
        }

        //task timer id start
        if(id === null) return;

        var taskTimer;
        if(this.attributes.testConfig.taskTimerMode == 'inc') {
            taskTimer = 0;
        } else {
            taskTimer = this.data.tasks[id].taskTimerData;
        }

        if(typeof taskTimer === 'undefined') return;

        console.log('is taskTimer[id] an inctance of Timer?', this.taskTimer[id] instanceof Timer);
        if(!(this.taskTimer[id] instanceof Timer)) {
            this.taskTimer[id] = new Timer(taskTimer, 4);
            this.taskTimer[id].newTimer();
        }

        if(this.attributes.testConfig.taskTimerMode == 'inc') {
            this.taskTimer[id].goUp();
        } else {
            this.taskTimer[id].goDown();
        }
    },

    //слушает таймер и переходит к след. задаче если время = 0
    taskTimerCheck: function() {
        console.log('task timer check');
        //if(this.taskTimer.timeNow.s == 0 && this.taskTimer.timeNow.m == 0 && this.taskTimer.timeNow.h == 0) {
        var id = this.testView.activeTaskID;
        if(this.taskTimer[id].timeNow == 0) {
            this.taskTimer[id].stop();
            this.testView.showNextTask(id + 1);

            if (id == this.tasksCount && this.attributes.testConfig.lastTaskFinish == true) {
                console.log('this.model.tasksCount, id', this.model.tasksCount, id);
                this.finishTest();
            }
        }
    },

    //запускает таймер
    testTimerStart: function() {
        if(typeof  this.timer !== 'undefined') this.timer.stop();
        var timerData = JSON.parse(JSON.stringify(this.data.testTimerData));
        console.log('this.data', this.data.tasks);
        this.timer = new Timer(timerData, 1);
        this.timer.newTimer();
        this.timer.goDown();
        console.log('timer start; Model object: ', this);
    },

    //слушает таймер и останавливает тест если время = 0
    testTimerCheck: function() {
        //console.log('tick was heard by model ' ,this.timer.timeNow);
        //console.log('time timespent', this.timer.getTimeSpent());
        if(this.timer.timeNow == 0) {
            this.timer.stop();
            //console.log('time stop timespent', this.timeSpent);
            this.finishTest();
        }
    },

    //подсчитывает результат теста и передаёт обработчик в TestView
    finishTest: function() {
        var correctAnswers = this.correctAnswers;
        var answersGiven = this.answersGiven;
        console.log('--- FINISHING TEST answers given, this', answersGiven, this);

        //остановка таймера
        this.timer.stop();

        //остановка таймера отдельной задачи
        if(this.taskTimer instanceof Timer) this.taskTimer.stop();
        console.log('invoking taskChange from fninishTest');
        this.taskChange(null, this.testView.activeTaskID);

        //затраченное время
        this.timeSpent = this.timer.getTimeSpent();
        this.timeSpent = this.timer.timeToObject(this.timeSpent);
        console.log(' this.timeSpent ',  this.timeSpent);
        var timeSpent = this.timeSpent;

        /**
         * подготовка данных для показа результата теста
         */
        //создает массив всех данных валидных ответов
        var allAnsweredArr = [];
        $.map(answersGiven, function(value, index) {
            if(typeof value !== 'undefined') {
                allAnsweredArr.push(index);
            }
        });
        console.log('allAnsweredArr: ',allAnsweredArr);

        var totalPoints = 0;
        var maxPoints = 0;
        var wrongAnswersArr = [];
        var correctAnswersArr = [];
        var totalTasks = Number(this.tasksCount);
        console.log('that.taskCount 2: ', this.tasksCount);
        var tasksAnswered = allAnsweredArr.length;
        var tasksSkipped = Number(totalTasks) - Number(tasksAnswered);
        console.log('tasksAnswered: ', tasksAnswered);
        console.log('tasksSkipped: ', tasksSkipped);
        console.log('correctAnswers77: ', correctAnswers);
        console.log('answersGiven: ', answersGiven);

        //Заполняет массивы с правильными и непр-ми ответами, с данными ответами, и считает набранные баллы
        answersGiven.forEach(function(taskAnswers, i) {
            taskAnswers.forEach(function(answer) {
                var answerPoints = correctAnswers[i][answer + '_points'];

                if($.isNumeric(answerPoints) && answerPoints > 0) {
                    //console.log('answer for question ' + i + ' is correct');
                    totalPoints += Number(answerPoints);
                    correctAnswersArr.push(i);
                } else {
                    //console.log('answer for question ' + i + ' is wrong');
                    wrongAnswersArr.push(i);
                }
            });
        });

        //считает макс. сумму баллов за все ответы вместе
        correctAnswers.forEach(function(item) {
            for (var property in item) {
                // console.log('correctAnswers item property: ', item[property]);
                if($.isNumeric(item[property])) {
                    maxPoints += Number(item[property]);
                }
            }
        });

        //расчёт оценки
        var pointsPercent = totalPoints / maxPoints;
        if(pointsPercent >= 0.6 && pointsPercent <= 0.8) {
            var mark = 3;
        } else if(pointsPercent > 0.8 && pointsPercent <= 0.9) {
            mark = 4;
        } else if(pointsPercent > 0.9 && pointsPercent <= 1) {
            mark = 5;
        } else if(pointsPercent < 0.6) {
            mark = 2;
        }

        //данные для показа результата
        this.finalData = {
            mark: mark,
            totalTasks: totalTasks,
            correctAnswers: correctAnswersArr,
            wrongAnswers: wrongAnswersArr,
            allAnswered: allAnsweredArr,//массив с индексами всех отвеченных вопросов
            totalPoints: totalPoints,
            tasksAnswered: tasksAnswered,
            tasksSkipped: tasksSkipped,
            maxPoints: maxPoints,
            seconds: timeSpent.s,
            minutes: timeSpent.m,
            hours: timeSpent.h
        };

        //показать результат теста в TestView
        this.testView.showResult(this.finalData);

    }

});