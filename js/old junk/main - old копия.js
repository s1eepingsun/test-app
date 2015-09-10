/* console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
  console.log("init");
} */

$(function() {
	//загружает тест
	loadTest();
  
  //отключает прокрутку страницы при прокрутке центрального блока
  $('#field').on('mouseenter', function () {
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
  });

})

//загружает тесты
function loadTest() {
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
          showTask(id + 1);
        } else if(id == tasksCount) {
          showResult(correctAnswers, answersGiven);
        }
      });
      
      //Новый тест
      $('#tb-new-test').click(function() {
        startNewTest();
      });
      
      //Предыдущий вопрос
      $('#tb-prev-task').click(function() {
        var id = $('#left-side-bar .active-task').attr('id');
        id = Number(id.substring(2));
        if(id > 1) showTask(id - 1);
      });
      
      //Следующий вопрос
      $('#tb-next-task').click(function() {
        var id = $('#left-side-bar .active-task').attr('id');
        id = Number(id.substring(2));
        if(id < tasksCount) showTask(id + 1);
      });

      //Закончить тест
      $('#tb-finish-test').click(function() {
        showResult(correctAnswers, answersGiven);
      });
      
      //Начать показав первое задание
      showTask(1);
      $('.single-test-data').hide();
      $('#left-side-bar .task-item').removeClass('active-task');
 
		});
    
    //Загружает сайдбар
    $.get('./tmpl/side-bar.mst', function(template) {
			var rendered = Mustache.render(template, data);
			$('#left-side-bar').html(rendered);

      //Начать показав первое задание (1 раз при загрузке каждого шаблона mst)
      showTask(1);
      $('.single-test-data').hide();
      $('#left-side-bar .task-item').removeClass('active-task');

		});

	});
	
}

//Начинает новый тест
function startNewTest() {
  console.log('new test start!');
  $('#left-side-bar .task-item').removeClass('answer-given');
  $('.single-test-data .answer').removeClass('answer-chosen');
  $('#left-side-bar .task-item').removeClass('answered-wrong');
  answersGiven = [];
  
  //Выбор вопроса на сайдбаре
  $('#left-side-bar .task-item').click(function() {
    var id = $(this).attr('id');
    id = id.substring(2);
    console.log(id);
    showTask(id);
  });
  
  $('.start-massage').hide();
  $('#test-result').hide();
  showTask(1);
  
  //timer
  $('#time-left').html('30:00');
  var time = $('#time-left').html();
  if (time != null) {
    Timer.init();
    Timer.start();
  }
}

//Показывает задачу номер id
function showTask(id) {
  $('.single-test-data').hide();
  $('#vn' + id).show();
  $('#left-side-bar .task-item').removeClass('active-task');
  $('#qn' + id).addClass('active-task');
}

function getTimeSpent() {
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
function showResult(correctAnswers, answersGiven) {
  Timer.stop();
  var timeSpent = getTimeSpent();
  
  console.log('ff');
  console.log('answerPoints: ', correctAnswers);
  console.log('answersGiven: ', answersGiven);
  
  //массив для подсчет реального количества данных ответов
  var answersForCount = [];
  $.map(answersGiven, function(value, index) {
    if(typeof value !== 'undefined') answersForCount.push(value);
  });
  console.log('answersForCount: ', answersForCount);
  
  
  
  $('#left-side-bar .task-item').removeClass('active-task');
  $('.start-massage').hide();
   
  var totalPoints = 0;
  var maxPoints = 0;
  var wrongAnswers = 0;
  var correctCount = 0;
  var totalTasks = Number(correctAnswers.length) - 1;
  var answersGivenCount = answersForCount.length;
  console.log('answersGivenLL: ', answersForCount.length);
  console.log('answersGivenCount: ', answersGivenCount);
  var tasksSkipped = Number(totalTasks) - Number(answersGivenCount);
  console.log('tasksSkipped: ', tasksSkipped);
  
  //Проверяет правильность ответов, сравнивая correctAnswers и answersGiven
  correctAnswers.forEach(function(item, i, arr) {
    var answerPoints =  item[answersGiven[i]];
    console.log('answersGiven22: ', item);
    console.log('answerPoints: ', answerPoints);
    
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
        $('#qn' + i).addClass('active-task');
        console.log('color as Right: ', i);
      } 
    } else if(typeof(answerPoints) === 'undefined') {
        console.log('data should be undef: ');
    } else {
      wrongAnswers += 1;
      $('#qn' + i).addClass('answered-wrong');
      console.log('color as wrong2: ', i);
    }
    
    for(var i=0; i<item.length; i++) {
      var points = Number(item[i]);
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





