function Timer(time, timerInterval) {
    this._time = time;
    this._interval = 1000 / timerInterval;
}

Timer.prototype = {
    //метод для запуска событий
    fireEvent: function (type, data, context) {
        Observable.prototype.fireEvent(type, data, context);
    },

    //записывает время запуска таймера, и задаёт время выполнения теста
    newTimer: function () {
        this.testStarted = new Date().getTime();
        this.timeNow = this._time;
    },

    //запускает таймер обратного отчёта, запускает event
    goDown: function(eventName) {
        var that = this;
        this.activeTimer = setInterval(function() {
            that.timeNow -= that._interval;
            var data = {timeNow: that.timeNow, that: that};
            that.fireEvent(eventName, data);
        }, this._interval);
    },

    //запускает таймер на увеличение, запускает event
    goUp: function(eventName) {
        var that = this;
        this.activeTimer = setInterval(function() {
            that.timeNow += that._interval;
            var data = {timeNow: that.timeNow, that: that};
            that.fireEvent(eventName, data);
        }, this._interval);
    },

    //@return obj - останавливает таймер и записывает время прошедшее с запуска таймера, заканчивает тест
    stop: function() {
        clearTimeout(this.activeTimer);
        this.testEnded = new Date().getTime();
    },

    //возвращает разницу время начала и окончания теста
    getTimeSpent: function() {
        return this.testEnded - this.testStarted;
    },

    //@return str - делает из объекта времени {h, m, s} строку hh:mm:ss
    timeObToString: function(time) {
        var timeString = '';

        if(time.s < 10){
            var strS = '0'+time.s;
        } else{
            strS = time.s;
        }

        if(time.m < 10){
            var strM = '0'+time.m;
        } else{
            strM = time.m;
        }

        if(time.h > 0) timeString += time.h + ':';
        timeString += strM + ':';
        timeString += strS;
        return  timeString;
    },

    //@return str - делает из объекта времени {h, m, s} строку hh:mm:ss
    timeObToLongString: function(time) {
        var timeString = '';

        /*if(time.s < 10){
            var strS = '&nbsp;&nbsp;'+time.s;
        } else {
            strS = time.s;
        }

        if(time.m < 10){
            var strM = '&nbsp;&nbsp;'+time.m;
        } else {
            strM = time.m;
        }

        if(time.h > 0) timeString += time.h + ' ч ';
        if(time.m > 0) timeString += strM + ' м ';
        timeString += strS + ' с';*/



        if(time.s < 10){
            var strS = '<span class="invisible-char">0</span>' +time.s;
        } else {
            strS = time.s;
        }

        if(time.m < 10){
            var strM = '<span class="invisible-char">0</span>' +time.m;
        } else {
            strM = time.m;
        }

        if(time.h > 0) timeString += time.h + ' ч ';
        if(time.m > 0) timeString += strM + ' м ';
        timeString += strS + ' с';



        /*if(time.h > 0) timeString += time.h + ' ч ';
        if(time.m > 0) timeString += time.m + ' м ';
        timeString += time.s + ' с';*/

        return  timeString;
    },

    //@return obj - делает объект времени {h, m, s} из timestamp
    timeToObject: function(time) {
        var timeObject = {};
        var seconds = time/1000;

        //hours
        timeObject.h = [];
        if(seconds > 3600) {
            timeObject.h.push(Math.floor(seconds/3600));
            seconds = seconds%3600;
        }
        if(timeObject.h.length == 0) timeObject.h = 0;

        //minutes
        timeObject.m = [];
        if(seconds > 60) {
            timeObject.m.push(Math.floor(seconds/60));
            seconds = seconds%60;
        }
        if(timeObject.m.length == 0) timeObject.m = 0;

        //seconds
        timeObject.s = Math.floor(seconds);

        return timeObject;
    }

};