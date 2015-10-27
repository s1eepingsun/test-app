var testApp = testApp || {};
testApp.TestController = function(model, mainView, listView) {
    this._model = model;
    this._mainView = mainView;
    this._listView = listView;
};

testApp.TestController.prototype = {
    //метод для запуска событий
    fireEvent: function (type, data, context) {
        //var fireEvent = JSON.parse(JSON.stringify(Observable.prototype.fireEvent));
        Observable.prototype.fireEvent(type, data, context);
        //fireEvent(type, data, context);
    },

    //метод для прослушивания событий
   listen: function (type, method, scope, context) {
        //var listen = JSON.parse(JSON.stringify(Observable.prototype.listen));
       Observable.prototype.listen(type, method, scope, context);
        //listen(type, method, scope, context);
    },

    //метод который запускается сразу после инициализации объекта
    init: function () {
        /*this._model = testApp.testModel;
        this._mainView = testApp.mainView;
        this._listView = testApp.listView;
        console.log2('TestController init ', this);*/

        //event listeners
        this.listen('view:sidebarClick', this.sidebarClick, this);
        this.listen('view:clickStart', this.clickStart, this);
        this.listen('view:clickFinish', this.clickFinish, this);
        this.listen('view:clickPrev', this.clickPrev, this);
        this.listen('view:clickNext', this.clickNext, this);
        this.listen('view:giveAnswer', this.giveAnswer, this);
        this.listen('view:acceptOptions', this.acceptOptions, this);

        this.listen('model:showTask', this.showTask, this);
        this.listen('model:reflectAnswers', this.reflectAnswers, this);
        this.listen('model:setModeTestActive', this.setModeTestActive, this);
        this.listen('model:startNewTest', this.startNewTest, this);
        this.listen('model:showResult', this.showResult, this);
        this.listen('model:testTimerShow', this.testTimerShow, this);
        this.listen('model:taskTimerShow', this.taskTimerShow, this);
        this.listen('model:disableFreeTaskChange', this.disableFreeTaskChange, this);

        this.listen('timer:timerTick', this.timerTick, this);
    },

    //клик на задачу на сайдбаре
    sidebarClick: function (observable, eventType, data) {
        this._model.sidebarClick(data);
    },

    //показывает задачу
    showTask: function (observable, eventType, data) {
        this._mainView.showTask(data);
        this._listView.showTask(data);
    },

    //даёт ответ на задачу
    giveAnswer: function (observable, eventType, data) {
        this._model.giveAnswer(data);
    },

    //визуально отображает данные ответы
    reflectAnswers: function (observable, eventType, data) {
        this._mainView.reflectAnswers(data);
        this._listView.reflectAnswers(data);
    },

    //даёт ответ на задачу
    clickStart: function () {
        //console.log2('controller clickStart testApp.testModel.data', testApp.testModel.data);
        //console.log2('controller clickStart testApp.testModel.data', testApp.testModel.data);
        console.log2('controller clickStart this._model.data', this._model.data);
        this._model.startNewTest();
    },

    //включение стилей для прохождения теста
    setModeTestActive: function () {
        this._mainView.setModeTestActive();
        this._listView.setModeTestActive();
    },

    //клик на "Новый тест"
    startNewTest: function () {
        this._mainView.startNewTest();
    },

    //клик на "Закончить тест"
    clickFinish: function () {
        this._model.finishTest();
    },

    //показывает предыдущую задачу
    clickPrev: function () {
        this._model.showPrevTask();
    },

    //показывает следующую задачу
    clickNext: function () {
        this._model.showNextTask();
    },

    //показывает результат прохождения теста
    showResult: function (observable, eventType, data) {
        this._mainView.showResult(data);
        this._listView.showResult(data);
    },

    //отключает и убирает кнопки "предыдущий вопрос"
    disableFreeTaskChange: function () {
        this._mainView.disableFreeTaskChange();
    },

    //отображает таймер теста
    testTimerShow: function (observable, eventType, data) {
        this._mainView.testTimerShow(data);
    },

    //отображает таймер отдельной задачи
    taskTimerShow: function (observable, eventType, data) {
        this._mainView.taskTimerShow(data);
    },

    //передаёт каждое изменение времени таймера
    timerTick: function (observable, eventType, data) {
        this._model.timersTick(data);
    },

    acceptOptions: function (observable, eventType, data) {
        this._model.acceptOptions(data);
    }

};

