/* console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
  console.log("init");
} */

$(function() {
  
  //загружает тест
  var test = new Test();
  test.loadTest();
  
  
  //отключает прокрутку страницы при прокрутке центрального блока
  /* $('#field').on('mouseenter', function () {
    $('html,body').on('mousewheel', function (e) {
        e.preventDefault();
    });
    $('#field').on('mousewheel', function (e) {
        var step = 15;
        var direction = e.originalEvent.deltaY > 0 ? 1 : -1;
        $(this).scrollTop($(this).scrollTop() + step * direction);
    });
  });
  $('#field').on('mouseleave', function () {
      $('html,body').off('mousewheel');
  }); */

});

function Test() {
  var that = this;
  var self = this;
  this.correctAnswers = [];
  
  this.loadTest = function() {
    console.log('load test');
    var correctAnswers = [];
    
    $.get('./controllers/clientAjax.php', function(data) {
      answersGiven = [];
      console.log('data: ', data);
      var data = JSON && JSON.parse(data) || $.parseJSON(data);   
      console.log('data after json parse: ', data);
      
      
      //Подготавливает data для mustache.js и ставит порядок по order_num
      var testData = {
        tasks: []
      };
      
      for (var property in data.tasks) {
        if (data.tasks.hasOwnProperty(property)) {
          // console.log('property log: ', property);
          // console.log('property log2: ', data.tasks[property]['answers']);
          // console.log('property order num: ', data.tasks[property]['order_num']);
          
          var answers = $.map(data.tasks[property]['answers'], function(value, index) {
            return [value];
          });
          data.tasks[property]['answers'] = answers;
          
          var answerPoints = $.map(data.tasks[property]['answer_points'], function(value, index) {
            return [value];
          });
          data.tasks[property]['answer_points'] = answerPoints;
          
          // console.log('answerPoints99: ', answerPoints);
          
          var maxPoints = 0;
          for(var i=0; i<answerPoints.length; i++) {
            var points = Number(answerPoints[i]);
            if($.isNumeric(points)) {
              maxPoints = maxPoints + points;
            }
          }
          data.tasks[property]['max_points'] = maxPoints;
          
          // testData.tasks.push(data.tasks[property]);
          testData.tasks[data.tasks[property]['order_num']] = data.tasks[property];
        }
      }
      data = testData;
      data.tasks = data.tasks.filter(function(){return true;});
      console.log('final data 11: ', data);
      var tasksCount = data.tasks.length;
      
      //Задает номер отображаемый в html
      for (var property in data.tasks) {
        if (data.tasks.hasOwnProperty(property)) {
          data.tasks[property]['view_number'] = Number(property) + 1;
          // console.log('data for sorting: ', data.tasks[property]);
          // console.log('data prop for sorting: ',property);
          correctAnswers[Number(property) + 1] = data.tasks[property]['answer_points'];
        }
      } 
      console.log('data after html numbers: ', data);

      //Загружает главную контент теста
      $.get('./tmpl/test-main.mst', function(template) {
        var rendered = Mustache.render(template, data);
        $('#field').html(rendered);
        
        //Подключает mathjax
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

        //Нажатие на ответ, если последний - показывает результат теста
        $('.single-test-data .answer').click(function() {
          var id = $(this).parents('.single-test-data').attr('id');
          id = Number(id.substring(2));
          answersGiven[id] = $(this).index();
          console.log('answers given: ', answersGiven);
          $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
          $(this).addClass('answer-chosen');
          $('#qn' + id).addClass('answer-given');
          
          if(id < tasksCount) {
            that.showTask(id + 1);
          } else if(id == tasksCount) {
            that.showResult(correctAnswers, answersGiven);
          }
        });
        
        //Новый тест
        $('#tb-new-test').click(function() {
         
            //var test = new Test(); 
            //that.loadTest();
            that.startNewTest();
        });
        
         //Предыдущий вопрос
        $('#tb-prev-task').click(function() {
           if($(this).hasClass('switched-off')) return false;
          var id = $('#left-side-bar .active-task').attr('id');
          id = Number(id.substring(2));
          if(id > 1) that.showTask(id - 1);
        });
        
        //Следующий вопрос
        $('#tb-next-task').click(function() {
          if($(this).hasClass('switched-off')) return false;
          var id = $('#left-side-bar .active-task').attr('id');
          id = Number(id.substring(2));
          if(id < tasksCount) that.showTask(id + 1);
        });

        //Закончить тест
        $('#tb-finish-test').click(function() {
          if($(this).hasClass('switched-off')) return false;
          that.showResult(correctAnswers, answersGiven);
          $('#field').removeClass('result-field');
          $('.test-tasks').removeClass('result-task');
        }); 
        
        //Начать показав первое задание
        that.showTask(1);
        $('.single-test-data').hide();
        $('#left-side-bar .task-item').removeClass('active-task');
   
      });
      
      //Загружает сайдбар
      $.get('./tmpl/side-bar.mst', function(template) {
        var rendered = Mustache.render(template, data);
        $('#left-side-bar').html(rendered);

        //Начать показав первое задание (1 раз при загрузке каждого шаблона mst)
        that.showTask(1);
        $('.single-test-data').hide();
        $('#left-side-bar .task-item').removeClass('active-task');

      });

    });
  }
  
  
}




Test.prototype.leftSidebarHandler = function() {
  // var that = this;
  var id = $(this).attr('id');
  id = id.substring(2);
  console.log(id);
  $('#tb-prev-task, #tb-next-task, #tb-finish-test').prop('disabled', true);
  $('#field').removeClass('result-field');
  $('#close-result-task').hide();
  showTask(id);  
}

Test.prototype.startNewTest = function() {
  
  var that = this;
  console.log('new test start!');
  $('#left-side-bar .task-item').removeClass('answer-given');
  $('.single-test-data .answer').removeClass('answer-chosen');
  $('.single-test-data .answer').removeClass('answered-wrong');
  $('.single-test-data .answer').removeClass('answered-right');
  $('#left-side-bar .task-item').removeClass('answered-wrong');
  $('#left-side-bar .task-item').removeClass('answered-right');
  $('#tb-prev-task, #tb-next-task, #tb-finish-test').removeClass('switched-off');
  $('#close-result-task').hide();
  $('#field').removeClass('result-field');
  $('.test-tasks').removeClass('result-task');
  
  //Нажатие на ответ, если последний - показывает результат теста 
  $('.single-test-data .answer').click(function() {
    var id = $(this).parents('.single-test-data').attr('id');
    id = Number(id.substring(2));
    answersGiven[id] = $(this).index();
    console.log('answers given: ', answersGiven);
    $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
    $(this).addClass('answer-chosen');
    $('#qn' + id).addClass('answer-given');
    $('.test-tasks').removeClass('result-task');
    
    var maxID = $('.side-bar-table tbody tr').length;
    console.log('that.tasksCount: ', that.tasksCount);
      console.log('id: ', id);
    
    if(id < maxID) {
      console.log('that.tasksCount: ', that.tasksCount);
      console.log('id: ', id);
      that.showTask(id + 1);
    } else if(id == maxID) {
      $('#tb-finish-test').click();
    }
  });
  
  
  
  //включить кнопки //doesn't work
  $('#tb-prev-task, #tb-next-task, #tb-finish-test').prop('disabled', false);
  
 
   answersGiven = [];
  
  //Выбор вопроса на сайдбаре
  $('#left-side-bar .task-item').click(that.leftSidebarHandler);
  
  $('.start-massage').hide();
  $('#test-result').hide();
  $('.task-top-panel .task-number').show();
  that.showTask(1);
  
  //timer
  $('#time-left').html('30:00');
  $('#time-left').show();
  var time = $('#time-left').html();
  if (time != null) {
    Timer.init();
    Timer.start();
  }
  
}


//Показывает задачу номер id
Test.prototype.showTask = function(id) {
  $('.single-test-data').hide();
  $('#vn' + id).show();
  $('#left-side-bar .task-item').removeClass('active-task');
  $('#qn' + id).addClass('active-task');
  var maxID = $('.side-bar-table tbody tr').length;
  
  if(id == maxID) {
    $('#tb-next-task').addClass('switched-off');
  } else {
    $('#tb-next-task').removeClass('switched-off');
  }  
  
  if(id == 1) {
    $('#tb-prev-task').addClass('switched-off');
  } else {
    $('#tb-prev-task').removeClass('switched-off');
  }
}

//копия ^ функции пока не решу проблему с областью видимости
function showTask(id) {
  $('.single-test-data').hide();
  $('#vn' + id).show();
  $('#left-side-bar .task-item').removeClass('active-task');
  $('#qn' + id).addClass('active-task');
  var maxID = $('.side-bar-table tbody tr').length;
  
  if(id == maxID) {
    $('#tb-next-task').addClass('switched-off');
  } else {
    $('#tb-next-task').removeClass('switched-off');
  }  
  
  if(id == 1) {
    $('#tb-prev-task').prop('disabled', true);
    $('#tb-prev-task').addClass('switched-off');
  } else {
    $('#tb-prev-task').prop('disabled', false);
    $('#tb-prev-task').removeClass('switched-off');
  }
  
  if($('#field').hasClass('result-field')) {
    $('#tb-prev-task').prop('disabled', true);
    $('#tb-prev-task').addClass('switched-off');
    $('#tb-next-task').prop('disabled', true);
    $('#tb-next-task').addClass('switched-off');
  }
  
}


Test.prototype.getTimeSpent = function() {
  var time = $('#time-left').html();
   var timeSpent = {};
   
   var testEnded = new Date().getTime();
  var testStarted =  localStorage['tests.timeStart'];

  var secondsSpent = parseInt((testEnded - testStarted)/1000);
  
  timeSpent.hours = [];
  if(secondsSpent > 3600) {
    timeSpent.hours.push(Math.floor(secondsSpent/3600));
    secondsSpent = secondsSpent%3600;
  }
  
  timeSpent.minutes = [];
  if(secondsSpent > 60) {
    timeSpent.minutes.push(Math.floor(secondsSpent/60));
    secondsSpent = secondsSpent%60;
  }
  timeSpent.seconds = secondsSpent;

  console.log('time spent Object: ', timeSpent);

  return timeSpent;
};


//Показывает результат теста
Test.prototype.showResult = function(correctAnswers, answersGiven) {
  var that = this;
  Timer.stop();
  var timeSpent = this.getTimeSpent();
  if(answersGiven.length < 1) return false;

  console.log('ff');
  console.log('correctAnswers: ', correctAnswers);
  console.log('answersGiven: ', answersGiven);
  
  //массив для подсчет реального количества данных ответов
  var answersForCount = [];
  $.map(answersGiven, function(value, index) {
    if(typeof value !== 'undefined') answersForCount.push(value);
  });
  console.log('answersForCount: ', answersForCount);
  
  //обработка кнопок
  $('#tb-prev-task, #tb-next-task, #tb-finish-test').addClass('switched-off');
  $('#tb-prev-task, #tb-next-task, #tb-finish-test').prop('disabled', true);
  $('.single-test-data .answers .answer').off();
  $('.single-test-data .answers .answer').removeClass('hoverable');
  

  var answersGivenKeys = [];
  answersGiven.forEach(function(item, i, arr) {
    answersGivenKeys.push(Number(i));
  });
  console.log('answersGivenKeys: ', answersGivenKeys);
  
  //Выбор вопроса на сайдбаре
  $('#left-side-bar .task-item').off();
  
  $('#left-side-bar .task-item').click(function() {
    var id = $(this).attr('id');
    id = id.substring(2);
    
    // if(($.inArray(Number(id), answersGivenKeys)) > -1) {
    // if(answersGivenKeys.indexOf(id) > -1) {
    if(answersGivenKeys.indexOf(Number(id)) > -1) {
      // that.showTask(id);
      $('#test-result').hide();
      $('#close-result-task').show();
      $('#field').addClass('result-field');
      console.log('found id: ', id + ' is in array ' + answersGivenKeys);
      console.log('$.inArray(id, answersGivenKeys): ', answersGivenKeys);
      showTask(id);  

    } else {
      console.log('Not found: ', id + ' is in array ' + answersGivenKeys);
      console.log('$.inArray(id, answersGivenKeys): ', answersGivenKeys);

      return false;
    }

    
  });
  
  $('#close-result-task').click(function() {
    $('#field').removeClass('result-field');
    $('.test-tasks').removeClass('result-task');
    $('#test-result').show();
    $('.single-test-data').hide();
    $('#test-result').show();
    $('#close-result-task').hide();
  });
  
  //Предыдущий вопрос
  /*  $('#tb-prev-task').off('click');
  //Следующий вопрос
  $('#tb-next-task').off('click');
  
  $('#tb-next-task').off('click'); */
  //Закончить тест
  //$('#tb-finish-test').off('click'); 
  
  
        
  $('#left-side-bar .task-item').removeClass('active-task');
  $('.start-massage').hide();
  $('#time-left').hide();
  $('.test-tasks').addClass('result-task');
  $('.single-test-data .answer-chosen').addClass('answered-wrong');
  
  
   
  var totalPoints = 0;
  var maxPoints = 0;
  var wrongAnswers = 0;
  var correctCount = 0;
  var totalTasks = Number(correctAnswers.length) - 1;
  var answersGivenCount = answersForCount.length;
  console.log('answersGivenCount: ', answersGivenCount);
  var tasksSkipped = Number(totalTasks) - Number(answersGivenCount);
  console.log('tasksSkipped: ', tasksSkipped);
  console.log('correctAnswers77: ', correctAnswers);
  
  //Проверяет правильность ответов, сравнивая correctAnswers и answersGiven
  correctAnswers.forEach(function(item, i, arr) {
    var answerPoints =  item[answersGiven[i]];
    console.log('correctAnswersn22: ', item);
    console.log('answerPoints: ', answerPoints);
    console.log('i: ', i);
    
    if(typeof answerPoints === 'undefined')  {
      console.log('undefined === answerPooints: ');
    } 
   
    //Считает правильные ответы и окрашивает задачи
    if($.isNumeric(answerPoints)) {
      if(answerPoints == 0) {
        wrongAnswers += 1;
        $('#qn' + i).addClass('answered-wrong');
       
        console.log('color as wrong: ', i);
      } else {
        totalPoints += Number(answerPoints);
        correctCount += 1;
        $('#qn' + i).addClass('answered-right');
        console.log('color as Right: ', i);
      }
    } else if(typeof(answerPoints) === 'undefined') {
        console.log('data should be undef: ');
    } else {
      wrongAnswers += 1;
      $('#qn' + i).addClass('answered-wrong');
      console.log('color as wrong2: ', i);
    }
    
    for(var j=0; j<item.length; j++) {
      //красит ответы в основном поле
      if(Number(item[j]) > 0) {
        $('#vn' + i + ' .answers .answer:eq(' + j + ')').addClass('answered-right');
      }
      
      var points = Number(item[j]);
      if($.isNumeric(points)) {
        maxPoints = maxPoints + points;
      }
    }
    
  });
  
  //расчёт оценки
  var pointsPercent = totalPoints / maxPoints
  if(pointsPercent >= 0.6 && pointsPercent <= 0.8) {
    var mark = 3;
  } else if(pointsPercent > 0.8 && pointsPercent <= 0.9) {
    var mark = 4;
  } else if(pointsPercent > 0.9 && pointsPercent <= 1) {
    var mark = 5;
  } else if(pointsPercent < 0.6) {
    var mark = 2;
  }

  //данные для показа результата
  var finalData = {
    mark: mark,
    totalTasks: totalTasks,
    correctCount: correctCount,
    totalPoints: totalPoints,
    answersGivenCount: answersGivenCount,
    tasksSkipped: tasksSkipped,
    maxPoints: maxPoints,
    wrongAnswers: wrongAnswers,
    seconds: timeSpent.seconds,
    minutes: timeSpent.minutes,
    hours: timeSpent.hours
  }
  
  //загружает шаблон для показа результата теста
  $.get('./tmpl/result.mst?244', function(template) {
    console.log('render tmpl data: ', finalData);
    var rendered = Mustache.render(template, finalData);
    $('.single-test-data').hide();
    $('#test-result').show();
    $('#test-result').html(rendered);
  });
  
}





