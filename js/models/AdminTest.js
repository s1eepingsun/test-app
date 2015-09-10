/**
 * Created by User on 31.08.2015.
 */
/**
 Конфиг:
 testConfig: {
    taskOrder: 'inc',  //сортировка заданий
    answerOrder: 'inc' //сортировка вопросов
}
 Варианты сортировки для конфига:
 inc - по возрастанию порядкового номера (как в админке),
 dec - наоборот,
 rand - случайный порядок
 */

var AdminTest;
AdminTest = Backbone.Model.extend({
    defaults: {
        testConfig: {
            taskOrder: 'inc',
            answerOrder: 'inc'
        }
    },
    initialize: function () {
        this.data = phpTestData; //берёт данные теста из json'а посланного при загрузке страницы
        //this.correctAnswers = [];
        //this.tasksCount = 0;
        console.log('data: ', this.data);

        //сортирует по order_num
        this.prepareData();
        console.log('data after prepare: ', this.data);

        //создает коллекцию задач для TestTasks
        var modelsArr = [];
        for (var property in this.data.tasks) {
            if (this.data.tasks.hasOwnProperty(property)) {
                modelsArr.push(this.data.tasks[property]);
            }
        }
        this.modelsArr = modelsArr;

        //инициализация коллекции заданий
        this.testTasks = new TestTasks(modelsArr);
        console.log('testTasks in AdminTest: ', this.testTasks);

        //создаёт модель общей инфы о тесте
        var testInfoArr = this.data;
        delete testInfoArr['tasks'];
        this.testInfo = new TestInfo(testInfoArr);
        console.log('testInfo ', this.testInfo);

        //подключение View списка задач
        this.taskListView = new TaskListView({model: this}, {templateFile: 'side-bar-admin.hbs'});
        this.taskListView.render();
        //this.taskListView.delegateEvents(); //only needed if binding to DOM & creating new el i think

        //подключение View детального показа задач
        this.mainTestView = new MainTestView({model: this.testTasks});
        this.mainTestView.render();

        //подключение View редактирования теста
        this.testEdit = new TestEdit({model: this});
        this.testEdit.delegateEvents();
    },

    //метод вызываемый после получения ответа с сервера при сохранении общей информации о тесте
    testInfoSync: function() {
        console.log("222222222222222222222 testInfoSync ", this.testInfo);
        this.mainTestView.render();

        //перерисовывает мат.формулы
        setTimeout(function() {
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            MathJax.Hub.Queue(["Rerender",MathJax.Hub]);
        }, 100);
    },

    //метод вызываемый после получения ответа с сервера при сохранении задания
    taskEditSync: function(newModel) {
        console.log("222222222222222222222 mySync ", this.testTasks, newModel);
        console.log('new model id', newModel.id);
        var that = this;

        this.mainTestView.render();
        this.taskListView.render();

        //перерисовывает мат.формулы и показывает сохранённую задачу
        setTimeout(function() {
            that.selectTask(newModel.id);
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            MathJax.Hub.Queue(["Rerender",MathJax.Hub]);
        }, 100);

    },

    selectTask: function(id) {
        console.log('selectTask ', id);
        this.mainTestView.showTask(id);
        this.testEdit.showTask(Number(id) );
    },

    //сохранение общей информации о тесте
    submitTestInfo: function(e, formDataObj) {
        var that = this;
        var model = new TestInfo(formDataObj);
        console.log('modelToSave ', model);

        this.testInfo.save(model, {
            wait: true,
            validate: true,
            dataType: 'text',
            success: function(model, response, options) {
                console.log('Successfully saved!', model, response, options);
                var newModel = $.parseJSON(response);
                console.log('response object: ', newModel);
                that.testInfo.set(newModel, {remove: false});
                console.log(' that.testInfo: ', that.testInfo);

                //синхронизировать с сервером
                that.testInfoSync(newModel);
            },
            error: function(model, error) {
                console.log('error logs', model, error);
            }
        });

    },

    //сохранение задания
    submitTask: function(e, formDataObj) {
        var that = this;
        var model = new Task(formDataObj);
        console.log('modelToSave ', model);
        console.log('admin Test sumbitTask', this);

        model.save(model, {
            wait: true,
            validate: true,
            dataType: 'text',
            success: function(model, response, options) {
                console.log('Successfully saved!', model, response, options);
                var newModel = $.parseJSON(response);
                newModel.order_num = Number(newModel.order_num);
                console.log('response object: ', newModel);
                that.testTasks.set(newModel, {remove: false});
                console.log(' that.testTasks: ', that.testTasks);

                //синхронизировать с сервером
                that.taskEditSync(newModel);
            },
            error: function(model, error) {
                console.log('error logs', model, error);
            }
        });
    },

    //сортирует задания по order_num
    prepareData: function() {
        var data = this.data;

        //сортировка заданий по order_num
        var sorted = _.sortBy(data.tasks, 'order_num');
        data.tasks = {};
        sorted.forEach(function(item, i) {
            data.tasks[i + 1] = item; //if not put +1 here, 0 index will break assignments
        });

        this.data = data;
        console.log('this.correctAnswers: ', this.correctAnswers);
    }

});