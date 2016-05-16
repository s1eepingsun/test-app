var testHelpers = {};

//регистрация хэлперов handlebars.js
function registerHandlebarsHelpers() {

    //показывает номера элементов
    Handlebars.registerHelper('plus1', function(options) {
        return new Handlebars.SafeString(
            Number(options.fn(this)) + 1
        );
    });

    //assign letter values (АБВГДЕ) to indexes
    Handlebars.registerHelper('numToLetter', function(options) {
        var letter;
        switch(Number(options.fn(this))) {
            case 0:
                letter = 'А';
                break;
            case 1:
                letter = 'Б';
                break;
            case 2:
                letter = 'В';
                break;
            case 3:
                letter = 'Г';
                break;
            case 4:
                letter = 'Д';
                break;
            case 5:
                letter = 'Е';
                break;
        }

        return new Handlebars.SafeString(letter);
    });

    //математическая сумма элементов (для показа макс. баллов за задание)
    Handlebars.registerHelper('sum', function(context) {
        var sum = 0;
        var valuesArr = [];

        for(prop in context) {
            if(!context.hasOwnProperty(prop)) continue;
            valuesArr.push(context[prop]);
        }

        for(var i=0; i<valuesArr.length; i++) {
            sum += Number(valuesArr[i]);
        }
        return sum;
    });

    //делает первую букву заглавной
    Handlebars.registerHelper('upperFirst', function(options) {
        return new Handlebars.SafeString(
            options.fn(this).substring(0, 1).toUpperCase() + options.fn(this).substring(1)
        );
    });
}

registerHandlebarsHelpers();

Array.max = function (array) {
    return Math.max.apply(null, array);
};

Array.min = function (array) {
    return Math.min.apply(null, array);
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

//console.log работающий только если production != true
(function() {
    console.log2 = function(args) {
        if(testApp.testModel.config.production != true) {
            console.log.apply(this, arguments);
        }
    }
})();

//отключает прокрутку страницы при прокрутке элемента
testHelpers.singleScrolling =  function(selector, stepAttr) {
    var step;
    !stepAttr? step = 30: step = stepAttr;
    $(selector).off('mouseenter mouseleave');
    $(selector).on('mouseenter', function () {
        if ($(selector)[0].scrollHeight > $(selector)[0].offsetHeight) {
            $('html, body').on('mousewheel', function (e) {
                e.preventDefault();
            });
            $(selector).on('mousewheel', function (e) {
                var direction = e.originalEvent.deltaY > 0 ? 1 : -1;
                $(this).scrollTop($(this).scrollTop() + step * direction);
            });
        }
    });
    $(selector).on('mouseleave', function () {
        $('html,body').off('mousewheel');
    });
};


//добавляет возможность запускать и слушать события
var Observable;
(Observable = function() {
}).prototype = {
    listen: function(type, method, scope, context, clear) {
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
    fireEvent: function(type, data, context, clear) {
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
            if (handler.method.call(handler.scope, this, type, data) === false) {
                return false;
            }
        }
        return true;
    },
    clear: function() {
        this.listeners = {};
    }
};
