//модель задания
var testApp = testApp || {};
testApp.Task = Backbone.Model.extend({
    initialize: function() {
        this.on("sync", this.syncViews);
        this.on("invalid", this.handleInvalid);
    },

    //валидация номера задания и балллов за ответы
    validate: function(attrs) {
        console.log('validating Task!!! this', this);
        var message = false;

        _.each(attrs.answer_points, function(elem, index) {
            console.log('doing validation1', elem, index);
            if(elem !== '') {
                if (!$.isNumeric(elem)) message = ' Баллы за ответы должны быть числами';
            }
        });

            if(attrs.order_num !== '') {
            if(!$.isNumeric(attrs.order_num)) message = attrs.order_num + ' Порядковый номер должен быть числом';
        }
        if(attrs.order_num < 0) message = attrs.order_num + ' Порядковый номер должен быть больше 0';

        if(message.length > 0) {
            console.log('Ошибка валидации: ' + message);
            return 'Ошибка валидации: ' + message;
        }
    },

    //синхронизирут отображение задач с новыми данными
    syncViews: function(model) {
        console.log('syncViews new model id', model.id);

        testApp.mainTestView.render();
        testApp.taskListView.render();

        //показывает сохранённую задачу и перерисовывает мат.формулы
        setTimeout(function() {
            testApp.mainTestView.showTask(Number(model.id));
            testApp.testEdit.showTask(Number(model.id));
            testApp.testEdit.showTaskEditBlock();
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            MathJax.Hub.Queue(["Rerender",MathJax.Hub]);
        }, 100);
    },

    //сохранение задания
    submitTask: function() {
        console.log('admin Test sumbitTask', this);

        this.save(this, {
            wait: true,
            validate: true,
            url: 'controllers/adminAjax2.php',
            dataType: 'text',
            success: function(model, response, options) {
                console.log('Successfully saved!', model, response, options);
                var newModel = $.parseJSON(response);
                newModel.order_num = Number(newModel.order_num);

                console.log('response object: ', newModel);
                testApp.testTasks.set(newModel, {remove: false});
                console.log(' that.testTasks: ', testApp.testTasks);

                var successText = 'Данные записаны!';
                testApp.testEdit.taskSaved(successText);
            },
            error: function(model, error) {
                console.log('error logs', model, error);
            }
        });
    },

    //показывает ошибку валидации
    handleInvalid: function(model, error, options) {
        console.log('validation error in Task', model, error, options);
        testApp.testEdit.showInvalidTask(error);
    }
});