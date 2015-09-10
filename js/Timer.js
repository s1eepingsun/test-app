function Timer(time) {
    var that = this;
    this.time = time;

    //записывает время запуска таймера, и задаёт время выполнения теста
    this.newTimer = function() {
        this.testStarted = new Date().getTime();
        this.timeNow = this.time;
    };

    //запускает таймер, запускает event для модели и для вида
    this.go = function() {
        that.activeTimer = setInterval(function() {
            that.timeNow = that.timeObDecrease(that.timeNow);
            Backbone.trigger('testTimerTick');
        }, 1000);
    };

    //@return obj - останавливает таймер и записывает время прошедшее с запуска таймера, заканчивает тест
    this.stop = function() {
        clearTimeout(that.activeTimer);
        this.testEnded = new Date().getTime();
        console.log('test ENded:', this.testEnded);
    };

    this.getTimeSpent = function() {
        var timeSpent = this.testEnded - this.testStarted;
        timeSpent = this.timeToObject(timeSpent);
        return timeSpent;
    };

    //@return obj - уменьшает время в объекте на 1 сек
    this.timeObDecrease = function(time) {
        time.s--;

        if(time.s < 0){
            if(time.m >= 0) {
                time.m--;
                time.s = 59;
            }
        }

        if(time.m < 0){
            if(time.h > 0) {
                time.h--;
                time.m = 59;
            }
        }

        return time;
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

        //minutes
        timeObject.m = [];
        if(seconds > 60) {
            timeObject.m.push(Math.floor(seconds/60));
            seconds = seconds%60;
        }

        timeObject.s = Math.floor(seconds);

        return timeObject;
    };

}