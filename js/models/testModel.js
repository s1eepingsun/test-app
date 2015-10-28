var testApp = testApp || {};

testApp.TestModel = function(data) {
    //дефолтный конфиг
    this.config = {
        answerOrder: 'rand',
        taskTimer: false,
        taskTimerMode: 'inc',
        freeTaskChange: true,
        lastTaskFinish: true,
        multipleChoices: false,
        resultAnswersStyle: 'default',
        navInResult: false,
        production: true
    };

    if(data) {
        this.data = data;
    } else {
        this.data = phpTestData;
    }
    //this.data = phpTestData; //берёт данные теста из json'а посланного при загрузке страницы
    this.wholeTestData; //данные всего теста (полученные аяксом)
    this.correctAnswers = []; //массив с баллами за ответы, полученный с сервера
    this.answersGiven = []; //массив с ответами данными пользователем
    this.taskTimer = []; //array of Timer instances
    this.tasksTimeSpent = []; //время затраченное на прохождение каждого отдельного задания
    this.tasksCount = 0; //заданий всего
    this.resultMode = false; //служит для переключения стилей: false)прохождение теста; true)просмотр результатов
    this.selectedTaskID = 0; //id задачи выбранной в данный момет
    this.testTypeDir = 'ege';
    this.testType = 'math-ege'; //сейчас это имя файла

    this.randomTests = false;
    this.maxTestNumber = 4;
    this.currentTestNumber = 0;
};

testApp.TestModel.prototype = {
    //метод для запуска событий
    fireEvent: function (type, data, context) {
        Observable.prototype.fireEvent(type, data, context);
    },

    //метод для прослушивания событий
    listen: function (type, method, scope, context) {
        Observable.prototype.listen(type, method, scope, context);
    },

    //привотит тест в готовность
    init: function (attrs, data2) {
        //заменяет дефолтные параметры конфига на указанные при инициализации
        if(attrs) {
            this.config = this.getMergedConfig(this.config, attrs.config);
        }

        Observable.prototype.clear();

       /* if(data2) {
            this.data = data2;
            console.log2('this.data = data2;');
        } else {
            this.data = phpTestData;
            console.log2('this.data = phpTestData;');
        }*/
        //console.log2('init data', this.data);

        //this.loadNewTest(this.testTypeDir, this.testType, 2);

        //console.log2('TestModel this', this);

        //проводит первичную обработку полученных с сервера данных: заполняет массив ответов correctAnswers,
        //производит подсчёт задач tasksCount, сортирует задания по order_num
        this.prepareData(this);

        //console.log2('init this.correctAnswers', this.correctAnswers);

        //отключает возможность переключаться на предыдущий вопрос
        if (this.config.freeTaskChange == false) {
            this.fireEvent('model:disableFreeTaskChange');
        }
    },

    //заменяет дефолтные параметры конфига на указанные при инициализации
    getMergedConfig: function(DefaultConfig, CustomConfig) {
        if (!CustomConfig) return DefaultConfig;

        var newConfig = DefaultConfig;

        for (property in CustomConfig) {
            if (!CustomConfig.hasOwnProperty(property)) continue;
            newConfig[property] = CustomConfig[property];
        }

        return newConfig;
    },

    //начинает новый тест
    startNewTest: function () {
        console.log2('test model start new test, data', this.data);

        //обнуляет данные, измененные при прошлых прохождениях теста
        this.answersGiven = [];
        this.taskTimer = [];
        this.tasksTimeSpent = [];
        this.selectedTaskID = 0;
        this.resultMode = false;

        this.fireEvent('model:setModeTestActive');

        this.fireEvent('model:startNewTest');

        var oldID = 0; //предыдущего задания не было
        var id = 1; //первое задание
        this.showTask(id, oldID);

        //запускает таймер
        var timerData = this.data.testTimerData;
        this.testTimerStart(timerData);

        this.selectedTaskID = Number(id); //for active task id to be available for other functions
    },

    loadNewTest: function(testTypeDir, testType, testNumber) {
        var that = this;
        var pathname = window.location.pathname;
        var parts = pathname.split('/');
        parts.pop();
        parts.shift();
        var dir = parts.join('/');
        dir = '/' + dir + '/';
        console.log2('dir: ', dir);
        var fileName = testType + '-' + testNumber;
        var filePath = dir + fileName;
        console.log2('filePath', filePath);

        var reqData = {
            dir: dir,
            testTypeDir: testTypeDir,
            fileName: fileName
        };

        $.get(dir + 'controllers/testDataAjax.php', reqData, function(data) {
            //data = $.parseJSON(data);
            data = JSON.parse(data);
            //console.log2('response data:', data);
            that.wholeTestData = data;
        })
    },

    //запускает таймер теста
    testTimerStart: function (timerData) {
        if (typeof  this.timer !== 'undefined') this.timer.stop();
        //var timerData = JSON.parse(JSON.stringify(this.data.testTimerData));
        //console.log2('testTimerStart this.data', this.data);
        this.timer = new Timer(timerData, 1);
        this.fireEvent('model:testTimerShow', timerData);

        this.timer.newTimer();
        var eventName = 'timer:timerTick';
        this.timer.goDown(eventName);
        console.log2('timer start timerData: ', timerData);
    },

    //слушает каждое изменение таймера, если время == 0, заканчивает тест
    timersTick: function (data) {
        var recievedTimerID = data.that.activeTimer; //id таймера данные которого получены

        if(this.timer) var testTimerID = this.timer.activeTimer; //id таймера теста
        this._timeNow = data.timeNow;

        //таймер теста, вывести значение и проверить не равен ли он 0
        if (testTimerID == recievedTimerID) {
            //console.log2('this.timer, that', testTimerID, recievedTimerID);
            //timeNow = this.timer.timeNow;
            this.fireEvent('model:testTimerShow', this._timeNow);
            this.testTimerCheck(this._timeNow);
        }

        //таймер задания, вывести значение и проверить не равен ли он 0
        if (this.config.taskTimer == true) {
            var taskTimerID = this.taskTimer[this.selectedTaskID].activeTimer; //id таймера задачи

            if (taskTimerID == recievedTimerID) { //checking if this timer is for task and not for test
                //console.log2('this.taskTimer, that', taskTimerID, recievedTimerID);
                //timeNow = this.timer.timeNow;
                this.fireEvent('model:taskTimerShow', this._timeNow);

                if (this.config.taskTimerMode == 'dec') {
                    this.taskTimerCheck();
                }
            }
        }

    },

    //если врямя на прохождение теста = 0, заканчивает тест
    testTimerCheck: function (timeNow) {
        this._timeNow = timeNow;
        if (this._timeNow == 0) {
            //console.log2('testTimerCheck timeNow == 0 => finishTest');
            this.timer.stop();
            this.finishTest();
        }
    },

    //при переключении задачи запускает таймер и записывает результат предыдущего таймера, если он был
    taskChange: function (id) {
        var oldID = this.selectedTaskID;
        this._id = id;
        console.log2('------- taskChange', this._id, oldID, this.data.tasks[this._id]);
        console.log2('Test this', this);

        if (this.config.taskTimer == false) return;

        if (this._id === oldID) return; //защита от нажатия на ту же задачу, что приводит к торможению таймера

        //записывает timestamp время затраченное на каждую задчу в массив tasksTimeSpent
        this.saveTaskTimeSpent();

        if (this.resultMode == true) return;

        //task timer id start
        if (this._id === null) return;

        var taskTimer;
        if (this.config.taskTimerMode == 'dec') {
            taskTimer = this.data.tasks[this._id].taskTimerData;
        } else {
            taskTimer = 0;
        }

        if (typeof taskTimer === 'undefined') return;

        console.log2('is taskTimer[id] an inctance of Timer?', this.taskTimer[this._id] instanceof Timer);
        if (!(this.taskTimer[this._id] instanceof Timer)) {
            this.taskTimer[this._id] = new Timer(taskTimer, 4);
            this.taskTimer[this._id].newTimer();
            console.log2('************* task Timer started', this._id);
        }

        var eventName = 'timer:timerTick';
        if (this.config.taskTimerMode == 'dec') {
            this.taskTimer[this._id].goDown(eventName);
        } else {
            this.taskTimer[this._id].goUp(eventName);
        }
    },

    //записывает timestamp время затраченное на каждую задчу в массив tasksTimeSpent
    saveTaskTimeSpent: function () {
        var oldID = this.selectedTaskID;

        if (this.config.taskTimer == false) return;

        //stop prev timer and save data
        //console.log2('is task timer an inctance of Timer-2', this.taskTimer[oldID] instanceof Timer);
        if (this.taskTimer[oldID] instanceof Timer) {
            this.taskTimer[oldID].stop();
            var timeSpent = this.taskTimer[oldID].getTimeSpent();
            console.log2('taskTimer timespent', timeSpent, oldID);

            if (oldID != 0) {
                this.tasksTimeSpent[oldID] = timeSpent;
            }
        }
    },

    //слушает таймер задания и переходит к след. заданию если время = 0
    taskTimerCheck: function () {
        var id = this.selectedTaskID;
        //console.log2('this.taskTimerCheck, id, timeNow', id, this.taskTimer[id].timeNow);
        if (this.taskTimer[id].timeNow == 0) {
            this.taskTimer[id].stop();
            //console.log2('this.taskTimerCheck this.taskTimer[id].timeNow == 0', id);
            this.showNextTask();

            //закончить тест если последний вопрос, сейчас действует от прямого вызова по таймеру, не от кнопок
            if (this.resultMode != true && id == this.tasksCount && this.config.lastTaskFinish == true) {
                console.log2('finish test in taskTimerCheck');
                this.finishTest();
            } else {
                this.showNextTask();
            }
        }
    },

    //проводит первичную обработку полученных с сервера данных: заполняет массив ответов correctAnswers,
    //производит подсчёт задач tasksCount, сортирует задания по order_num
    prepareData: function (that) {
        var data = that.data;

        data = this.sortByOrderNum(data);
        console.log2('this.prepareData', data);

        for (var property in data.tasks) {
            if (!data.tasks.hasOwnProperty(property)) continue;
            this.correctAnswers[property] = data.tasks[property]['answer_points'];
            this.tasksCount++;
        }

        this.data = data;
        console.log2('data after prepareData: ', this.data);
        console.log2('this.correctAnswers: ', this.correctAnswers);
    },

    //сортирует задания по order_num
    sortByOrderNum: function (data) {
        var that = this;
        var _data2 = data;
        var sortedKeys = Object.keys(_data2.tasks).sort(function (keyA, keyB) {
            return _data2.tasks[keyA].order_num - _data2.tasks[keyB].order_num;
        });

        var newTasks = [];
        sortedKeys.forEach(function (item) {
            for (var property in _data2.tasks) {
                if (!_data2.tasks.hasOwnProperty(property)) continue;
                if (property == item) {
                    newTasks.push(_data2.tasks[property]);
                }
            }
        });

        _data2.tasks = {};
        newTasks.forEach(function (item, i) {
            _data2.tasks[i + 1] = item; //if not put +1 here, 0 index will break assignments
        });

        return _data2;
    },

    //клик на сайдбар
    sidebarClick: function (id) {
        var oldID = this.selectedTaskID;
        var maxID = this.tasksCount;
        var answerGiven = false;
        if(this.answersGiven[id] && this.answersGiven[id].length > 0) answerGiven = true; //if task has an answer = true

        //показ задания №id, если при просмотре результата - установка стилей
        /*if (this.resultMode) {
            if (answerGiven) {
                this.showTask(id, oldID, maxID);
            }
        } else if (this.selectedTaskID > 0 && this.config.freeTaskChange == true) { //если тест запущен
            this.showTask(id, oldID, maxID);
        }*/
        this.showTask(id, oldID, maxID);
    },

    //показывает задачу
    showTask: function (id) {
        var oldID = this.selectedTaskID;
        console.log2('testMOdel SHOW TASK!', id, oldID);
        var maxID, minID;
        if (this.resultMode != true) {
            maxID = this.tasksCount;
            minID = 1;
        } else if (this.config.navInResult == true) {
            maxID = Array.max(this.finalData.allAnswered);
            minID = Array.min(this.finalData.allAnswered);
        }

        var data = {id: id, oldID: oldID, minID: minID, maxID: maxID};

        this.fireEvent('model:showTask', data);

        //отображение времени задачи при переключении задания
        if (this.resultMode != true && this.config.taskTimer == true) this.taskChange(id, oldID);

        this.selectedTaskID = Number(id);
    },

    submitOptions: function(formData) {
        var data = this.structureOptionsFormData(formData);

        message = this.validateOptionsForm(data);

        if(message) {
            this.fireEvent('model:optionsFormDataNotValid', message);
        } else {
            this.acceptOptions(data);
            this.fireEvent('model:optionsFormDataAccepted');
        }
    },

    acceptOptions: function(data) {
        this.randomTests = data.sequence === 'random';

        if(data.number > 0 && data.number <= this.maxTestNumber) {
            testApp.loadNewTest2(data.number);
        }
    },

    validateOptionsForm: function(data) {
        var message = '';

        if(data.number) {
            if (!(/^[1-4]$/.test(data.number))) {
                message = 'Номер теста должен быть числом от 1 до 4';
            }
        }

        return message;
    },

    structureOptionsFormData: function(formData) {
        var data = {};

        for (prop in formData) {
            if (!formData.hasOwnProperty(prop)) continue;

            switch (formData[prop]['name']) {
                case 'test-number':
                    var inputNumber = formData[prop]['value'];
                    inputNumber = inputNumber.trim();
                    if (inputNumber.length > 0) {
                        data.number = inputNumber;
                    }
                    break;
                case 'tests-sequence':
                    data.sequence = formData[prop]['value'];
                    break;
            }
        }

        return data;
    },

    //показывает следующую задачу
    showNextTask: function () {
        var id = this.selectedTaskID;
        if (id == 0 || id >= this.tasksCount) return;
        console.log2('showNextTask, id, this.tasksCount', id, this.tasksCount);
        if (this.resultMode == true) {
            console.log2('showNextTask this.resultMode == true');
            var allAnswered = this.finalData.allAnswered;
            while ($.inArray(id + 1, allAnswered) < 0) {
                id++;
            }
            this.showTask(id + 1);
        } else {
            console.log2('showNextTask else');
            this.showTask(id + 1);
        }
    },

    //показывает предыдущую задачу
    showPrevTask: function () {
        var id = this.selectedTaskID;
        if(id <= 1) return;
        console.log2('showPrevTask', id);

        if (this.resultMode == true) {
            var allAnswered = this.finalData.allAnswered;
            while ($.inArray(id - 1, allAnswered) < 0) {
                id--;
            }
            this.showTask(id - 1);

        } else if (this.config.freeTaskChange == true) {
            console.log2('freeTaskChange == true', id);
            this.showTask(id - 1);
        }
    },

    //клик на ответ
    giveAnswer: function (data) {
        var id = data['id'];
        var answer = data['answer'];

        //записывает(если его нет) или удаляет(если он уже есть) ответ из this.answersGiven
        this.writeDownAnswer(id, answer);

        //передаёт выбранные ответы в методы вьюшек для визуального отображения данных ответов
        console.log2('this.answersGiven', this.answersGiven);
        if (this.answersGiven.length > 0) {
            var newData = {id: id, answers: this.answersGiven[id]};
            this.fireEvent('model:reflectAnswers', newData);
        }

        //показывает след. вопрос, в случае если это был последний вопрос показывает результат теста
        if (this.config.multipleChoices != true && this.answersGiven[id].length > 0) {
            var maxID = this.tasksCount;
            if (id < maxID) {
                this.showTask(id + 1);
            } else if (id == maxID && this.config.lastTaskFinish == true) {
                this.finishTest();
            }
        }
    },

    //записывает данные ответы в this.answersGiven, если элемент найден в массиве, удаляет его
    writeDownAnswer: function(id, answer) {
        if (!this.answersGiven[id]) this.answersGiven[id] = [];
        var iInArray = $.inArray(answer, this.answersGiven[id]);

        if (this.config.multipleChoices == true) {
            if (iInArray > -1) {
                this.answersGiven[id].splice(iInArray, 1);
            } else {
                this.answersGiven[id].push(answer);
            }
        } else {
            if (iInArray > -1) {
                this.answersGiven[id] = [];
            } else {
                this.answersGiven[id] = [];
                this.answersGiven[id].push(answer);
            }
        }

        return this.answersGiven[id];
    },

    //заканчивает тест, подсчитывает и показывает результат
    finishTest: function () {
        if (this.selectedTaskID == 0) return;

        var correctAnswers = this.correctAnswers;
        var answersGiven = this.answersGiven;
        console.log2('--- FINISHING TEST answers given, this', answersGiven, this);

        //остановка таймера
        this.timer.stop();

        //остановка таймера отдельной задачи
        if (this.taskTimer instanceof Timer) this.taskTimer.stop();
        console.log2('invoking taskChange from fninishTest');
        this.saveTaskTimeSpent(); //saves last task time spent

        //затраченное на тест время
        this.timeSpent = this.timer.getTimeSpent();
        this.timeSpent = this.timer.timeToObject(this.timeSpent);
        console.log2(' this.timeSpent ', this.timeSpent);
        var timeSpent = this.timeSpent;

        //создает массив всех данных валидных ответов
        var allAnsweredArr = [];
        $.map(answersGiven, function (value, index) {
            if (typeof value !== 'undefined' && value.length > 0) {
                allAnsweredArr.push(index);
            }
        });
        console.log2('allAnsweredArr: ', allAnsweredArr);

        var totalPoints = 0;
        var maxPoints = 0;
        var wrongAnswersArr = [];
        var correctAnswersArr = [];
        var totalTasks = Number(this.tasksCount);
        console.log2('that.taskCount 2: ', this.tasksCount);
        var tasksAnswered = allAnsweredArr.length;
        var tasksSkipped = Number(totalTasks) - Number(tasksAnswered);
        console.log2('tasksAnswered: ', tasksAnswered);
        console.log2('tasksSkipped: ', tasksSkipped);
        console.log2('correctAnswers77: ', correctAnswers);
        console.log2('answersGiven: ', answersGiven);
        console.log2('this.wholeTestData: ', this.wholeTestData);

        //Заполняет массивы с правильными и непр-ми ответами, с данными ответами, и считает набранные баллы
        answersGiven.forEach(function (taskAnswers, i) {
            taskAnswers.forEach(function (answer) {
                var answerPoints = correctAnswers[i][answer + '_points'];

                if ($.isNumeric(answerPoints) && answerPoints > 0) {
                    //console.log2('answer for question ' + i + ' is correct');
                    totalPoints += Number(answerPoints);
                    correctAnswersArr.push(i);
                } else {
                    //console.log2('answer for question ' + i + ' is wrong');
                    wrongAnswersArr.push(i);
                }
            });
        });

        //считает макс. сумму баллов за все ответы вместе
        correctAnswers.forEach(function (item) {
            for (var property in item) {
                // console.log2('correctAnswers item property: ', item[property]);
                if ($.isNumeric(item[property])) {
                    maxPoints += Number(item[property]);
                }
            }
        });

        //данные для показа результата
        this.finalData = {
            totalTasks: totalTasks,
            correctAnswers: correctAnswersArr,
            wrongAnswers: wrongAnswersArr,
            allAnswered: allAnsweredArr, //массив с индексами всех отвеченных вопросов
            totalPoints: totalPoints,
            tasksAnswered: tasksAnswered,
            tasksSkipped: tasksSkipped,
            maxPoints: maxPoints,
            seconds: timeSpent.s,
            minutes: timeSpent.m,
            hours: timeSpent.h
        };

        //показать результат теста во вьюшках
        this.resultMode = true;
        this.fireEvent('model:showResult', this.finalData);
    }

};

