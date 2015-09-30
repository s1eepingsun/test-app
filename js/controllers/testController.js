var testApp = testApp || {};
testApp.TestController = function(model, mainView, listView) {
    this._model = model;
    this._mainView = mainView;
    this._listView = listView;
};

//добавление возможности запускать и слушать события
extend(testApp.TestController, Observable);

//метод для запуска событий
testApp.TestController.prototype.fireEvent = function(type, data, context) {
    this.constructor.superclass.fireEvent(type, data, context);
};

//метод для прослушивания событий
testApp.TestController.prototype.listen = function(type, method, scope, context) {
    this.constructor.superclass.listen(type, method, scope, context);
};

//метод который запускается сразу после инициализации объекта
testApp.TestController.prototype.init = function () {
    console.log('TestController ', this);

    //event listeners
    this.listen('view:sidebarClick', this.sidebarClick, this);
    this.listen('view:clickStart', this.clickStart, this);
    this.listen('view:clickFinish', this.clickFinish, this);
    this.listen('view:clickPrev', this.clickPrev, this);
    this.listen('view:clickNext', this.clickNext, this);
    this.listen('view:giveAnswer', this.giveAnswer, this);
    this.listen('model:showTask', this.showTask, this);
    this.listen('model:reflectAnswers', this.reflectAnswers, this);
    this.listen('model:setModeTestActive', this.setModeTestActive, this);
    this.listen('model:startNewTest', this.startNewTest, this);
    this.listen('model:showResult', this.showResult, this);
    this.listen('model:testTimerShow', this.testTimerShow, this);
    this.listen('model:taskTimerShow', this.taskTimerShow, this);
    this.listen('model:disableFreeTaskChange', this.disableFreeTaskChange, this);
    this.listen('model:disablePrevButtons', this.disablePrevButtons, this);
    this.listen('model:disableNextButtons', this.disableNextButtons, this);
    this.listen('model:enablePrevButtons', this.enablePrevButtons, this);
    this.listen('model:enableNextButtons', this.enableNextButtons, this);
};

//клик на задачу на сайдбаре
testApp.TestController.prototype.sidebarClick = function (observable, eventType, data) {
    this._model.sidebarClick(data);
};

//показывает задачу
testApp.TestController.prototype.showTask = function (observable, eventType, data) {
    this._mainView.showTask(data);
    this._listView.showTask(data);
};

//даёт ответ на задачу
testApp.TestController.prototype.giveAnswer = function (observable, eventType, data) {
    this._model.giveAnswer(data);
};

//визуально отображает данные ответы
testApp.TestController.prototype.reflectAnswers = function (observable, eventType, data) {
    this._mainView.reflectAnswers(data);
    this._listView.reflectAnswers(data);
};

//даёт ответ на задачу
testApp.TestController.prototype.clickStart = function () {
    this._model.startNewTest();
};

//даёт ответ на задачу
testApp.TestController.prototype.setModeTestActive = function () {
    this._mainView.setModeTestActive();
    this._listView.setModeTestActive();
};

//клик на "Новый тест"
testApp.TestController.prototype.startNewTest = function () {
    this._mainView.startNewTest();
};

//клик на "Закончить тест"
testApp.TestController.prototype.clickFinish = function () {
    this._model.finishTest();
};

//показывает предыдущую задачу
testApp.TestController.prototype.clickPrev = function () {
    this._model.showPrevTask();
};

//показывает следующую задачу
testApp.TestController.prototype.clickNext = function () {
    this._model.showNextTask();
};

//показывает результат прохождения теста
testApp.TestController.prototype.showResult = function (observable, eventType, data) {
    this._mainView.showResult(data);
    this._listView.showResult(data);
};

//показывает результат прохождения теста
testApp.TestController.prototype.disableFreeTaskChange = function () {
    this._mainView.disableFreeTaskChange();
};

//отображает таймер теста
testApp.TestController.prototype.testTimerShow = function (observable, eventType, data) {
    this._mainView.testTimerShow(data);
};

//отображает таймер отдельной задачи
testApp.TestController.prototype.taskTimerShow = function (observable, eventType, data) {
    this._mainView.taskTimerShow(data);
};

//отключает кнопки "предыдущий вопрос"
testApp.TestController.prototype.disablePrevButtons = function () {
    this._mainView.disablePrevButtons();
};

//отключает кнопки "следующий вопрос"
testApp.TestController.prototype.disableNextButtons = function () {
    this._mainView.disableNextButtons();
};

//делает кнопки "предыдущий вопрос" активными
testApp.TestController.prototype.enablePrevButtons = function () {
    this._mainView.enablePrevButtons();
};

//делает кнопки "следующий вопрос" активными
testApp.TestController.prototype.enableNextButtons = function () {
    this._mainView.enableNextButtons();
};



