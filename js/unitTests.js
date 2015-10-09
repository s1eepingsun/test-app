//юнит-тесты
$(function() {

    //тестирование testModel
    describe("TestModel tests", function () {
        console.log2('in Jasmine:', testApp.testModel.data.tasks);
        console.log2('testing my own logs module:)', 1, 2, 3, 4, 5);
        it("testModel is defined", function () {
            expect(testApp.testModel).toBeDefined();
        });

        it("testModel.config, testModel.data, testModel.data.tasks are defined", function () {
            expect(testApp.testModel.config).toBeDefined();
            expect(testApp.testModel.data).toBeDefined();
            expect(testApp.testModel.data.tasks).toBeDefined();
        });

        it("testModel.tasksCount length > 0 ", function () {
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
        });


    });

    //тестирование listView
    describe("ListView tests", function () {
        it("fireEvent(), listen() are defined", function () {
            expect(testApp.listView.fireEvent).toBeDefined();
            expect(testApp.listView.listen).toBeDefined();
        });

        it("_model is defined", function () {
            expect(testApp.listView._model).toBeDefined();
        });

        it("showTask()", function () {
            expect(testApp.listView.showTask({id: 3})).toBe(3);
        });


    });


});