//юнит-тесты
'use strict';
$(function() {

    //тестирование testModel
    describe("TestModel tests", function () {
        console.log2('in Jasmine:', testApp.testModel.data.tasks);
        it("testModel is defined", function () {
            expect(testApp.testModel).toBeDefined();
        });

        it("testModel.config, testModel.data, testModel.data.tasks are defined", function () {
            expect(testApp.testModel.config).toBeDefined();
            expect(testApp.testModel.data).toBeDefined();
            expect(testApp.testModel.data.tasks).toBeDefined();
        });

        it("testModel.tasksCount length > 0", function () {
            expect(testApp.testModel.tasksCount).toBeGreaterThan(0);
        });

        it("fireEvent(), listen() are defined", function () {
            expect(testApp.testModel.fireEvent).toBeDefined();
            expect(testApp.testModel.listen).toBeDefined();
        });

        it("getMergedConfig()", function () {
            expect(testApp.testModel.getMergedConfig({a: 1}, {b: 2})).toEqual({a: 1, b: 2});
        });

        it("sortByOrderNum()", function () {
            var unsorted = {tasks: {
                1: {order_num: 3},
                2: {order_num: 2},
                3: {order_num: 1}
            }};
            var sorted = {tasks: {
                1: {order_num: 1},
                2: {order_num: 2},
                3: {order_num: 3}
            }};
            expect(testApp.testModel.sortByOrderNum(unsorted)).toEqual(sorted);
        });

        it("writeDownAnswer()", function () {
            testApp.testModel.answersGiven = [];

            testApp.testModel.config.multipleChoices = false;
            expect(testApp.testModel.writeDownAnswer(3, 'answer2')).toEqual(['answer2']);
            expect(testApp.testModel.writeDownAnswer(3, 'answer3')).toEqual(['answer3']);

            testApp.testModel.config.multipleChoices = true;
            expect(testApp.testModel.writeDownAnswer(3, 'answer4')).toEqual(['answer3', 'answer4']);
            expect(testApp.testModel.writeDownAnswer(3, 'answer4')).toEqual(['answer3']);

            testApp.testModel.config.multipleChoices = false;
        });

        it("startNewTest()", function () {
            //spyOn(testApp.testController, 'setModeTestActive');
            //spyOn(testApp.testController, 'startNewTest');
            spyOn(testApp.listView, 'setModeTestActive');
            spyOn(testApp.mainView, 'setModeTestActive');
            spyOn(testApp.mainView, 'startNewTest');
            spyOn(testApp.testModel, 'testTimerStart');
            spyOn(testApp.testModel, 'showTask');

            testApp.testModel.startNewTest();

            //expect(testApp.testController.setModeTestActive).toHaveBeenCalled();
            //expect(testApp.testController.startNewTest).toHaveBeenCalled();
            expect(testApp.listView.setModeTestActive).toHaveBeenCalled();
            expect(testApp.mainView.setModeTestActive).toHaveBeenCalled();
            expect(testApp.mainView.startNewTest).toHaveBeenCalled();
            expect(testApp.testModel.testTimerStart).toHaveBeenCalled();
            expect(testApp.testModel.showTask).toHaveBeenCalledWith(1, 0);

            expect(testApp.testModel.selectedTaskID).toBe(1);
        });

        it("testTimerStart()", function () {
            spyOn(testApp.mainView, 'testTimerShow');

            testApp.testModel.testTimerStart(12345);

            spyOn(testApp.testModel.timer, 'newTimer');
            spyOn(testApp.testModel.timer, 'goDown');

            testApp.testModel.testTimerStart(12345);

            expect(testApp.mainView.testTimerShow).toHaveBeenCalledWith(12345);
            //expect(testApp.testModel.timer['newTimer']).toHaveBeenCalled();
            //expect(testApp.testModel.timer.goDown).toHaveBeenCalled();
        });

    });

    //тестирование listView
    describe("ListView tests", function () {
        beforeEach(function() {
            testApp.testModel.startNewTest();
        });

        afterAll(function() {
            testApp.testModel.startNewTest();
        });

        it("_model is defined", function () {
            expect(testApp.listView._model).toBeDefined();
        });

        it("fireEvent(), listen() are defined", function () {
            expect(testApp.listView.fireEvent).toBeDefined();
            expect(testApp.listView.listen).toBeDefined();
        });

        it("showTask()", function () {
            testApp.listView.showTask({id: 2});
            expect($.cache('.active-task').attr('id')).toBe('qn2');
        });

        it("reflectAnswers()", function () {
            testApp.listView.reflectAnswers({id: 2, answers: [1]});
            expect($.cache('#qn2').hasClass('answer-given')).toBeTruthy();

            testApp.listView.reflectAnswers({id: 2, answers: []});
            expect($.cache('#qn2').hasClass('answer-given')).not.toBeTruthy();
        });

        it("setModeTestResult()", function () {
            testApp.listView.showTask({id: 2});
            testApp.listView.setModeTestResult();
            expect($.cache('#qn2').hasClass('active-task')).not.toBeTruthy();
        });

        it("setModeTestActive()", function () {
            testApp.listView.reflectAnswers({id: 2, answers: [1]});
            testApp.listView.setModeTestActive();
            expect($.cache('#qn2').hasClass('answer-given')).not.toBeTruthy();
        });

        it("showResult()", function () {
            var data = {
                allAnswered: [1, 2],
                correctAnswers: [1]
            };
            testApp.listView.showResult(data);
            expect($.cache('#qn1').hasClass('answered-right')).toBeTruthy();
            expect($.cache('#qn2').hasClass('answered-wrong')).toBeTruthy();
        });

        it("checking if click on item from the list calls model method with right id", function () {
            spyOn(testApp.testController, 'sidebarClick');
            spyOn(testApp.testModel, 'sidebarClick');
            $.cache('#left-side-bar').find('.task-item:eq(1)').click();

            expect(testApp.testModel.sidebarClick).toHaveBeenCalledWith(2);
            //expect(testApp.testController.sidebarClick).toHaveBeenCalled(); //don't get why doesn't it work
        });

    });

    //тестирование Timer
    describe("Timer tests", function () {
        it('properties check', function() {
            var timer = new Timer(1000, 2);
            expect(timer._time).toBe(1000);
            expect(timer._interval).toBe(1000/2);
        });

        it('fireEvent()', function() {
            var that = this;
            var timer = new Timer();
            this.testVar = 1;
            function eventTest() {
                that.testVar = 2;
            }
            (new Observable).listen('eventTest', eventTest);
            timer.fireEvent('eventTest');

            expect(this.testVar).toBe(2);
        });

        it('newTimer()', function() {
            var timer = new Timer(1000, 2);
            timer.newTimer();
            var armageddon = new Date(2012, 12, 31).getTime();
            expect(timer.testStarted).toBeDefined();
            expect(timer.testStarted).toBeGreaterThan(armageddon);
            expect(timer.timeNow).toBe(1000);
        });

        it('goDown()', function() {
            jasmine.clock().install();
            testApp.testModel.startNewTest();
            var timer = new Timer(2000, 2);
            timer.timeNow = 2000;
            this.eventTest = function eventTest() {};
            spyOn(this, 'eventTest');
            timer.goDown('testEvent');
            (new Observable).listen('testEvent', this.eventTest);
            jasmine.clock().tick(501);

            expect(this.eventTest).toHaveBeenCalled();
            jasmine.clock().uninstall();
        });

        it('goUp()', function() {
            jasmine.clock().install();
            testApp.testModel.startNewTest();
            var timer = new Timer(2000, 2);
            timer.timeNow = 2000;
            this.eventTest = function eventTest() {};
            spyOn(this, 'eventTest');
            timer.goUp('testEvent');
            (new Observable).listen('testEvent', this.eventTest);
            jasmine.clock().tick(501);

            expect(this.eventTest).toHaveBeenCalled();
            jasmine.clock().uninstall();
        });

        it('stop()', function() {
            jasmine.clock().install();
            var start = new Date(2012, 12, 31).getTime();
            var that = this;
            this.counter = 10;
            var timer = new Timer(20000, 2);
            timer.activeTimer = setInterval(function() {
                that.counter -= 1;
            }, 500);
            timer.stop();
            jasmine.clock().tick(4000);
            expect(that.counter).toBeGreaterThan(8);
            expect(timer.testEnded).toBeGreaterThan(start);
            jasmine.clock().uninstall();
        });

        it('getTimeSpent()', function() {
            var timer = new Timer();
            timer.testStarted = 100;
            timer.testEnded = 123;
            var timeSpent = timer.getTimeSpent();
            expect(timeSpent).toBe(23);
        });

        it('timeObToString()', function() {
            var timeObject = {h: 1, m: 2, s: 3};
            var timeString = '1:02:03';
            var newString = Timer.prototype.timeObToString(timeObject);
            expect(newString).toBe(timeString);
        });

        it('timeToObject()', function() {
            var timestamp = (60 * 60 * 4 + 60 * 3 + 2) * 1000;
            var timeObject = {h: [4], m: [3], s: 2};
            var newObject = Timer.prototype.timeToObject(timestamp);
            expect(newObject).toEqual(timeObject);
        });
    });
});