var testApp = testApp || {};
testApp.TestController = function (model, mainView, listView, horizontalListView) {
    this._model = model;
    this._mainView = mainView;
    this._listView = listView;
    this._horizontalListView = horizontalListView;
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
        this.listen('view:clickFinishNoMatterWhat', this.clickFinishNoMatterWhat, this);
        this.listen('view:clickPrev', this.clickPrev, this);
        this.listen('view:clickNext', this.clickNext, this);
        this.listen('view:giveAnswer', this.giveAnswer, this);
        this.listen('view:acceptOptions', this.acceptOptions, this);
        this.listen('view:submitOptions', this.submitOptions, this);
        this.listen('view:clickShowWrongs', this.clickShowWrongs, this);
        this.listen('view:clickShowAllAnswers', this.clickShowAllAnswers, this);
        this.listen('view:showUnanswered', this.showUnanswered, this);
        this.listen('view:showPrevTest', this.showPrevTest, this);
        this.listen('view:selectTestFromList', this.selectTestFromList, this);
        this.listen('view:confirmAnswer', this.confirmAnswer, this);
        this.listen('view:trainingBtnClick', this.trainingBtnClick, this);
        this.listen('view:newTestBtnClick', this.newTestBtnClick, this);
        this.listen('view:clickQuitConfirm', this.clickQuitConfirm, this);
        this.listen('view:collateAnswerClick', this.collateAnswerClick1, this);
        this.listen('view:musicPlayClick', this.musicPlayClick, this);
        this.listen('view:musicStopClick', this.musicStopClick, this);
        this.listen('view:immediateAnswersOn', this.immediateAnswersOn, this);

        this.listen('model:showTask', this.showTask, this);
        this.listen('model:reflectAnswers', this.reflectAnswers, this);
        this.listen('model:setModeTestActive', this.setModeTestActive, this);
        this.listen('model:setModeTraining', this.setModeTraining, this);
        this.listen('model:startNewTest', this.startNewTest, this);
        this.listen('model:showResult', this.showResult, this);
        this.listen('model:testTimerShow', this.testTimerShow, this);
        this.listen('model:testTimeSpentShow', this.testTimeSpentShow, this);
        this.listen('model:taskTimerShow', this.taskTimerShow, this);
        this.listen('model:disableFreeTaskChange', this.disableFreeTaskChange, this);
        this.listen('model:optionsFormDataNotValid', this.optionsFormDataNotValid, this);
        this.listen('model:optionsFormDataAccepted', this.optionsFormDataAccepted, this);
        this.listen('model:showTrainingAnswer', this.showTrainingAnswer, this);
        this.listen('model:showGivenAnswers', this.showGivenAnswers, this);
        this.listen('model:disableNext', this.disableNext, this);
        this.listen('model:showWrongs', this.showWrongs, this);
        this.listen('model:showAllAnswers', this.showAllAnswers, this);
        this.listen('model:promptUnanswered', this.promptUnanswered, this);
        this.listen('model:promptQuitTest', this.promptQuitTest, this);
        this.listen('model:collateHighlightPending', this.collateHighlightPending, this);
        this.listen('model:collateHighlightChoices', this.collateHighlightChoices, this);
        this.listen('model:collateHighlightComplete', this.collateHighlightComplete, this);
        this.listen('model:collateHighlightOff', this.collateHighlightOff, this);
        this.listen('model:makePlayerUnblockable', this.makePlayerUnblockable, this);
        this.listen('model:blockAudioPlayers', this.blockAudioPlayers, this);
        this.listen('model:adjustTipsNum', this.adjustTipsNum, this);
        this.listen('model:stopPlayer', this.stopPlayer, this);
        this.listen('model:hidePromptUnanswered', this.hidePromptUnanswered, this);
        this.listen('model:showConfirmButton', this.showConfirmButton, this);

        this.listen('timer:timerTick', this.timerTick, this);
    },

    //клик на задачу на сайдбаре
    sidebarClick: function (observable, eventType, data) {
        this._model.sidebarClick(data);
    },

    //показывает задачу
    showTask: function (observable, eventType, data) {
        this._mainView.showTask(data);
        if (this._listView) this._listView.showTask(data);
        if (this._horizontalListView) this._horizontalListView.showTask(data);
    },

    //даёт ответ на задачу
    giveAnswer: function (observable, eventType, data) {
        this._model.giveAnswer(data);
    },

    //визуально отображает данные ответы
    reflectAnswers: function (observable, eventType, data) {
        this._mainView.reflectAnswers(data);
        if (this._listView) this._listView.reflectAnswers(data);
        if (this._horizontalListView) this._horizontalListView.reflectAnswers(data);
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
        if (this._listView) this._listView.setModeTestActive();
        if (this._horizontalListView) this._horizontalListView.setModeTestActive();
    },

    setModeTraining: function () {
        this._mainView.setModeTraining();
        //if(this._listView) this._listView.setModeTraining();
        //if(this._horizontalListView) this._horizontalListView.setModeTraining();
    },

    //клик на "Новый тест"
    startNewTest: function () {
        this._mainView.startNewTest();
    },

    //клик на "Закончить тест"
    clickFinish: function () {
        this._model.clickFinish();
    },

    clickFinishNoMatterWhat: function () {
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
        if (this._listView) this._listView.showResult(data);
        if (this._horizontalListView) this._horizontalListView.showResult(data);
    },

    //отключает и убирает кнопки "предыдущий вопрос"
    disableFreeTaskChange: function () {
        this._mainView.disableFreeTaskChange();
    },

    //отображает таймер теста
    testTimerShow: function (observable, eventType, data) {
        this._mainView.testTimerShow(data);
    },

    testTimeSpentShow: function (observable, eventType, now) {
        this._mainView.testTimeSpentShow(now);
    },

    //отображает таймер отдельной задачи
    taskTimerShow: function (observable, eventType, data) {
        this._mainView.taskTimerShow(data);
    },

    //передаёт каждое изменение времени таймера
    timerTick: function (observable, eventType, data) {
        this._model.timersTick(data);
    },

    confirmAnswer: function (observable, eventType, id) {
        this._model.confirmAnswer(id);
    },

    acceptOptions: function (observable, eventType, data) {
        this._model.acceptOptions(data);
    },

    submitOptions: function (observable, eventType, formData) {
        this._model.submitOptions(formData);
    },

    optionsFormDataNotValid: function (observable, eventType, message) {
        this._mainView.optionsFormDataNotValid(message);
    },

    optionsFormDataAccepted: function () {
        this._mainView.optionsFormDataAccepted();
    },

    showTrainingAnswer: function (observable, eventType, data) {
        this._mainView.showTrainingAnswer(data);
        if (this._listView) this._listView.showTrainingAnswer(data);
        if (this._horizontalListView) this._horizontalListView.showTrainingAnswer(data);
    },

    showGivenAnswers: function (observable, eventType, data) {
        this._mainView.showGivenAnswers(data);
    },

    disableNext: function () {
        this._mainView.disableNextButtons();
    },

    promptUnanswered: function () {
        this._mainView.promptUnanswered();
    },

    clickShowWrongs: function (observable, eventType, data) {
        this._model.showWrongs(data);
    },
    clickShowAllAnswers: function () {
        this._model.showAllAnswers();
    },

    showUnanswered: function () {
        this._model.showUnanswered();
    },

    selectTestFromList: function (observable, eventType, data) {
        this._model.selectTestFromList(data);
    },

    trainingBtnClick: function () {
        this._model.quitTestCheck('trainingBtnClick');
    },

    showPrevTest: function () {
        this._model.quitTestCheck('showPrevTest');
    },

    newTestBtnClick: function() {
        this._model.quitTestCheck('newTestBtnClick');
    },

    clickQuitConfirm: function(observable, eventType, event) {
        this._model.quitTestConfirm(event);
    },

    collateAnswerClick1: function(observable, eventType, data) {
        this._model.collateAnswerClick(data);
    },

    musicPlayClick: function(observable, eventType, id) {
        this._model.musicPlayClick(id);
    },

    musicStopClick: function(observable, eventType, id) {
        this._model.musicStopClick(id);
    },

    immediateAnswersOn: function() {
        this._model.immediateAnswersOn();
    },

    collateHighlightPending: function (observable, eventType, data) {
        this._mainView.collateHighlightPending(data);
    },

    collateHighlightComplete: function (observable, eventType, data) {
        this._mainView.collateHighlightComplete(data);
    },

    collateHighlightChoices: function (observable, eventType, data) {
        this._mainView.collateHighlightChoices(data);
    },

    collateHighlightOff: function (observable, eventType, data) {
        this._mainView.collateHighlightOff(data);
    },

    showWrongs: function (observable, eventType, wrongAnswersArr) {
        this._mainView.showWrongs(wrongAnswersArr);
        if (this._listView) this._listView.removeSelection();
        if (this._horizontalListView) this._horizontalListView.removeSelection();
    },

    promptQuitTest: function (observable, eventType, event) {
        this._mainView.promptQuitTest(event);
    },

    makePlayerUnblockable: function (observable, eventType, id) {
        this._mainView.makePlayerUnblockable(id);
    },

    adjustTipsNum: function (observable, eventType, tipsLeft) {
        this._mainView.adjustTipsNum(tipsLeft);
    },

    stopPlayer: function (observable, eventType, id) {
        this._mainView.stopPlayer(id);
    },

    blockAudioPlayers: function (observable, eventType, tipsTaken) {
        this._mainView.blockAudioPlayers(tipsTaken);
    },

    showConfirmButton: function (observable, eventType, id) {
        this._mainView.showConfirmButton(id);
    },

    hidePromptUnanswered: function () {
        this._mainView.hidePromptUnanswered();
    }


};

