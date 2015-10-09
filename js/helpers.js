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

//добавляет возможность запускать и слушать события
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
            //console.log('handler', handler);
            if (handler.method.call(handler.scope, this, type, data) === false) {
                return false;
            }
        }
        return true;
    }
};
