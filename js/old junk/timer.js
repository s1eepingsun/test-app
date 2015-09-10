function Timer(elem){

    that=this;
    this.timer_id=0;

    this.time_now={
        h:0,
        m:0,
        s:0
    };

    function inc(){
        that.time_now.s++;
        if(that.time_now.s==60){
            that.time_now.m++;
            that.time_now.s=0;
        }
        if(that.time_now.m==60){
            that.time_now.h++;
            that.time_now.m=0;
        }

        if(that.time_now.s<10){
            var fict_s='0'+that.time_now.s;
        } else{
            var fict_s=that.time_now.s;
        }
        if(that.time_now.m<10){
            var fict_m='0'+that.time_now.m;
        } else{
            var fict_m=that.time_now.m;
        }
        if(that.time_now.h<10){
            var fict_h='0'+that.time_now.h;
        } else{
            var fict_h=that.time_now.h;
        }

        return  fict_h+':'+ fict_m+':'+ fict_s;
    }


    this.start=function(){
        that.timer_id=setInterval(draw,1000);
    };

    this.stop=function(){
        clearTimeout(that.timer_id);
    };

    this.get=function(){
        return elem.html();
    };

    this.clear=function(){
        elem.empty();
    };

    function draw(){
        elem.html(inc());
    }

}

Timer.prototype.timeConvert=function(time){
    var time_array=[];
    time_array=time.split(':');
    for(var i=0;i<time_array.length;i++){
        time_array[i]=Number(time_array[i]);
    }
    return time_array[0]+' ч.'+time_array[1]+' мин.'+time_array[2]+' сек.';
};