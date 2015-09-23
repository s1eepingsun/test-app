function Timer(time, timerInterval) {
    var that = this;
    this.time = time;
    this.interval = 1000/timerInterval;

    //записывает время запуска таймера, и задаёт время выполнения теста
    this.newTimer = function() {
        this.testStarted = new Date().getTime();
        this.timeNow = this.time;
    };

    //запускает таймер обратного отчёта, запускает event
    this.goDown = function(id) {
        that.activeTimer = setInterval(function() {
            that.timeNow -= that.interval;
            //Backbone.trigger('testTimerTick');
            if(testApp && testApp.testModel) testApp.testModel.testTimerTick(that.timeNow, that);
        }, this.interval);

    };

    //запускает таймер на увеличение, запускает event
    this.goUp = function(id) {
            that.activeTimer = setInterval(function() {
            that.timeNow += that.interval;
            //Backbone.trigger('testTimerTick');
            if(testApp && testApp.testModel) testApp.testModel.testTimerTick(that.timeNow, that);
        }, this.interval);
    };

    //@return obj - останавливает таймер и записывает время прошедшее с запуска таймера, заканчивает тест
    this.stop = function() {
        clearTimeout(that.activeTimer);
        this.testEnded = new Date().getTime();
        console.log('test/task ENded timestamp:', this.testEnded);
    };

    //возвращает разницу время начала и окончания теста
    this.getTimeSpent = function() {
        return this.testEnded - this.testStarted;
    };

    //@return str - делает из объекта времени {h, m, s} строку hh:mm:ss
    this.timeObToString = function(time) {
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
    };

    //@return obj - делает объект времени {h, m, s} из timestamp
    this.timeToObject = function(time) {
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

        timeObject.s = Math.floor(seconds);

        return timeObject;
    };

}