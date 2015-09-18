/* console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
  console.log("init");
} */

$(function() {
  
  var testConfig = {
    taskOrder: 'rand', //порядок вопросов: inc - по возрастанию (по умолчанию), desc - по убыванию, rand - случайный порядок
    answerOrder: 'inc' //порядок ответов: inc - по возрастанию (по умолчанию), desc - наоборот, rand - случайный порядок
  };
  
  //загружает тест
  var test = new Test(testConfig);
  test.loadTest();

  
  //Подключение mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  
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

function Test(testConfig) {
  var that = this;
  this.correctAnswers = [];
  this.answersGiven = [];
  this.tasksCount = 0;
  this.testConfig = {};
  
  //обработка входных данных конфига
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
    
    //берёт данные теста переданные в сразу
    var data = phpTestData;   
    console.log('data first: ', data);
    
    //Задает номер отображаемый в html и заполняет массив correctAnswers
    //также считает max points (needed for side-bar.mst), считает задачи
    that.tasksCount= 0;
    var j = 1;
    for (var property in data.tasks) {
      if (data.tasks.hasOwnProperty(property)) {
        // console.log('data for sorting: ', data.tasks[property]);
        // console.log('data prop for sorting: ',property);
        // correctAnswers[Number(property) + 1] = data.tasks[property]['answer_points'];
        
        //заполняет correctAnswers
         that.correctAnswers[j] = data.tasks[property]['answer_points'];
        
        //считает maxPoints
        var maxPoints = 0;
        for(var i=0; i<data.tasks[property]['answer_points'].length; i++) {
          var points = Number(data.tasks[property]['answer_points'][i]);
          
          if($.isNumeric(points)) {
            maxPoints = maxPoints + points;
          }
        }
        data.tasks[property]['max_points'] = maxPoints;
        
        //ставит новые индексы и задаёт view_number
        data.tasks[j] = data.tasks[property];
        j++;
        data.tasks[property]['view_number'] = j;
        
        //считает задачи
        that.tasksCount++;
      }
    }
    console.log('data after html numbers: ', data);
    console.log('that.correctAnswers: ', that.correctAnswers);
    
    
    //сортирует согласно конфигу 
    data = that.sortTasks(data);
    
    //считает задачи
    console.log(' that.tasksCount: ',  that.tasksCount);
    
    //Новый тест
    $('#tb-new-test').click(function(e) {
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
    
		
		

  }
  

}


Test.prototype.startNewTest = function() {
  var that = this;
  console.log('new test start!');
  
  //если это не первый запуск теста, обнуляем данные и стили после показа результата (showResult)
  if(that.answersGiven !== []) {
    that.answersGiven = [];
    $('#tb-prev-task, #tb-next-task, #tb-finish-test').prop('disabled', false);
    $('#left-side-bar').find('.task-item').removeClass('answer-given');
    $('.single-test-data ').find('.answer').removeClass('answer-chosen');
    $('.single-test-data').find('.answer').removeClass('answered-wrong');
    $('#left-side-bar ').find('.task-item').removeClass('answered-wrong');
    $('.single-test-data').find('.answer').removeClass('answered-right');
    $('#left-side-bar ').find('.task-item').removeClass('answered-right');
    $('#tb-prev-task').removeClass('switched-off');
    $('#tb-next-task').removeClass('switched-off');
    $('#tb-finish-test').removeClass('switched-off');
    $('#close-result-task').hide();
    $('#field').removeClass('result-field');
    $('.test-tasks').removeClass('result-task');
  }

  //Нажатие на ответ, если последний - показывает результат теста
  $('.single-test-data .answers .answer').off();
  $('.single-test-data .answers .answer').click(function() {
    var id = $(this).parents('.single-test-data').attr('id');
    var answer = $(this).attr('answer');
    id = Number(id.substring(2));
    that.answersGiven[id] = $(this).index();
    that.answersGiven[id] = answer;
    
    console.log('answers given2: ', that.answersGiven);
    $('#vn' + id + ' .answers .answer').removeClass('answer-chosen');
    $(this).addClass('answer-chosen');
    $('#qn' + id).addClass('answer-given');
    $('.test-tasks').removeClass('result-task');
    
    console.log('id: ', id);
    
    if(id < that.tasksCount) {
      // console.log('that.tasksCount: ', that.tasksCount);
      // console.log('id: ', id);
      that.showTask(id + 1);
    } else if(id == that.tasksCount) {
      $('#tb-finish-test').click();
    }
    
    console.log('that.tasksCount: ', that.tasksCount);
  });
  
  //включить кнопки 
  
  //Выбор вопроса на сайдбаре
  $('#left-side-bar').find('.task-item').off();
  $('#left-side-bar').find('.task-item').click($.proxy(this.TestSidebarHandler, this));
  
  $('.start-massage').hide();
  $('#test-result').hide();
  $('.task-top-panel').find('.task-number').show();
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
  $('#left-side-bar').find('.task-item').removeClass('active-task');
  $('#qn' + id).addClass('active-task');
  var maxID;
  maxID = $('.side-bar-table').find('tbody').children('tr').length;

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
  var answersGiven = that.answersGiven;
  // if(answersGiven.length < 1) return false;
  
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
		that.ResultSidebarHandler(e, answersGivenKeys);
	});

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
  // var totalTasks = Number(correctAnswers.length);
  var totalTasks = Number(that.tasksCount);
  console.log('that.taskCount 2: ', that.tasksCount);
  var answersGivenCount = answersForCount.length;
  var tasksSkipped = Number(totalTasks) - Number(answersGivenCount);
  console.log('answersGivenCount: ', answersGivenCount);
  console.log('tasksSkipped: ', tasksSkipped);
  console.log('correctAnswers77: ', correctAnswers);
  console.log('answersGiven: ', answersGiven);
  
  //Проверяет правильность ответов, сравнивая correctAnswers и answersGiven
  answersGiven.forEach(function(item, i, arr) {
    var answerPoints = correctAnswers[i][item + '_points'];
    console.log('answersGiven item: ', item);
    console.log('correct answers i: ', correctAnswers[i]);
    console.log('correct answers i item _points: ', answerPoints);
    console.log('i: ', i);
    

    if($.isNumeric(answerPoints) && answerPoints > 0) {
      console.log('answer for question ' + i + ' is correct');
      totalPoints += Number(answerPoints);
      correctCount += 1;
      $('#qn' + i).addClass('answered-right');  
    } else {
      console.log('answer for question ' + i + ' is wrong');
      wrongAnswers += 1;
      $('#qn' + i).addClass('answered-wrong');
    }
  
    //окрашивает правильные ответы в основном поле
    for (var property in correctAnswers[i]) {
      var AnswerPoints2 =correctAnswers[i][property];
       if($.isNumeric(AnswerPoints2) && AnswerPoints2 > 0) {
         console.log('correctAnswers[i][property]: ', AnswerPoints2);
        console.log('property223: ', property.substring(0, 7));
        $('#vn' + i + ' .answers .answer[answer="' + property.substring(0, 7) + '"]').addClass('answered-right');
       }
    }

  });
  
  //считает макс. сумму баллов за все ответы вместе
  correctAnswers.forEach(function(item, i, arr) {
    for (var property in item) {
      // console.log('correctAnswers item property: ', item[property]);
      if($.isNumeric(item[property])) {
        maxPoints += Number(item[property]);
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
  };
  
  //загружает шаблон для показа результата теста
  $.get('./tmpl/result.mst?244', function(template) {
    console.log('render tmpl data: ', finalData);
    var rendered = Mustache.render(template, finalData);
    $('.single-test-data').hide();
    $('#test-result').show();
    $('#test-result').html(rendered);
  });
  
}

//handler для клика на сайдбар во время прохождения теста
Test.prototype.TestSidebarHandler = function(event) {
  var element = event.target;
  var id = $(element).parent().attr('id');
  id = id.substring(2);
  console.log(id);
  $('#field').removeClass('result-field');
  $('#close-result-task').hide();
  this.showTask(id);
}

//handler для клика на сайдбар во время показа результата теста
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
  
  //делает строку из массива дом элементов
  function domToString(divs) {    
    var a = '';
    for ( var j = 0; j < divs.length; j++ ) {
      // answerHTML = '<div answer="' + divs[j].attributes.answer.value + '" class="' + divs[j].className + '">' + divs[j].innerHTML + '</div>';
      var tmp = document.createElement("div");
      console.log('tmp: ', tmp);
      console.log('divs[j]: ', divs[j]);
      tmp.appendChild(divs[j]);
      a += tmp.innerHTML;
    }
    return a;
  }
  
  //перемешивает массив
  function shuffle(array) {
    var counter = array.length, temp, index;
    while (counter > 0) {
      index = Math.floor(Math.random() * counter);
      counter--;
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    arrays = [array];
    return arrays;
	}
  
  //sorting answers
  if(this.testConfig['answerOrder'] === 'desc') {
    for(i = 1; i < this.tasksCount; i++) {
      var divs = $( '#vn' + i + ' .answers .answer').get().reverse();
      var answersHTML = domToString(divs);
      $( '#vn' + i + ' .answers').html(answersHTML);
    }
  } else if(this.testConfig['answerOrder'] === 'rand') {
    for(i = 1; i < this.tasksCount; i++) {
      var divs = $( '#vn' + i + ' .answers .answer').get();
      console.log('divs: ', divs);
      var divs = shuffle(divs);
      console.log('divs after shuffle: ', divs[0]);
      var answersHTML = domToString(divs[0]);
      $( '#vn' + i + ' .answers').html(answersHTML);
    }
  }

  return data;
  
}





