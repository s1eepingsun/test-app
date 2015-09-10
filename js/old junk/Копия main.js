/* console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
  console.log("init");
} */

$(function() {
  
  var testConfig = {
    taskOrder: 'rand', //порядок вопросов: inc - по возрастанию (по умолчанию), dec - по убыванию, rand - случайный порядок
    answerOrder: 'rand' //порядок ответов: inc - по возрастанию (по умолчанию), dec - наоборот, rand - случайный порядок
  }
  
  //загружает тест
  var test = new Test(testConfig);
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

})

function Test(testConfig) {
  var that = this;
  this.correctAnswers = [];
  this.answersGiven = [];
  this.tasksCount = 0;
  this.testPartsLoaded = 0;
  this.testConfig = {};
  
  if(typeof testConfig !== 'undefined') {
    typeof testConfig['taskOrder'] !== 'undefined'? this.testConfig['taskOrder'] = testConfig['taskOrder']: this.testConfig['taskOrder'] = 'inc';  
    typeof testConfig['answerOrder'] !== 'undefined'? this.testConfig['answerOrder'] = testConfig['answerOrder']: this.testConfig['answerOrder'] = 'inc';  
  } else {
    this.testConfig['taskOrder'] = 'inc';
    this.testConfig['answerOrder'] = 'inc';
  }
  console.log(' this.testConfig: ',  this.testConfig);
	
  //загружает тест
  this.loadTest = function() {
    console.log('load test');
    // var correctAnswers = [];
    
    //берёт данные теста
    $.get('./controllers/clientAjax.php', function(data) {
      that.answersGiven = [];
      // console.log('data: ', data);
      var data = JSON && JSON.parse(data) || $.parseJSON(data);   
      console.log('data after json parse: ', data);

      //подготовка к mustache.js
      var data = that.prepareForMustache(data);
      console.log('prepareForMustache: ', data);
      
      //считает задачи
      that.tasksCount = data.tasks.length;
      that.tasksCount > 0?  that.tasksCount -= 1:  that.tasksCount = 0;
      console.log(' that.tasksCount: ',  that.tasksCount);

      //сортировка вопросов -- filter просто обнуляет индексы
      data.tasks = data.tasks.filter(function(){return true;});
      //сортирует согласно конфигу
      data = that.sortTasks(data);
      console.log('data after filter: ', data);
      
   
      //Задает номер отображаемый в html и заполняет массив correctAnswers
      //также считает max points (needed for side-bar.mst)
      for (var property in data.tasks) {
        if (data.tasks.hasOwnProperty(property)) {
          data.tasks[property]['view_number'] = Number(property) + 1;
          // console.log('data for sorting: ', data.tasks[property]);
          // console.log('data prop for sorting: ',property);
          // correctAnswers[Number(property) + 1] = data.tasks[property]['answer_points'];
          that.correctAnswers[Number(property) + 1] = data.tasks[property]['answer_points'];
          
          var maxPoints = 0;
          for(var i=0; i<data.tasks[property]['answer_points'].length; i++) {
            var points = Number(data.tasks[property]['answer_points'][i]);
            if($.isNumeric(points)) {
              maxPoints = maxPoints + points;
            }
          }
          data.tasks[property]['max_points'] = maxPoints;
        }
      }
      console.log('data after html numbers: ', data);

      //загружает главный шаблон и сайдбар
      that.loadTestSidebar('side-bar', data);
      that.loadTestWindow('test-main', data);

    });
  }
  

}


//Загружает сайдбар
Test.prototype.loadTestSidebar = function(template, data) {
  var that = this;
  $.post('./tmpl/' + template + '.mst', function(template) {
    var rendered = Mustache.render(template, data);
    $('#left-side-bar').html(rendered);

    //Начать показав первое задание (1 раз при загрузке каждого шаблона mst)
    // if(that.testPartsLoaded == 2) {
      that.showTask(1);
      $('.single-test-data').hide();
      $('#left-side-bar .task-item').removeClass('active-task');
    // }
   

  });
};

//Загружает основное окно теста
Test.prototype.loadTestWindow = function(template, data) {
  var that = this;
  
  //Загружает главную контент теста
  $.post('./tmpl/' + template + '.mst', function(template) {
    var rendered = Mustache.render(template, data);
    $('#field').html(rendered);
    
    //Подключает mathjax
    // MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

    //Нажатие на ответ, если последний - показывает результат теста
    $('.single-test-data .answer').click(function() {
      var id = $(this).parents('.single-test-data').attr('id');
      id = Number(id.substring(2));
      that.answersGiven[id] = $(this).index();
      console.log('answers given: ', that.answersGiven);
      $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
      $(this).addClass('answer-chosen');
      $('#qn' + id).addClass('answer-given');
      
      if(id < that.tasksCount) {
        that.showTask(id + 1);
      } else if(id == that.tasksCount) {
        that.showResult(that.correctAnswers, that.answersGiven);
      }
    });
    
    //Новый тест
    $('#tb-new-test').click(function() {
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
      if(id < that.tasksCount) that.showTask(id + 1);
    });

    //Закончить тест
    $('#tb-finish-test').click(function() {
      if($(this).hasClass('switched-off')) return false;
      console.log('that.correctAnswers: ', that.correctAnswers);
      that.showResult(that.correctAnswers, that.answersGiven);
      $('#field').removeClass('result-field');
      $('.test-tasks').removeClass('result-task');
    }); 
    
    //Начать показав первое задание
    that.showTask(1);
    $('.single-test-data').hide();
    $('#left-side-bar .task-item').removeClass('active-task');
    
    //Подключение mathjax
     MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  }); 
} 

//Подготавливает data для mustache.js и ставит порядок по order_num
Test.prototype.prepareForMustache = function(data) {
  
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
      
      testData.tasks[data.tasks[property]['order_num']] = data.tasks[property];
    }
  }
  
  return testData;
}



Test.prototype.startNewTest = function() {
  var that = this;
  console.log('new test start!');
  
  //если это не первый запуск теста, обнуляем данные и стили после показа результата (showResult)
  if(that.answersGiven !== []) {
    that.answersGiven = [];
    $('#tb-prev-task, #tb-next-task, #tb-finish-test').prop('disabled', false);
    $('#left-side-bar .task-item').removeClass('answer-given');
    $('.single-test-data .answer').removeClass('answer-chosen');
    $('.single-test-data .answer, #left-side-bar .task-item').removeClass('answered-wrong');
    $('.single-test-data .answer, #left-side-bar .task-item').removeClass('answered-right');
    $('#tb-prev-task, #tb-next-task, #tb-finish-test').removeClass('switched-off');
    $('#close-result-task').hide();
    $('#field').removeClass('result-field');
    $('.test-tasks').removeClass('result-task');
  }
  
  //Нажатие на ответ, если последний - показывает результат теста
  $('.single-test-data .answer').click(function() {
    var id = $(this).parents('.single-test-data').attr('id');
    id = Number(id.substring(2));
    that.answersGiven[id] = $(this).index();
    console.log('answers given: ', that.answersGiven);
    $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
    $(this).addClass('answer-chosen');
    $('#qn' + id).addClass('answer-given');
    $('.test-tasks').removeClass('result-task');
    
    console.log('id: ', id);
    
    if(id < that.tasksCount) {
      console.log('that.tasksCount: ', that.tasksCount);
      console.log('id: ', id);
      that.showTask(id + 1);
    } else if(id == that.tasksCount) {
      $('#tb-finish-test').click();
    }
    
    console.log('that.tasksCount: ', that.tasksCount);
  });
  
  //включить кнопки 
  
  //Выбор вопроса на сайдбаре
  $('#left-side-bar .task-item').off();
  $('#left-side-bar .task-item').click($.proxy(this.TestSidebarHandler, this));
  
  $('.start-massage').hide();
  $('#test-result').hide();
  $('.task-top-panel .task-number').show();
  that.showTask(1);
  
  //start timer
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
    $('#tb-prev-task').prop('disabled', true);
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
    var secondsSpent = secondsSpent%3600;
  }
  
  timeSpent.minutes = [];
  if(secondsSpent > 60) {
    timeSpent.minutes.push(Math.floor(secondsSpent/60));
    var secondsSpent = secondsSpent%60;
  }
  timeSpent.seconds = secondsSpent;
  
  return timeSpent;
  
  console.log('time spent Object: ', timeSpent);
}


//Показывает результат теста
Test.prototype.showResult = function(correctAnswers, answersGiven) {
  var that = this;
  if(answersGiven.length < 1) return false;
  
  Timer.stop();
  var timeSpent = this.getTimeSpent();

  console.log('ff');
  console.log('correctAnswers: ', correctAnswers);
  console.log('answersGiven: ', answersGiven);
  
  //массив для подсчета реального количества данных ответов
  var answersForCount = [];
  $.map(answersGiven, function(value, index) {
    if(typeof value !== 'undefined') answersForCount.push(value);
  });
  console.log('answersForCount: ', answersForCount);
  
  //отключение кнопок
  $('#tb-prev-task, #tb-next-task, #tb-finish-test').addClass('switched-off');
  $('#tb-prev-task, #tb-next-task, #tb-finish-test').prop('disabled', true);
  $('.single-test-data .answers .answer').off();
  $('.single-test-data .answers .answer').removeClass('hoverable');
  
  //обработка стилей
  $('#left-side-bar .task-item').removeClass('active-task');
  $('#time-left').hide();
  $('.test-tasks').addClass('result-task');
  $('.single-test-data .answer-chosen').addClass('answered-wrong');
  
  //Выбор вопроса на сайдбаре
  var answersGivenKeys = [];
  answersGiven.forEach(function(item, i, arr) {
    answersGivenKeys.push(Number(i));
  });
  console.log('answersGivenKeys: ', answersGivenKeys);
  $('#left-side-bar .task-item').off();
  // $('#left-side-bar .task-item').click($.proxy(function(){ this.ResultSidebarHandler(event, answersGivenKeys) }, this));
  $('#left-side-bar .task-item').click(function(e) { 
		console.log(456, e);
		that.ResultSidebarHandler(e, answersGivenKeys); 
	});
	//$('#left-side-bar .task-item').click(that.ResultSidebarHandler);


  //нажатие на крестик - закрытие окна задачи
  $('#close-result-task').click(function() {
    $('#field').removeClass('result-field');
    $('.test-tasks').removeClass('result-task');
    $('#test-result').show();
    $('.single-test-data').hide();
    $('#test-result').show();
    $('#close-result-task').hide();
  });
  
  
  //подготовка данных для показа результата теста
  var totalPoints = 0;
  var maxPoints = 0;
  var wrongAnswers = 0;
  var correctCount = 0;
  var totalTasks = Number(correctAnswers.length);
  totalTasks > 0? totalTasks -= 1: totalTasks = 0;
  var answersGivenCount = answersForCount.length;
  var tasksSkipped = Number(totalTasks) - Number(answersGivenCount);
  console.log('answersGivenCount: ', answersGivenCount);
  console.log('tasksSkipped: ', tasksSkipped);
  console.log('correctAnswers77: ', correctAnswers);
  
  //Проверяет правильность ответов, сравнивая correctAnswers и answersGiven
  correctAnswers.forEach(function(item, i, arr) {
    var answerPoints =  item[answersGiven[i]];
    console.log('correctAnswers log start: ', item);
    console.log('answerPoints: ', answerPoints);
    console.log('i: ', i);
    
    if(typeof answerPoints === 'undefined')  {
      console.log('undefined === answerPooints');
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
      //считает макс. сумму баллов за все ответы вместе
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

Test.prototype.TestSidebarHandler = function(event) {
  var element = event.target;
  var id = $(element).parent().attr('id');
  id = id.substring(2);
  console.log(id);
  $('#field').removeClass('result-field');
  $('#close-result-task').hide();
  this.showTask(id);
}

Test.prototype.ResultSidebarHandler = function(event, answersGivenKeys) {
	console.log('123 this: ', event, this);
  var element = event.target;
  var id = $(element).parent().attr('id');
  id = id.substring(2);
  
  if(answersGivenKeys.indexOf(Number(id)) > -1) {
    $('#test-result').hide();
    $('#close-result-task').show();
    $('#field').addClass('result-field');
    console.log('found id: ', id + ' is in array ' + answersGivenKeys);
    this.showTask(id);  
  } else {
    console.log('Not found: ', id + ' is in array ' + answersGivenKeys);
    return false;
  }
}

//сортирует задачи и ответы
Test.prototype.sortTasks = function(data) {
  
  function shuffle(arr){
    for(var j, x, i = arr.length; i; j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
  }
  
  //перемешивает 2 массива одинаковым образом
  function shuffleTwo(array, array2) {
    var counter = array.length, temp, index;
    while (counter > 0) {
      index = Math.floor(Math.random() * counter);
      counter--;
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
      temp = array2[counter];
      array2[counter] = array2[index];
      array2[index] = temp;
    }
    arrays = [array, array2];
    return arrays;
	}
  
  //sorting tasks
  if(this.testConfig['taskOrder'] === 'dec') {
    data['tasks'].reverse();
  } else if(this.testConfig['taskOrder'] === 'rand') {
    var tasks = shuffle(data['tasks']);
    data['tasks'] = tasks;
  }
  
  //sorting answers
  if(this.testConfig['answerOrder'] === 'dec') {
    console.log('this.tasksCount: ', this.tasksCount);
    for(i = 0; i <  this.tasksCount; i++) {
      data['tasks'][i]['answers'].reverse();
      data['tasks'][i]['answer_points'].reverse();
    }
    // console.log('answers reverese: ', data);
  } else if(this.testConfig['answerOrder'] === 'rand') {
    for(i = 0; i <  this.tasksCount; i++) {
      answerAndPoints = shuffleTwo(data['tasks'][i]['answers'], data['tasks'][i]['answer_points']);
      data['tasks'][i]['answers'] = answerAndPoints[0];
      data['tasks'][i]['answer_points'] = answerAndPoints[1];
    }
  }

  return data;
} 





