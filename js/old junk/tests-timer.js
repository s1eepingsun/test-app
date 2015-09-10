Timer = {

  h: 0,
  m: 0,
  s: 0,
  timer_id: 0,
  timeStart: 0,

  init: function() {
      this.stop();
      
      localStorage.setItem('tests.timeStart', new Date().getTime());
      
      var str = $('#time-left').html();
      var strl = $('#time-left').html().length;
      if (strl == 8) {
          this.h = str.substr(0, 2) * 1;
          this.m = str.substr(3, 2) * 1;
          this.s = str.substr(6, 8) * 1;
      } else if (strl == 5) {
          this.h = 0;
          this.m = str.substr(0, 2) * 1;
          this.s = str.substr(4, 5) * 1;
      }
      
  },

  engine: function() {
      var flag = 0;

      if (this.m > 0) {
          if (this.s > 0) {
              this.s = this.s - 1;
          } else {
              this.m = this.m - 1;
              this.s = 59;
          }
          flag = 1;
      } else {
          if (this.h > 0) {
              this.h = this.h - 1;
              this.m = 59;
              this.s = 59;
              flag = 1;
          } else {
              flag = 0;
          }

          if (this.s > 0) {
              this.s = this.s - 1;
              flag = 1;
          }

      }
      
      if (flag == 1) {
          var hh = this.h + '';
          if (hh.length <= 1) {
              hh = '0' + hh;
          }
          var mm = this.m + '';
          if (mm.length <= 1) {
              mm = '0' + mm;
          }
          var ss = this.s + '';
          if (ss.length <= 1) {
              ss = '0' + ss;
          }
          localStorage.setItem('tests.time', hh + ':' + mm + ':' + ss);
          

          var m_h = 0;
          var m_m = 0;
          var m_s = 0;

          if (this.h > 0) {
              m_h = '<span id="h"> ' + this.h + ' ч. ' + '</span>';
          } else {
              m_h = '<span id="h"> 0 ч. </span>';
          }

          if (this.m > 0) {
              m_m = '<span id="m"> ' + this.m + ' мин. ' + '</span>';
          } else {
              m_m = '<span id="m"> 0 мин. </span>';
          }

          if (this.s > 0) {
              m_s = '<span id="s"> ' + this.s + ' сек. ' + '</span>';
          } else {
              m_s = '<span id="s"> 0 сек. </span>';
          }
          
          if (m_h == '<span id="h"> 0 ч. </span>' && m_m == '<span id="m"> 0 мин. </span>' && m_s == '<span id="s"> 0 сек. </span>') { //  console.log('ctreylы');
              $('#time-left').html('');
              this.finish();
          } else {
              $('#time-left').html('<span id="m">' + mm + '</span>:<span id="s">' + ss + '</span>');
          }
      }

  },

  start: function() {
      this.timer_id = setInterval(function() {
          Timer.engine()
      }, 1000);
  },

  stop: function() {
      if (typeof(this.timer_id) != 'undefined') {
          clearInterval(this.timer_id);
          //  console.log(this.timer_id);
      }

  },

  finish: function() {
      this.stop();
      // console.log(this.timer_id);
      $('#time_text').hide();
      
      this.timeStart = localStorage.getItem('tests.timeStart');
      
      $('#tb-finish-test').click();
      // $('#time-left').hide();
      var tn = localStorage.getItem('tn');
      console.log('tn: ', tn);
      var arr = ["Test_1", "Test_2", "Test_3", "Test_4"];
      $test_number = arr[tn - 1];
      console.log($test_number);
      //Tests.proba($test_number);
  }

};