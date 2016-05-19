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
        trainingMode: false,
        testHistory: [],
        horizontalTaskList: false,
        trainingTasksBatch: 20,
        showWrongs: false,
        navInResult: false,
        immediateAnswersOption: true,
        immediateAnswers: false,
        production: true
    };

    if(data) {
        this.data = data;
    } else {
        this.data = phpTestData;
    }
    //this.data = phpTestData; //берёт данные теста из json'а посланного при загрузке страницы

    this.wholeTestData; //данные всего теста
    this.correctAnswers = []; //массив с баллами за ответы, полученный с сервера
    this.answersGiven = []; //массив с ответами данными пользователем
    this.taskTimer = []; //array of Timer instances
    this.tasksTimeSpent = []; //время затраченное на прохождение каждого отдельного задания
    this.tasksCount = 0; //заданий всего
    this.resultMode = false; //служит для переключения стилей: false)прохождение теста; true)просмотр результатов
    this.selectedTaskID = 0; //id задачи выбранной в данный момет
    this.testTypeDir = 'ege';
    this.testType = 'math-ege'; //сейчас это имя файла

    this.maxTestNumber = 8;
    this.maxCountTestType = 'boat_mpvvp';
    this.currentTestNumber = 0;
    this.trainingTaskKeys = [];
    this.isFirstTraining = true;
    this.lastID = 0; //for training mode
    this.pastTasksLength = 0;
    this.currentCollateAnswer = undefined;
    this.tipsTaken = [];
    this.currentlyPlaying = [];
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
    init: function (attrs) {
        //заменяет дефолтные параметры конфига на указанные при инициализации
        if(attrs) {
            this.config = this.getMergedConfig(this.config, attrs.config);
        }

        Observable.prototype.clear();

        //проводит первичную обработку полученных с сервера данных: заполняет массив ответов correctAnswers,
        //производит подсчёт задач tasksCount, сортирует задания по order_num
        this.prepareData(this);

        //console.log2('init this.correctAnswers', this.correctAnswers);

        if(phpTestList) {
            this.maxTestNumber = this.getMaxTestNumber(phpTestList);
        } else if(this.data.maxTestNumber) {
            this.maxTestNumber = this.data.maxTestNumber;
        }

        //отключает возможность переключаться на предыдущий вопрос
        if (this.config.freeTaskChange == false) {
            this.fireEvent('model:disableFreeTaskChange');
        }

        if(this.config.tips) this.tipsLeft = this.config.tips;
    },

    //заменяет дефолтные параметры конфига на указанные при инициализации
    getMergedConfig: function(DefaultConfig, CustomConfig) {
        if (!CustomConfig) return DefaultConfig;

        var newConfig = DefaultConfig;

        for (var property in CustomConfig) {
            if (!CustomConfig.hasOwnProperty(property)) continue;
            newConfig[property] = CustomConfig[property];
        }

        return newConfig;
    },

    getMaxTestNumber: function(testList) {
        var oldTestType = testList[0]['testType'],
            maxFileNumber = 0,
            maxCountTestType = '';

        if(this.config.isTestCatalog == true) {
            for(var prop in testList) {
                if(!testList.hasOwnProperty(prop)) continue;

                if(testList[prop]['fileNumber'] > maxFileNumber) {
                    maxFileNumber = testList[prop]['fileNumber'];
                    maxCountTestType = oldTestType;
                }
            }
            this.config.maxCountTestType = maxCountTestType;
        } else {
            maxFileNumber = testList.length;
        }

        return maxFileNumber;
    },

    //начинает новый тест
    startNewTest: function () {
        console.log2('test model start new test, data', this.data);

        //обнуляет данные, измененные при прошлых прохождениях теста
        if(this.config.trainingMode == false) {
            this.answersGiven = [];
        }
        this.taskTimer = [];
        this.tasksTimeSpent = [];
        this.selectedTaskID = 0;
        this.resultMode = false;

        if(this.config.trainingMode != true) {
            this.fireEvent('model:setModeTestActive');
        } else {
            this.fireEvent('model:setModeTestActive');
            this.fireEvent('model:setModeTraining');
        }


        this.fireEvent('model:startNewTest');


        var oldID = 0; //предыдущего задания не было
        var id = 1; //первое задание

        if(this.config.trainingMode == true) {
            if(this.isFirstTraining == false) {
                id = this.lastID;
            } else {
                console.log2('this.isFirstTraining == true');
                this.isFirstTraining = false;
            }
        }

        console.log2('testModel.showTask', id);

        this.showTask(id, oldID);

        //запускает таймер
        if(this.config.testTimer != false) {
            var timerData = this.data.testTimerData;
            this.testTimerStart(timerData);
        }

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
            var timerData = this.data.testTimerData;
            var timeSpentData = {timerData: timerData, timeNow: this._timeNow};

            this.fireEvent('model:testTimerShow', this._timeNow);
            this.fireEvent('model:testTimeSpentShow', timeSpentData);
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

        if(that.config.trainingMode != true) {
            data = this.sortByOrderNum(data);
        } else {
            data = this.tasksSortRandom(data);
        }

        if(this.config.tasksCommonName) data.tasksCommonName = this.config.tasksCommonName;

        console.log2('this.prepareData', data);

        for (var property in data.tasks) {
            if (!data.tasks.hasOwnProperty(property)) continue;
            this.correctAnswers[property] = data.tasks[property]['answer_points'];
            this.tasksCount++;
        }

        this.lastUnanswered = this.tasksCount;

        this.data = data;
        console.log2('data after prepareData: ', this.data);
        console.log2('this.correctAnswers: ', this.correctAnswers);
    },

    sortByOrderNum: function (data) {
        var sortedKeys = Object.keys(data.tasks).sort(function (keyA, keyB) {
            return data.tasks[keyA].order_num - data.tasks[keyB].order_num;
        });

        var newTasks = [];
        sortedKeys.forEach(function (item) {
            for (var property in data.tasks) {
                if (!data.tasks.hasOwnProperty(property)) continue;

                if (property == item) {
                    newTasks.push(data.tasks[property]);
                }
            }
        });

        data.tasks = {};
        newTasks.forEach(function (item, i) {
            data.tasks[i + 1] = item; //if not put +1 here, 0 index will break assignments
        });

        return data;
    },

    tasksSortRandom: function(data) {
        var batch = this.config.trainingTasksBatch;
        function shuffle(array) {
            var counter = array.length, temp, index;
            while (counter > 0) {
                index = Math.floor(Math.random() * counter);
                counter--;
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        }

        var sortedKeys = shuffle(Object.keys(data.tasks));
        if(sortedKeys.length > batch) sortedKeys = sortedKeys.slice(-batch);
        console.log2('tasksSortRandom sortedKeys, this.trainingTaskKeys', sortedKeys, this.trainingTaskKeys);
        sortedKeys = sortedKeys.concat(this.trainingTaskKeys);
        console.log2('new sortedKeys', sortedKeys);

        this.trainingTaskKeys = sortedKeys;

        var newTasks = [];
        sortedKeys.forEach(function (item) {
            for (var property in data.tasks) {
                if (!data.tasks.hasOwnProperty(property)) continue;

                if (property == item) {
                    newTasks.push(data.tasks[property]);
                }
            }
        });

        data.tasks = {};
        newTasks.forEach(function (item, i) {
            data.tasks[i + 1] = item; //if not put +1 here, 0 index will break assignments
        });
        console.log2('tasksSortRandom data.tasks', data.tasks);

        return data;
    },

    mergeOldData: function(oldData, data) {
        console.log2('mergeOldData: oldData, data', oldData, data);

        if(oldData.pastTasksLength > 0) {
            /*oldData.correctAnswers = oldData.correctAnswers.slice(oldData.pastTasksLength);

            var tmp = [];
            var tmpTasks = {};
            for(i = 0; i < oldData.correctAnswers.length; i++) {
                var i = Number(i);
                tmp[i+1] = oldData.correctAnswers[i];
                //tmpTasks[i+1] = oldData.data.tasks[i];
            }

            //console.log2('oldData.data.tasks[i]', oldData.data.tasks[1], oldData.data.tasks[9], oldData.data.tasks[15]);
            oldData.correctAnswers = tmp;


            var len = Object.keys(oldData.data.tasks).length;

            for(i = 1; i <= len; i++) {
                if(i < oldData.pastTasksLength) {
                    delete oldData.data.tasks[i];
                } else {
                    tmpTasks[i - oldData.pastTasksLength + 1] = oldData.data.tasks[i];
                }
            }

            //tmpTasks = oldData.data.tasks;
            //for(var prop in oldData.data.tasks) {
            //    if(!oldData.data.tasks.hasOwnProperty(prop)) continue;
            //
            //}


            console.log2('tmp arr, tmpTasks', tmp, tmpTasks);

            console.log2('new sliced oldData.correctAnswers', oldData.correctAnswers);*/
            //oldData.data.tasks = oldData.data.tasks.slice(oldData.pastTasksLength);
        }

        this.pastTasksLength = oldData.correctAnswers.length;

        console.log2('mergeOldData: oldData2, data', oldData, data);

        data.data.tasks = this.mergeNumObjects(oldData.data.tasks, data.data.tasks);

        //oldData.correctAnswers's indexes start with 1 so native 'concat' will err
        data.correctAnswers = this.customConcat(oldData.correctAnswers, data.correctAnswers);

        //data.answersGiven = this.customConcat(oldData.answersGiven, data.answersGiven);
        //data.answersGiven = oldData.answersGiven.concat(data.answersGiven);
        data.answersGiven = oldData.answersGiven;

        console.log2('newly merged data', data);

        this.tasksCount = Object.keys(data.data.tasks).length;

        this.data.tasks = data.data.tasks;
        this.correctAnswers = data.correctAnswers;
        this.answersGiven = data.answersGiven;
    },

    mergeNumObjects: function(obj1, obj2) {
        var lastNum = Object.keys(obj1).length;
        for(var key in obj2) {
            if(!obj2.hasOwnProperty(key)) continue;

            lastNum++;
            obj1[lastNum] = obj2[key];
        }

        return obj1;
    },

    customConcat: function(arr1, arr2) {
        arr2.forEach(function(item) {
            arr1.push(item);
        });
        return arr1;
    },

    sidebarClick: function (id) {
        var oldID = this.selectedTaskID;
        var maxID = this.tasksCount;
        //var answerGiven = false;
        //if(this.answersGiven[id] && this.answersGiven[id].length > 0) answerGiven = true; //if task has an answer = true

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

    showTask: function (id) {
        var oldID = this.selectedTaskID;
        console.log2('testMOdel SHOW TASK!', id, oldID);
        var maxID, minID;
        if (this.resultMode != true) {
            maxID = this.tasksCount;
            minID = 1;
        } else if (this.config.navInResult == true) {
            maxID = this.tasksCount;
            minID = 1;
            //maxID = Array.max(this.finalData.allAnswered);
            //minID = Array.min(this.finalData.allAnswered);
        }

        var data = {id: id, oldID: oldID, minID: minID, maxID: maxID};

        this.fireEvent('model:showTask', data);

        if(this.resultMode == true && this.config.fireworks == true) this.fireworksStop();

        //отображение времени задачи при переключении задания
        if (this.resultMode != true && this.config.taskTimer == true) this.taskChange(id, oldID);

        this.selectedTaskID = Number(id);
    },

    submitOptions: function(formData) {
        var data = this.structureOptionsFormData(formData);

        var message = this.validateOptionsForm(data);

        if(message) {
            this.fireEvent('model:optionsFormDataNotValid', message);
        } else {
            this.acceptOptions(data);
            this.fireEvent('model:optionsFormDataAccepted');
        }
    },

    acceptOptions: function(data) {
        window.sessionStorage.setItem('randomTests', data.sequence === 'random');

        if(data.number > 0 && data.number <= this.maxTestNumber) {
            testApp.loadNewTest2(this.config, data.number);
        }
    },

    validateOptionsForm: function(data) {
        var message = '';
        var num = data.number;

        if(num) {
            if (!$.isNumeric(num) || num < 1 || num > this.maxTestNumber) {
                message = 'Номер теста должен быть числом от 1 до ' + this.maxTestNumber;
            }
        }

        return message;
    },

    structureOptionsFormData: function(formData) {
        var data = {};

        for (var prop in formData) {
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

    showNextTask: function () {
        console.log2('showNextTask click');
        var id = this.selectedTaskID;

        console.log2('showNextTask, id, this.tasksCount', id, this.tasksCount);
        if (this.resultMode == true && this.config.trainingMode != true) {
            if (id == 0 || id >= this.tasksCount) return;
            this.showTask(id + 1);
        } else if(this.config.trainingMode != true) {
            if (id == 0 || id >= this.tasksCount) return;
            this.showTask(id + 1);
        } else if(this.config.trainingMode == true) {
            var maxID = this.tasksCount;
            if(id < maxID) {
                this.showTask(id + 1);
            } else if(id == maxID) {
                this.fireEvent('model:disableNext');
                var oldData = {
                    data: this.data,
                    correctAnswers: this.correctAnswers,
                    answersGiven: this.answersGiven,
                    pastTasksLength: this.pastTasksLength
                };
                testApp.loadTraining(this.config.trainingTasksBatch, this.trainingTaskKeys, this.isFirstTraining, oldData, this.config);
            }
        }
    },

    showPrevTask: function () {
        var id = this.selectedTaskID;
        if(id <= 1) return;

        if (this.resultMode == true) {
            this.showTask(id - 1);
        } else if (this.config.freeTaskChange == true) {
            this.showTask(id - 1);
        }
    },

    giveAnswer: function (data) {
        //console.log2('giveAnswer() data:', data);
        var that = this;
        var id = data['id'];
        if(data['answer'].length > 0 && typeof data['answer'] === 'string') {
            data['answer'] = data['answer'].trim();
        }
        var answer = data['answer'] /*+ '_points'*/;

        //записывает(если его нет) или удаляет(если он уже есть) ответ из this.answersGiven
        //if(answer.length > 0) {
            var answersGiven = this.writeDownAnswer(id, answer);
        //}

        //console.log2('giveAnswer this.answersGiven2', this.answersGiven);

        if(this.config.trainingMode != true) {
            //передаёт выбранные ответы в методы вьюшек для визуального отображения данных ответов
            if (this.answersGiven.length > 0 && this.config.immediateAnswers == false/* && answer.length > 0*/) {
                var newData = {id: id, answers: this.answersGiven[id]};
                //console.log2('giveAnswer newData', newData);
                this.fireEvent('model:reflectAnswers', newData);
            } else if (this.answersGiven.length > 0 && this.config.immediateAnswers == true) {
                if (!this.hasConfirmButton(id)) {

                    var answerData = {};
                    this.answersGiven.forEach(function(answer, id) {
                        answerData['id'] = id;
                        answerData['answer'] = answer;
                        that.immediateShowAnswers(answerData);
                    });
                }

                newData = {id: id, answers: this.answersGiven[id]};
                this.fireEvent('model:reflectAnswers', newData);
            }

            if (!this.hasConfirmButton(id)) {
                this.autoNextTask(id);
            }

        } else {
            if (!this.hasConfirmButton(id)) {
                this.immediateShowAnswers(data);
            } else {
                newData = {id: id, answers: this.answersGiven[id]};
                this.fireEvent('model:reflectAnswers', newData);
            }
        }

    },

    immediateShowAnswers: function(data) {
        var that = this;
        var id = data['id'];
        var answer = data['answer'];

        var testDataChank = {
            totalPoints: 0,
            wrongAnswersArr: [],
            correctAnswersArr: [],
            skippedAnswersArr: [],
            rightAnswersObj: {},
            wrongAnswersObj: {},
            skippedAnswersObj: {}
        };

        testDataChank = that.parseTaskAnswers(answer, id, testDataChank);

        /*var allAnsweredArr = [];
        $.map(answersGiven, function (value, index) {
            if (typeof value !== 'undefined' && value.length > 0) {
                allAnsweredArr.push(index);
            }
        });*/

        testDataChank['allAnswered'] = [data['id']];


        testApp.mainView.showGivenAnswers(testDataChank);
        if(testApp.horizontalListView) testApp.horizontalListView.showResult(testDataChank);
        if(testApp.listView) testApp.listView.showResult(testDataChank);

        /*var taskCorrectAnswers = correctAnswers[id];
        if(Object.keys(that.data.tasks[id].answers).length == 1) { //input view
            data['rightAnswer'] = that.data.tasks[id].answers['answer1'];
        } else {
            var rightAnswers = [];
            for (var answerPoints in taskCorrectAnswers) {
                if (!taskCorrectAnswers.hasOwnProperty(answerPoints)) continue;

                if ($.isNumeric(taskCorrectAnswers[answerPoints]) && taskCorrectAnswers[answerPoints] > 0) {
                    console.log2('right answer', taskCorrectAnswers[answerPoints], answerPoints.substr(0, 7));

                    rightAnswers.push(answerPoints.substring(0, 7));
                }
            }
            data['rightAnswers'] = rightAnswers;
        }
        if(answer[0][1] && answer[0][1].trim().length > 0) {
            //this.fireEvent('model:showTrainingAnswer', testDataChank);
        }*/
    },

    //показывает след. вопрос, в случае если это был последний вопрос показывает результат теста
    autoNextTask: function(id) {
        if (1/*this.config.multipleChoices != true &&
            this.data.tasks[id]['answers_view'] !== 'multiple' &&
            this.data.tasks[id]['answers_view'] !== 'multiple-wide' &&
            this.data.tasks[id]['answers_view'] !== 'multiple-thin'*/ /*&& this.answersGiven[id].length > 0*/ ) {
            //if ((!answersGiven) || answersGiven.length == 0) return;

            var answersGivenCount = 0;
            this.answersGiven.forEach(function() {
                answersGivenCount++;
            });

            var maxID = this.lastUnanswered;
            if (id < maxID) {
                this.showTask(id + 1);
            } else if (id == maxID && this.config.lastTaskFinish == true) {
                if(answersGivenCount < this.tasksCount) {
                    this.fireEvent('model:promptUnanswered');
                } else {
                    this.finishTest();
                }
            }
        }
    },

    //записывает данные ответы в this.answersGiven, если элемент найден в массиве, удаляет его
    writeDownAnswer: function(id, answer) {
        if (!this.answersGiven[id]) this.answersGiven[id] = [];
        var iInArray = $.inArray(answer, this.answersGiven[id]);

        if(this.data.tasks[id]['collate_answer_view']) {
            //console.log2('collate_answer_view, answersGiven[id], answer', this.answersGiven[id], answer);
            //console.log2('this.answersGiven[' + id + '].indexOf(' + answer.value + ')', this.answersGiven[id].indexOf(answer.value));
            var pastIndex = this.answersGiven[id].indexOf(answer.value);
            if (pastIndex > -1) {
                this.answersGiven[id][pastIndex] = undefined;
            }

            this.answersGiven[id][answer.index] = answer.value;
            this.fireEvent('model:collateHighlightOff', this.currentCollateAnswer);
            this.currentCollateAnswer = undefined;

            //this.autoSwitchToNextAnswer(id, answer);
        } else if (this.config.multipleChoices == true || this.hasConfirmButton(id)) {
            if (iInArray > -1) {
                this.answersGiven[id].splice(iInArray, 1);
            } else {
                this.answersGiven[id].push(answer);
            }
        } else {
            if(this.isEmptyData(answer)) {
                delete this.answersGiven[id];
            } else {
                this.answersGiven[id] = [answer];
            }
        }

        return this.answersGiven[id];
    },

    isEmptyData: function(data) {
        if(typeof data === 'string') {
            return !data.length > 0;
        } else if(typeof data === 'object') {
            var empty = true;
            for(var key in data) {
                if(!data.hasOwnProperty(key)) continue;

                if(data[key].length > 0) empty = false;
            }
            return empty;
        }
    },

    confirmAnswer: function(id) {
        var that = this;

        if(this.config.trainingMode != true) {
            //if(this.answersGiven.length == 0)
            /*this.giveAnswer({
                id: id,
                answer: {1: ''}
            });*/

            this.answersGiven.forEach(function(item, i) {
                var data = {
                    id: i,
                    answer: item
                };
                that.immediateShowAnswers(data);
            });

            this.autoNextTask(id);
        } else {
            var answer = this.answersGiven[id];
            var data = {
                id: id,
                answer: answer
            };
            this.immediateShowAnswers(data);
        }

        /*if (this.answersGiven.length > 0 && this.config.immediateAnswers == true) {
            console.log2('not mult');
            if (!this.data.tasks[id]['multiple_answer_view'] &&
                !this.data.tasks[id]['multiple-wide_answer_view'] &&
                !this.data.tasks[id]['multiple-thin_answer_view']) {
                var answerData = {};
                console.log2('not mult2');
                this.answersGiven.forEach(function (answer, id) {
                    answerData['id'] = id;
                    answerData['answer'] = answer;
                    that.immediateShowAnswers(answerData);
                });
            }

            newData = {id: id, answers: this.answersGiven[id]};
            this.fireEvent('model:reflectAnswers', newData);
        }*/
    },

    hasConfirmButton: function(id) {
        return this.data.tasks[id]['multiple_answer_view'] ||
               this.data.tasks[id]['multiple-wide_answer_view'] ||
               this.data.tasks[id]['multiple-thin_answer_view'] ||
               this.data.tasks[id]['collate_answer_view'];
    },

    collateAnswerClick: function(data) {
        var current = this.currentCollateAnswer;

        if(current === undefined) {
            this.fireEvent('model:collateHighlightPending', data);
            this.fireEvent('model:collateHighlightChoices', data);
            this.currentCollateAnswer = data;
        } else {
            if(data.answer === current.answer) {
                this.fireEvent('model:collateHighlightOff', current);
                this.currentCollateAnswer = undefined;
            } else if(typeof data.answer === typeof current.answer) {
                this.fireEvent('model:collateHighlightOff', current);
                this.fireEvent('model:collateHighlightPending', data);
                this.fireEvent('model:collateHighlightChoices', data);
                this.currentCollateAnswer = data;
            } else {
                var index, value;
                if(current.collateType == true) {
                    index = current.answer - 1;
                    value = data.answer;
                } else if(data.collateType == true) {
                    index = data.answer - 1;
                    value = current.answer;
                }

                var collateTo = {};
                collateTo.index = index;
                collateTo.value = value;
                this.giveAnswer({id: data.id, answer: collateTo});
            }
        }
        //console.log2('current currentCollateAnswer, data', current, data);
    },

    autoSwitchToNextAnswer: function(id, answer) {
        var answersGiven = this.answersGiven[id];
        var collateAnswers = this.data.tasks[id]['collateAnswers'];
        var length = this.data.tasks[id]['collateAnswers'].length;
        var notAnswered = -1;

        for(i = answer.index + 1; i < length; i++) {
            if(!answersGiven[i]) {
                notAnswered = i;
                break;
            }
        }

        if(notAnswered == -1 && answer.index > 0) {
            for(i = 0; i < answer.index; i++) {
                if(collateAnswers[i] && !answersGiven[i]) {
                    notAnswered = i;
                    break;
                }
            }
        }

        if(notAnswered > -1) {
            var dataAnswerCollate = notAnswered + 1;
            var data = {
                id: id,
                answer: dataAnswerCollate,
                collateType: true
            };
            this.collateAnswerClick(data);
        }
    },

    quitTestCheck: function(event) {
        function isLengthPositiveValue(element) {
            return element.length > 0;
        }

        var areAnyAnswersGiven = this.answersGiven.some(isLengthPositiveValue);

        if (this.trainingMode != true &&
            this.resultMode != true &&
            areAnyAnswersGiven) {

            if(event === 'showPrevTest' && this.config.testHistory.length <= 1) return;

            this.fireEvent('model:promptQuitTest', event);
        } else {
            this.quitTestConfirm(event);
        }
    },

    quitTestConfirm: function(event) {
        switch(event) {
            case 'trainingBtnClick':
                this.startTraining();
                break;
            case 'showPrevTest':
                if(this.config.testHistory.length <= 1) return;
                this.showPrevTest();
                break;
            case 'newTestBtnClick':
                this.newTestBtnClick();
                break;
        }
    },

    newTestBtnClick: function() {
        testApp.loadNewTest2(this.config);
    },

    startTraining: function() {
        if(this.config.isTestCatalog) {
            var pathname = window.location.pathname.split('/');
            pathname.splice(pathname.length - 1, 0, this.config.subtestLink);
            pathname = pathname.join('/');
            window.sessionStorage.setItem('trainingStart', 1);
            window.location = pathname;
        } else {
            var oldData = {
                data: {},
                horizontalTaskList: this.config.horizontalTaskList,
                correctAnswers: [],
                answersGiven: [],
                pastTasksLength: 0,
                maxTestNumber: this.maxTestNumber,
                horListHeightAdjusted: this.config.horListHeightAdjusted,
                showWrongs: this.config.showWrongs
            };
            this.isFirstTraining = true;
            this.trainingTaskKeys = [];
            testApp.loadTraining(this.config.trainingTasksBatch, this.trainingTaskKeys, this.isFirstTraining, oldData, this.config);
        }
    },

    showGivenAnswers: function(answersGiven) {
        console.log2('testModel showGivenAnswers, this.answersGiven', answersGiven);
        //var answersGiven = this.answersGiven;
        var allAnsweredArr = [];
        $.map(answersGiven, function (value, index) {
            if (typeof value !== 'undefined' && value.length > 0) {
                allAnsweredArr.push(index);
            }
        });

        var data = {allAnswered: allAnsweredArr, answersGiven: answersGiven};

        this.fireEvent('model:showGivenAnswers', data);
    },

    showWrongs: function() {
        if(this.config.fireworks == true) this.fireworksStop();
        this.fireEvent('model:showWrongs', this.wrongAnswersArr);
    },

    showAllAnswers: function() {
        this.fireEvent('model:showAllAnswers');
    },

    showUnanswered: function() {
        var correctAnswers = this.correctAnswers;
        var answersGiven = this.answersGiven;
        var answersGivenKeys = [];
        var unanswered = [];

        answersGiven.forEach(function(item, i) {
            answersGivenKeys.push(i);
        });

        correctAnswers.forEach(function(item, i) {
            if(answersGivenKeys.indexOf(i) < 0) {
                unanswered.push(i);
            }
        });

        var firstUnanswered = Array.min(unanswered);
        this.lastUnanswered = Array.max(unanswered);

        this.showTask(firstUnanswered);
    },

    showPrevTest: function() {
        var testHistory = this.config.testHistory;
        if(testHistory.length <= 1) return;

        var lastTestID = testHistory[testHistory.length - 2];
        testApp.loadNewTest2(this.config, lastTestID);
    },

    selectTestFromList: function(testLinkData) {
        testLinkData = testLinkData.split('-');
        var testNum = testLinkData.pop();
        var testType = testLinkData.join('-');

        var pathname = window.location.pathname;
        var parts = pathname.split('/');
        var currentTestType = parts[parts.length -2];

        if(currentTestType === testType) {
            testApp.loadNewTest2(this.config, testNum);
        } else {
            parts.splice(-1, 0, testType);
            var newURI = parts.join('/');
            newURI += '#test-start=' + testNum;
            window.location = newURI;
        }
    },

    clickFinish: function() {
        if(this.resultMode == true) return;
        var answersGivenCount = 0;
        this.answersGiven.forEach(function() {
            answersGivenCount++;
        });

        if(answersGivenCount < this.tasksCount) {
            this.fireEvent('model:promptUnanswered');
        } else {
            this.finishTest();
        }
    },

    musicStopClick: function(id) {
        if(!this.config.tips) return false;

        delete this.currentlyPlaying[id];
    },

    musicPlayClick: function(id) {
        if(!this.config.tips) return false;

        this.stopActivePlayer();
        this.currentlyPlaying[id] = 1;

        if(this.tipsTaken.indexOf(id) == -1) {
            this.tipsTaken.push(id);
            if(this.config.trainingMode != true && this.resultMode != true) {
                this.tipsLeft -= 1;
                this.fireEvent('model:makePlayerUnblockable', id);
                this.fireEvent('model:adjustTipsNum', this.tipsLeft);
            }
        }

        if(this.tipsLeft == 0 && this.config.trainingMode != true && this.resultMode != true) {
            this.fireEvent('model:blockAudioPlayers');
        }
    },

    stopActivePlayer: function() {
        if(this.currentlyPlaying.length > 0) {
            this.fireEvent('model:stopPlayer', this.currentlyPlaying);
        }
    },

    //заканчивает тест, подсчитывает и показывает результат
    finishTest: function () {
        var that = this;
        if (this.selectedTaskID == 0) return;

        if(this.config.testTypeDir == 'personality-questionary') {
            this.finishAizenkTest();
            return;
        } else if(this.config.testTypeDir == 'iq') {
            this.finishIQ();
            return;
        }

        this.stopActivePlayer();

        var correctAnswers = this.correctAnswers;
        var answersGiven = this.answersGiven;
        console.log2('--- FINISHING TEST answers given, this', answersGiven, this);

        if(this.timer) this.timer.stop();

        //остановка таймера отдельной задачи
        if (this.taskTimer instanceof Timer) this.taskTimer.stop();
        console.log2('invoking taskChange from fninishTest');
        this.saveTaskTimeSpent(); //saves last task time spent

        //затраченное на тест время
        if(this.timer) {
            var timeSpent;
            this.timeSpent = this.timer.getTimeSpent();
            this.timeSpent = this.timer.timeToObject(this.timeSpent);
            console.log2(' this.timeSpent ', this.timeSpent);
            timeSpent = this.timeSpent;
        } else {
            timeSpent = {s: 0, m: 0, h: 0};
        }


        //создает массив всех данных валидных ответов
        var allAnsweredArr = [];
        $.map(answersGiven, function (value, index) {
            if (typeof value !== 'undefined' && value.length > 0) {
                allAnsweredArr.push(index);
            }
        });
        console.log2('allAnsweredArr: ', allAnsweredArr);

        var maxPoints = 0;

        var totalTasks = Number(this.tasksCount);
        var tasksAnswered = allAnsweredArr.length;
        var tasksSkipped = Number(totalTasks) - Number(tasksAnswered);
        /*console.log2('that.taskCount 2: ', this.tasksCount);
        console.log2('tasksAnswered: ', tasksAnswered);
        console.log2('tasksSkipped: ', tasksSkipped);
        console.log2('correctAnswers77: ', correctAnswers);
        console.log2('answersGiven: ', answersGiven);
        console.log2('this.wholeTestData: ', this.wholeTestData);*/

        var testDataChank = {
            totalPoints: 0,
            wrongAnswersArr: [],
            correctAnswersArr: [],
            skippedAnswersArr: [],
            rightAnswersObj: {},
            wrongAnswersObj: {},
            skippedAnswersObj: {}
        };
        //Заполняет массивы с правильными и непр-ми ответами, с данными ответами, и считает набранные баллы
        answersGiven.forEach(function (taskAnswers, i) {
            testDataChank = that.parseTaskAnswers(taskAnswers, i, testDataChank);
        });

        var totalPoints = testDataChank.totalPoints;
        var wrongAnswersArr = testDataChank.wrongAnswersArr;
        var correctAnswersArr = testDataChank.correctAnswersArr;
        var skippedAnswersArr = testDataChank.skippedAnswersArr;
        var rightAnswersObj = testDataChank.rightAnswersObj;
        var wrongAnswersObj = testDataChank.wrongAnswersObj;
        var skippedAnswersObj = testDataChank.skippedAnswersObj;

        console.log2('correctAnswersArr, Obj, wrongAnswersArr, Obj', correctAnswersArr, rightAnswersObj, wrongAnswersArr, wrongAnswersObj);

        this.wrongAnswersArr = wrongAnswersArr;

        //считает макс. сумму баллов за все ответы вместе
        correctAnswers.forEach(function (item) {
            for (var property in item) {
                // console.log2('correctAnswers item property: ', item[property]);
                if ($.isNumeric(item[property])) {
                    maxPoints += Number(item[property]);
                }
            }
        });

        maxPoints = this.countMaxPoints(this.data.tasks);

        var mark = this.getMark(totalPoints, maxPoints);

        //данные для показа результата
        this.finalData = {
            totalTasks: totalTasks,
            correctAnswers: correctAnswersArr,
            rightAnswersObj: rightAnswersObj,
            wrongAnswers: wrongAnswersArr,
            skippedAnswers: skippedAnswersArr,
            wrongAnswersObj: wrongAnswersObj,
            allAnswered: allAnsweredArr, //массив с индексами всех отвеченных вопросов
            totalPoints: totalPoints,
            tasksAnswered: tasksAnswered,
            tasksSkipped: tasksSkipped,
            maxPoints: maxPoints,
            mark: mark,
            seconds: timeSpent.s,
            minutes: timeSpent.m,
            hours: timeSpent.h
        };

        //console.log2('findalData, maxPoints2', this.finalData, maxPoints);

        this.resultMode = true;
        this.fireEvent('model:showResult', this.finalData);

        if(this.config.fireworks == true && totalPoints == maxPoints) {
            this.fireworksStart(3, 1);
        }
    },

    finishAizenkTest: function() {
        var correctAnswers = this.correctAnswers;
        var answersGiven = this.answersGiven;
        var that = this;
        console.log2('--- FINISHING Aizenk TEST answers given, this', answersGiven, this);

        var extraversionScore = 0;
        var neuroticismScore = 0;
        var liesScore = 0;


        //создает массив всех данных валидных ответов
        var allAnsweredArr = [];
        $.map(answersGiven, function (value, index) {
            if (typeof value !== 'undefined' && value.length > 0) {
                allAnsweredArr.push(index);
            }
        });
        console.log2('allAnsweredArr: ', allAnsweredArr);

        var totalPoints = 0;
        var wrongAnswersArr = [];
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

                    switch(that.data.tasks[i]['type']) {
                        case 'extroversion':
                            extraversionScore++;
                            break;
                        case 'neuroticism':
                            neuroticismScore++;
                            break;
                        case 'lies':
                            liesScore++;
                    }
                }
            });
        });

        var temperamentType, temperTypeEng;
        if(extraversionScore < 12 && neuroticismScore < 12) {
            temperamentType = 'флегматик';
            temperTypeEng = 'phlegmatic';
        } else if(extraversionScore < 12 && neuroticismScore >= 12) {
            temperamentType = 'меланхолик';
            temperTypeEng = 'melancholic';
        } else if(extraversionScore >= 12 && neuroticismScore < 12) {
            temperamentType = 'сангвиник';
            temperTypeEng = 'sanguine';
        } else if(extraversionScore >= 12 && neuroticismScore >= 12) {
            temperamentType = 'холерик';
            temperTypeEng = 'choleric';
        }

        this.wrongAnswersArr = wrongAnswersArr;

        //данные для показа результата
        this.finalData = {
            totalTasks: totalTasks,
            extraversionScore: extraversionScore,
            neuroticismScore: neuroticismScore,
            temperamentType: temperamentType,
            temperTypeEng: temperTypeEng,
            liesScore: liesScore,
            allAnswered: allAnsweredArr, //массив с индексами всех отвеченных вопросов
            totalPoints: totalPoints,
            tasksAnswered: tasksAnswered,
            tasksSkipped: tasksSkipped,
            testType: 'temperament'
        };

        //console.log2('final data', this.finalData);
        this.resultMode = true;
        this.fireEvent('model:showResult', this.finalData);
    },

    finishIQ: function () {
        if (this.selectedTaskID == 0) return;

        var correctAnswers = this.correctAnswers;
        var answersGiven = this.answersGiven;
        console.log2('--- FINISHING TEST answers given, this', answersGiven, this);

        if(this.timer) this.timer.stop();

        //остановка таймера отдельной задачи
        if (this.taskTimer instanceof Timer) this.taskTimer.stop();
        console.log2('invoking taskChange from fninishTest');
        this.saveTaskTimeSpent(); //saves last task time spent

        //затраченное на тест время
        if(this.timer) {
            var timeSpent;
            this.timeSpent = this.timer.getTimeSpent();
            this.timeSpent = this.timer.timeToObject(this.timeSpent);
            console.log2(' this.timeSpent ', this.timeSpent);
            timeSpent = this.timeSpent;
        } else {
            timeSpent = {s: 0, m: 0, h: 0};
        }


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

        this.wrongAnswersArr = wrongAnswersArr;

        //считает макс. сумму баллов за все ответы вместе
        correctAnswers.forEach(function (item) {
            for (var property in item) {
                // console.log2('correctAnswers item property: ', item[property]);
                if ($.isNumeric(item[property])) {
                    maxPoints += Number(item[property]);
                }
            }
        });

        var IQscore = this.getIQ(totalPoints);

        var IQresultWords;
        if(IQscore < 90) {
            IQresultWords = 'низкий уровень';
        } else if(IQscore >= 90 && IQscore <= 110) {
            IQresultWords = 'средний уровень';
        } else if(IQscore > 110) {
            IQresultWords = 'высокий уровень';
        }

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
            IQscore: IQscore,
            IQresultWords: IQresultWords,
            seconds: timeSpent.s,
            minutes: timeSpent.m,
            hours: timeSpent.h
        };

        //console.log2('finalData IQ', this.finalData);

        this.resultMode = true;
        this.fireEvent('model:showResult', this.finalData);
    },

    getIQ: function(points) {
        var iqBase = 75;
        var iqEarned = Math.floor(points * 2.5);
        return iqBase + iqEarned;
    },

    countMaxPoints: function(tasks) {
        var maxPoints = 0;

        for(var taskNum in tasks) {
            if(!tasks.hasOwnProperty(taskNum)) continue;

            var pointsForTask = 0;

            if(tasks[taskNum]['answers_view']) {
                switch(tasks[taskNum]['answers_view']) {
                    case 'multiple':
                    case 'multiple-thin':
                    case 'multiple-wide':
                        var taskMaxPoints = 0;
                        var taskMaxRightAnswers = 0;

                        for(var answerNum in tasks[taskNum]['answer_points']) {
                            if(!tasks[taskNum]['answer_points'].hasOwnProperty(answerNum)) continue;

                            var thisAnswerPoints = Number(tasks[taskNum]['answer_points'][answerNum]);
                            taskMaxPoints += thisAnswerPoints;
                            if(thisAnswerPoints > 0) taskMaxRightAnswers++;
                        }

                        pointsForTask = taskMaxPoints / taskMaxRightAnswers;
                        break;
                    case 'sequence':
                    case 'sequence-abv':
                    case 'input1':
                        pointsForTask = Number(tasks[taskNum]['answer_points']['answer1_points']);
                        break;
                    default:
                        for(answerNum in tasks[taskNum]['answer_points']) {
                            if (!tasks[taskNum]['answer_points'].hasOwnProperty(answerNum)) continue;

                            thisAnswerPoints = Number(tasks[taskNum]['answer_points'][answerNum]);
                            if(thisAnswerPoints > 0) {
                                pointsForTask = thisAnswerPoints;
                                break;
                            }
                            break;
                        }
                }
            } else {
                for(answerNum in tasks[taskNum]['answer_points']) {
                    if (!tasks[taskNum]['answer_points'].hasOwnProperty(answerNum)) continue;

                    thisAnswerPoints = Number(tasks[taskNum]['answer_points'][answerNum]);
                    if(thisAnswerPoints > 0) {
                        pointsForTask += thisAnswerPoints;
                        break;
                    }
                }
            }

            maxPoints += pointsForTask;
        }

        return maxPoints;
    },

    parseTaskAnswers: function(taskAnswers, i, testDataChank) {
        var that = this;
        var currentTask = that.data.tasks[i];
        var correctAnswers = that.correctAnswers;
        var totalPoints = testDataChank.totalPoints;
        var wrongAnswersArr = testDataChank.wrongAnswersArr;
        var correctAnswersArr = testDataChank.correctAnswersArr;
        var skippedAnswersArr = testDataChank.skippedAnswersArr;
        var rightAnswersObj = testDataChank.rightAnswersObj;
        var wrongAnswersObj = testDataChank.wrongAnswersObj;
        var skippedAnswersObj = testDataChank.skippedAnswersObj;
        var taskMaxPoints = 0;
        var taskMaxRightAnswers = 0;
        //console.log2('parseTaskAnswers() taskAnswers, i, testDataChank', taskAnswers, i, testDataChank);

        if (currentTask.answers_view &&
            currentTask.answers_view != 'img1' &&
            currentTask.answers_view != 'img2') {

            var pointsCountingMethod = currentTask['points_counting_method'];
            var pointsForTask = 0;

            switch(currentTask.answers_view) {
                case 'input1':

                    if(taskAnswers[0]) taskAnswers = taskAnswers[0];
                    if(!taskAnswers[1].trim().length > 0) {
                        break;
                    }

                    if(pointsCountingMethod === 'input-possibilities') {
                        var correctPossibilities = currentTask.answers;
                        var answerIsCorrect = false;
                        for(var answerKey in correctPossibilities) {
                            if(!correctPossibilities.hasOwnProperty(answerKey)) continue;

                            if(this.makeUniformString(correctPossibilities[answerKey]) == this.makeUniformString(taskAnswers[1])) {
                                answerIsCorrect = true;
                                break;
                            }
                        }

                        if(answerIsCorrect == true) {
                            correctAnswersArr.push(i);
                            pointsForTask = Number(currentTask['answer_points']['answer1_points']);
                        } else {
                            wrongAnswersArr.push(i);
                        }
                    } else {
                        var correctAnswer = currentTask.answers['answer1'];
                        if(this.makeUniformString(taskAnswers[1]) == this.makeUniformString(correctAnswer)) {
                            correctAnswersArr.push(i);
                            pointsForTask = Number(currentTask['answer_points']['answer1_points']);
                        } else {
                            wrongAnswersArr.push(i);
                        }
                    }

                    totalPoints += pointsForTask;
                    break;
                case 'sequence':
                case 'sequence-abv':
                    var actualAnswers = currentTask['answers'];
                    var errors = 0;

                    //in training mode there is no taskAnswers[0]
                    if(taskAnswers[0]) {
                        taskAnswers = taskAnswers[0];
                    }

                    if(taskAnswers) {
                        for(key in taskAnswers) {
                            if(!taskAnswers.hasOwnProperty(key)) continue;

                            if(taskAnswers[key] === actualAnswers['answer' + key]) {
                                if(correctAnswersArr.indexOf(i) == -1) correctAnswersArr.push(i);
                                if(!rightAnswersObj[i]) rightAnswersObj[i] = [];
                                rightAnswersObj[i].push(key);
                            } else if(taskAnswers[key].trim().length > 0) {
                                if(wrongAnswersArr.indexOf(i) == -1) wrongAnswersArr.push(i);
                                if(!wrongAnswersObj[i]) wrongAnswersObj[i] = [];
                                wrongAnswersObj[i].push(key);
                                errors++;
                            } else {
                                if(skippedAnswersArr.indexOf(i) == -1) skippedAnswersArr.push(i);
                                if(!skippedAnswersObj[i]) skippedAnswersObj[i] = [];
                                skippedAnswersObj[i].push(key);
                                errors++;
                            }
                        }
                    }

                    if(pointsCountingMethod === 'point-per-error1') {
                        if(correctAnswersArr.indexOf(i) > -1) {
                            if(errors == 0) {
                                pointsForTask = Number(currentTask['answer_points']['answer1_points']);
                            } else if(errors == 1) {
                                pointsForTask = Number(currentTask['answer_points']['answer1_points']) - 1;
                            }
                        }
                    } else {
                        if(correctAnswersArr.indexOf(i) > -1 && errors == 0) {
                            pointsForTask = Number(currentTask['answer_points']['answer1_points']);
                        }
                    }

                    totalPoints += pointsForTask;
                    break;
                case 'multiple':
                case 'multiple-thin':
                case 'multiple-wide':
                    if(typeof taskAnswers === 'undefined') break;

                    taskAnswers.forEach(function (answer) {
                        var answerPoints = correctAnswers[i][answer + '_points'];

                        if ($.isNumeric(answerPoints) && answerPoints > 0) {
                            if(correctAnswersArr.indexOf(i) == -1) correctAnswersArr.push(i);
                            if(!rightAnswersObj[i]) rightAnswersObj[i] = [];
                            rightAnswersObj[i].push(answer);
                            pointsForTask += Number(answerPoints);
                        } else {
                            if(wrongAnswersArr.indexOf(i) == -1) wrongAnswersArr.push(i);
                            if(!wrongAnswersObj[i]) wrongAnswersObj[i] = [];
                            wrongAnswersObj[i].push(answer);
                        }
                    });

                    taskMaxPoints = 0;
                    taskMaxRightAnswers = 0;
                    for(var points in currentTask['answer_points']) {
                        if(!currentTask['answer_points'].hasOwnProperty(points)) continue;

                        var thisAnswerPoints = Number(currentTask['answer_points'][points]);
                        taskMaxPoints += thisAnswerPoints;
                        if(thisAnswerPoints > 0) taskMaxRightAnswers++;
                    }

                    if(pointsForTask < taskMaxPoints) {
                        if(skippedAnswersArr.indexOf(i) == -1) skippedAnswersArr.push(i);
                    }

                    var singleAnswerPoints = taskMaxPoints / taskMaxRightAnswers;

                    if(pointsForTask == taskMaxPoints) {
                        pointsForTask = singleAnswerPoints;
                    } else if(pointsCountingMethod === 'point-per-error1' &&
                        pointsForTask == taskMaxPoints - singleAnswerPoints) {

                        pointsForTask = (pointsForTask / singleAnswerPoints) - 1;
                    } else {
                        pointsForTask = 0;
                    }

                    totalPoints += pointsForTask;
                    break;
                case 'collate':
                    correctAnswers = 0;
                    taskAnswers.forEach(function (answer, j) {
                        if('answer' + currentTask['collateTo'][j] === answer) {
                            if(correctAnswersArr.indexOf(i) == -1) correctAnswersArr.push(i);
                            if(!rightAnswersObj[i]) rightAnswersObj[i] = [];
                            rightAnswersObj[i].push(answer);
                            correctAnswers += 1;
                        } else {
                            if(wrongAnswersArr.indexOf(i) == -1) wrongAnswersArr.push(i);
                            if(!wrongAnswersObj[i]) wrongAnswersObj[i] = [];
                            wrongAnswersObj[i].push(answer);
                        }
                    });

                    taskMaxPoints = Number(currentTask['answer_points']['answer1_points']);
                    taskMaxRightAnswers = 0;

                    currentTask['collateTo'].forEach(function(answer) {
                        if(answer) taskMaxRightAnswers++;
                    });
                    singleAnswerPoints = taskMaxPoints / taskMaxRightAnswers;

                    pointsForTask = singleAnswerPoints * correctAnswers;

                    if(pointsForTask < taskMaxPoints) {
                        if(skippedAnswersArr.indexOf(i) == -1) skippedAnswersArr.push(i);
                    }

                    if(pointsForTask == taskMaxPoints) {
                        pointsForTask = taskMaxPoints;
                    } else if(pointsCountingMethod === 'point-per-error1' &&
                        correctAnswers == taskMaxRightAnswers - 1) {

                        pointsForTask = (pointsForTask / singleAnswerPoints) - 1;
                    } else {
                        pointsForTask = 0;
                    }

                    totalPoints += pointsForTask;
                    break;
            }
        } else {
            if(Object.keys(currentTask['answers']).length == 1) {
                correctAnswer = currentTask['answers']['answer1'];
                var answerPoints = correctAnswers[i]['answer1_points'];

                if(this.makeUniformString(taskAnswers[0][1]) === this.makeUniformString(correctAnswer)) {
                    correctAnswersArr.push(i);
                    totalPoints += Number(answerPoints);
                } else if(taskAnswers[0][1].trim().length > 0) {
                    wrongAnswersArr.push(i);
                }
            } else {
                answerPoints = correctAnswers[i][taskAnswers + '_points'];

                if ($.isNumeric(answerPoints) && answerPoints > 0) {
                    //console.log2('answer for question ' + i + ' is correct');
                    totalPoints += Number(answerPoints);
                    correctAnswersArr.push(i);
                } else {
                    //console.log2('answer for question ' + i + ' is wrong');
                    wrongAnswersArr.push(i);
                }
            }
        }

        //make so that task id is present only in one of arrays
        var addCorrect = false,
            addWrong = false,
            correctIndex = $.inArray(i, correctAnswersArr),
            skippedIndex = $.inArray(i, skippedAnswersArr),
            wrongIndex = $.inArray(i, wrongAnswersArr);

        if (correctIndex > -1) {
            addCorrect = true;
            if (skippedIndex > -1) {
                addWrong = true;
                addCorrect = false;
            }
        }

        if (wrongIndex > -1) {
            addWrong = true;
            addCorrect = false;
        }

        if(addCorrect == true) {
            if(correctIndex == -1) correctAnswersArr.push(i);
        } else {
            if(correctIndex > -1) correctAnswersArr.splice(correctIndex, 1);
        }

        if(addWrong == true) {
            if(wrongIndex == -1) wrongAnswersArr.push(i);
        } else {
            if(wrongIndex > -1) wrongAnswersArr.splice(wrongIndex, 1);
        }

        return {
            totalPoints: totalPoints,
            wrongAnswersArr: wrongAnswersArr,
            correctAnswersArr: correctAnswersArr,
            skippedAnswersArr: skippedAnswersArr,
            rightAnswersObj: rightAnswersObj,
            wrongAnswersObj: wrongAnswersObj,
            skippedAnswersObj: skippedAnswersObj
        }
    },

    getMark: function(totalPoints, maxPoints) {
        var mark = '';

        if(this.config.calculateMark1 == true) {
            var mistakes = maxPoints - totalPoints;

            if(mistakes > 0 && mistakes <= 2) {
                mark = 4;
            } else if(mistakes > 2 && mistakes <= 5) {
                mark = 3;
            } else if(mistakes > 5) {
                mark = 2;
            } else {
                mark = 5;
            }
        }

        return mark;
    },

    fireworksStart: function(initLaunchQuantity, periodicLaunchQuantity) {
        var salute = this.salute = new fireworks.Salute('field');
        salute.init();
        salute.launch(initLaunchQuantity);

        this.saluteLaunches = setInterval(function() {
                salute.launch(periodicLaunchQuantity)}, 600
        );

        this.saluteLoops = setInterval(function() {
                salute.loop()}, 25
        );
    },

    fireworksStop: function() {
        clearInterval(this.saluteLaunches);
        clearInterval(this.saluteLoops);
        if(this.salute) this.salute.clearCanvas();
    },

    makeUniformString(text) {
        text = text.trim();
        text = text.replace(/\s\s+/g, " ");
        text = text.toLowerCase();

        return text;
    }


};

