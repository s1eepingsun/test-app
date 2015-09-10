//модель общей информации о тесте
var TestInfo = Backbone.Model.extend({
    url: 'controllers/adminAjax2.php',
    initialize: function() {
        this.on("invalid", this.handleInvalid);
    },

    //валидация времени на выполнение теста
    validate: function(attrs) {
        console.log('validating TestInfo!!!', attrs);
        var message = false;

        attrsToValidate = [attrs.test_hours, attrs.test_minutes, attrs.test_seconds];
        console.log('attrsToValidate', attrsToValidate);

        attrsToValidate.forEach(function(item, i) {
            console.log('doing validation2', item, i);
            if(!$.isNumeric(item)) message = ' Время на выполнение должно быть указано числами';
            if(item < 0) message = ' Время не должно содержать отрицательных значений';
        });

        if(message.length > 0) {
            console.log('Ошибка валидации: ' + message);
            return 'Ошибка валидации: ' + message;
        }
    },

    //сохранение общей информации о тесте
    submitInfo: function(formDataObj) {
        console.log('admin Test sumbitTask', this, formDataObj);

        this.save(formDataObj, {
            wait: true,
            validate: true,
            url: 'controllers/adminAjax2.php',
            dataType: 'text',
            success: function(model, response, options) {
                console.log('Successfully saved!', model, response, options);

                var successText = 'Данные записаны!';
                adminTestApp.testEdit.testInfoSaved(successText);
            },
            error: function(model, error) {
                console.log('error logs', model, error);
            }
        });
    },

    //показывает ошибку валидации
    handleInvalid: function(model, error) {
        console.log('validation error in Task', model, error);
        adminTestApp.testEdit.showInvalidTestInfo(error);
    }
});