console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
    console.log("init");
}

$(function() {
    /**
     * метод инициализирует тест
     * Пояснения к конфигу:
     * answerOrder - сортировка ответов: 'rand' - случайный порядок, 'dec' - по убыванию order_num
     * taskTimer - использовать ли индивидуальный таймер для каждой задачи
     * taskTimerMode - 'inc' - отчитывает время с нуля, 'dec' - обратный отчёт со времени заданного в админке
     * freeTaskChange - позволить ли свободно переключать задачи? (иначе только по порядку)
     * lastTaskFinish - заканчивать тест после ответа на последний вопрос
     * multipleChoices - позволяет выбирать несколько ответов на один вопрос одновременно
     * navInResult - включить кнопки навигации "след. вопрос" & "пред. вопрос" при показе результата
     * resultAnswersStyle - стиль отображения ответов при показе результатов теста:
     *      по умолчанию - закрашивает неправильные и закрашивает правильные с более высоким приоритетом;
     *      'wrong-borders' - все правильные ответы - зелёный фон, все данные ответы: правильные - чёрная граница, неправильные - красная границей;
     *      'answered-borders' - все правильные ответы - зелёный фон, все данные ответы - чёрная граница, неправильные данные ответы - красный фон
     *      'right-wrong-borders' - все данные ответы - серай фон, правильные - зелёная граница, неправильные - красная граница
     */
    testApp.init({
        config: {
            answerOrder: 'rand',
            taskTimer: true,
            taskTimerMode: 'dec',
            freeTaskChange: true,
            lastTaskFinish: true,
            multipleChoices: false,
            resultAnswersStyle: 'default',
            navInResult: true
        }
    });

    //Подключение mathjax
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});


testApp.init = function(attrs) {
    //добавление возможности запускать и слушать события
    extend(testApp.TestModel, Observable);
    extend(testApp.ListView, Observable);
    extend(testApp.MainView, Observable);
    extend(testApp.TestController, Observable);

    testApp.listView = new testApp.ListView();
    testApp.listView.init();

    testApp.mainView = new testApp.MainView({resultTmeplate: '#test-result-tmpl'});
    testApp.mainView.init();

    testApp.testModel = new testApp.TestModel();
    testApp.testModel.init(attrs);

    testApp.testController = new testApp.TestController();
};

//наследование классов
function extend(Child, Parent) {
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}

//event listener
var Observable;
(Observable = function() {
}).prototype = {
    listen: function(type, method, scope, context) {
        var listeners, handlers;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])){
            handlers = listeners[type] = [];
        }
        scope = (scope ? scope : window);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });
    },
    fireEvent: function(type, data, context) {
        var listeners, handlers, i, n, handler, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])){
            return;
        }
        for (i = 0, n = handlers.length; i < n; i++){
            handler = handlers[i];
            if (typeof(context)!=="undefined" && context !== handler.context) continue;
            if (handler.method.call(
                    handler.scope, this, type, data
                )===false) {
                return false;
            }
        }
        return true;
    }
};

//нахождение максимального значения массива
Array.max = function( array ){
    return Math.max.apply( Math, array );
};

//нахождение минимального значения массива
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

//модуль для кэширования селекторов jquery
(function($){
    $.cache = function (selector) {
        if (!$.cache[selector]) {
            $.cache[selector] = $(selector);
        }

        return $.cache[selector];
    };
})(jQuery);





