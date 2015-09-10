var TestEdit;
TestEdit = Backbone.View.extend({
    el: '.editors-block',
    initialize: function () {
        var that = this;
        console.log('testEdit init');
        //this.on("invalid", this.showInvalid);

        setTimeout(function() {
            that.showTestInfo();
        }, 800);
    },
    events: {
        'click #task-form input[type="submit"]': 'submitTask',
        'click #task-form button.delete': 'deleteTask',
        'click #test-general-form input[type="submit"]': 'submitTestInfo',
        'click .create-new-task': 'clearTaskBlock',//clears all data, id & shows task block
        'click .edit-task-block': 'showTaskEditBlock',
        'click .edit-test-info': 'showTestInfoBlock'
    },

    //удаляет задание
    deleteTask: function(e) {
        var that = this;
        var id = $(e.currentTarget).parents('form').find('input[name="id"]').val();
        console.log('Delete id: ', id);
        console.log('this model: ', adminTestApp.testTasks.get(id));
        var model = adminTestApp.testTasks.get(id);
        if(typeof model === 'undefined') {
            var errorText = 'Ошибка: У сохраняемой модели нет id';
            this.showInvalidTask(errorText);
            return;
        }

        model.destroy({
            wait:true,
            dataType: 'text',
            success: function(model, response, options) {
                console.log('Successfully destroyed!', model, response, options);
                var successText = 'Задание удалено!';
                that.taskSaved(successText);
            },
            error: function(model, error) {
                console.log('error logs', model, error);
            }
        });
    },

    //отправляет данные задания из формы в модель для сохранения изменений
    submitTask: function(e) {
        console.log('testEdit submit Task: ', this, e);
        console.log('size of collection: ', _.size(adminTestApp.testTasks.models));

        setTimeout(function() {//без таймаута на сервер отправляются путые строки вместо данных из ckeditor
            var formDataArr = $('#task-form').serializeArray();
            console.log('formDataArr : ', formDataArr);

            //запись данных из формы в объект
            var formDataObj = {};
            formDataObj['answers'] = {};
            formDataObj['answer_points'] = {};
            var expr1 = /answer[0-9]$/;
            var expr2 = /answer[0-9]_points$/;
            var maxPoints = 0;

            formDataArr.forEach(function(item) {
                if(expr1.test(item.name)) {
                    if(item.value != '') {
                        formDataObj['answers'][item.name] = item.value;
                    }
                } else if(expr2.test(item.name)) {
                    formDataObj['answer_points'][item.name] = item.value;
                    maxPoints += Number(item.value);
                } else {
                    formDataObj[item.name] = item.value;
                }
            });

            console.log('formDataObj ', formDataObj);
            var newTask = new Task(formDataObj);
            newTask.submitTask();

        }, 200);
    },

    //отправляет общие данные теста из формы в модель для сохранения на сервер
    submitTestInfo: function(e) {
        console.log('testEdit submit test info: ', this, e);
        console.log('size of collection: ', _.size(adminTestApp.testTasks));
        setTimeout(function() {//без таймаута на сервер отправляются путые строки вместо данных из ckeditor
            var formDataArr = $('#test-general-form').serializeArray();
            console.log('formDataArr : ', formDataArr);

            //запись данных из формы в объект
            var formDataObj = {};
            formDataArr.forEach(function(item) {
                formDataObj[item.name] = item.value;
            });
            if(formDataObj.id == '') delete formDataObj.id;
            console.log('formDataObj ', formDataObj);

            //сохранение новых данных
            adminTestApp.testInfo.submitInfo(formDataObj);
        }, 200);
    },

    //заполняет форму редактирования задания данными задания id
    showTask: function(id) {
        console.log('testEdit show Task: ', id);
        console.log('this: ', this);
        if(typeof adminTestApp.testTasks.get(id) === 'undefined') return;
        var data = adminTestApp.testTasks.get(id)['attributes'];
        console.log('this.model', adminTestApp.testTasks);
        console.log('this.model.get(id)', adminTestApp.testTasks.get(id));
        console.log('data', data);

        for (var property in data.answers) {
            if (data.answers.hasOwnProperty(property)) {
                var answerID = property.substring(6);
                var ckEditorID = '#cke_editor-a' + answerID;
                $(ckEditorID + ' .cke_wysiwyg_frame').contents().find('body').html(data.answers[property]);
            }
        }

        for(property in data.answer_points) {
            if (data.answer_points.hasOwnProperty(property)) {
                $('#task-form input[name="' + property + '"]').val(data.answer_points[property]);
            }
        }

        $('#task-form').find('input[name="order_num"]').val(data.order_num);
        $('#task-form').find('input[name="type"]').val(data.type);
        $('#cke_editor1').find('.cke_wysiwyg_frame').contents().find('body').html(data.task_content);
        $('#task-form').find('input[type="hidden"]').val(data.id);
    },

    //заполняет форму редактирования общих данных о тесте
    showTestInfo: function() {
        var data = adminTestApp.testInfo.attributes;
        console.log('showTestInfo ', data);

        $('#cke_editor-d1').find('.cke_wysiwyg_frame').contents().find('body').html(data.description);
        $('#cke_editor-d2').find('.cke_wysiwyg_frame').contents().find('body').html(data.in_task_description);
        $('#cke_editor-m1').find('.cke_wysiwyg_frame').contents().find('body').html(data.start_message);

        $('#test-general-form').find('input[name="test_hours"]').val(data.timerData.h);
        $('#test-general-form').find('input[name="test_minutes"]').val(data.timerData.m);
        $('#test-general-form').find('input[name="test_seconds"]').val(data.timerData.s);

        //убрирает показ ошибки валидации задания
        $('#task-form .response').hide();
    },

    //показ ошибок валидации в задаче
    showInvalidTask: function(error) {
        console.log('Ошибка валидации: ', error);
        $('#task-form .response').html(error);
        $('#task-form .response').show();
    },

    //показ ошибок валидации в общей информации о тесте
    showInvalidTestInfo: function(error) {
        console.log('Ошибка валидации: ', error);
        $('#test-general-form .response').html(error);
        $('#test-general-form .response').show();
    },

    //показывает что данные записаны успешно
    taskSaved: function(successText) {
        $('#task-form .response').html(successText);
        $('#task-form .response').show();
    },

    //показывает что данные записаны успешно
    testInfoSaved: function(successText) {
        $('#test-general-form .response').html(successText);
        $('#test-general-form .response').show();
    },

    //показывает блок редактирования общих данных о тесте
    showTestInfoBlock: function() {
        $('#task-form').hide();
        $('#test-general-form').show();
    },

    //показывает блок редактирования задания
    showTaskEditBlock: function() {
        $('#task-form').show();
        $('#test-general-form').hide();
    },

    //обнуляет данные в форме редактирования задания (включая id)
    clearTaskBlock: function() {
        $('#cke_editor1').find('.cke_wysiwyg_frame').contents().find('body').html('');
        $('#task-form').find('input[name="order_num"]').val('');
        $('#task-form').find('input[name="type"]').val('');
        $('#task-form').find('input[type="hidden"]').val('');//обнуляет id
        for(var i = 1; i<=6; i++) {
            $('#cke_editor-a' + i).find('.cke_wysiwyg_frame').contents().find('body').html('');
            $('#task-form input[name="answer' + i + '_points"]').val('');
        }

        //показывает блок редактирования задания
        $('#task-form').show();
        $('#test-general-form').hide();
    }

});