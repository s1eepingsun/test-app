$(function() {

	 // loadTest(1);
   
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    MathJax.Hub.Queue(["Rerender",MathJax.Hub]);

  //подключение редакторов
  attachEditors();

  //блок кнопок
  $('.task-full').click(function() {
    $(this).parents('.single-test-data').hide();
    $(this).parents('.single-test-data').next('.task-short').show();
  });
  
  $('.task-short').click(function() {
    $(this).hide();
    $(this).prev('.single-test-data').show();
  });
  
  $('.side-bar-tasks a').click(function(e) {
    var id = $(this).attr('id');
    id = Number(id.substring(2));
    console.log('id: ', id);
    
    $('#task_' + id).show();
    $('#task_' + id).next('.task-short').hide();
    
    var offset = $('#task_' + id).offset().top - 10;
    $('html,body').animate({scrollTop: offset}, 'fast');

    return false;
  });
  
  //создать новое задание
  $('.create-new-task').click(function() {
    $('#task-modify').val('Создать');
    $('#task-modify').attr('id', 'task-create');
    $('#task-form input[name="task_id"]').val('');
    $('#task-form input[name="order_num"]').val('');
    var formOffset = $("#task-form").offset().top - 35;
    $('html,body').animate({scrollTop: formOffset}, 'fast');
  });
  
  //редактировать задачу
  $('.single-test-data .modify-task').click(function() {
    var taskID = $(this).parent().attr('id');
    modifyTask(taskID);
  });
  
  //удалить задачу
  $('.single-test-data .delete-task').click(function() {
    var taskID = $(this).parent().attr('id');
    taskID = taskID.substring(5);
    deleteTask(taskID);
    console.log('data: ', taskID);
  });
  
  $('.collapse-all-tasks').click(function() {
    $('.test-tasks .single-test-data').hide();
    $('.test-tasks .single-test-data').next('.task-short').show();
  });
  
  $('.expand-all-tasks').click(function() {
    $('.test-tasks .single-test-data').show();
    $('.test-tasks .single-test-data').next('.task-short').hide();
  });
  
  var winHeight = $(window).height();
  $('#sidebar .side-bar-tasks').css('max-height', winHeight);
  
  //отключает прокрутку страницы при прокрутке сайдбара
  sideBarScroll();
  
});


serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

//создаёт / изменяет задачу (form onsubmit)
function createTask() {
  setTimeout(function() {
    var formData = $('#task-form').serialize();
         console.log('formData after serialize: ', formData);
    var submitButtonID = $('#task-form input[type="submit"]').attr('id');
    var action = submitButtonID.substring(5);

    formData = inlineMathToBlock(formData);
    console.log('formData: ', formData);
    
    formData = formData + '&' + action + '=true';
    console.log('formData2: ', formData);
    
    $.ajax({
      type: 'POST',
      url: 'controllers/adminAjax.php',
      data: formData,
      success: function(data) {
        $('.response').html(data);
        setTimeout(function() {
          // location.reload(true);
        });
      },
      error:  function(xhr, str) {
            console.log('Возникла ошибка: ' + xhr.responseCode);
      }
    });
  }, 200);
  
}

//удаляет задачу
function deleteTask(id) {
  var deleteData = 'delete=true&id=' + id;
  console.log('delete: ', id);
	$.ajax({
		type: 'POST',
		url: 'controllers/adminAjax.php',
		data: deleteData,
		success: function(data) {
			$('.response').html(data);
      $('.single-test-data[id="task_' + id + '"]').remove();
		},
		error:  function(xhr, str){
			alert('Возникла ошибка: ' + xhr.responseCode);
		}
	});
}

//редактировать задачу (заполняет форму данными из файла)
function modifyTask(id) {
  id = id.substring(5);
  console.log('modify task id: ', id);
  
  $('#task-create').val('Изменить');
  $('#task-create').attr('id', 'task-modify');
  
  //new modify
  $.post('./controllers/adminAjax.php', function(data) {
    var data = JSON && JSON.parse(data) || $.parseJSON(data);
    data = data.tasks[id];
    console.log('data m2: ', data);
    
    for (var property in data.answers) {
      if (data.answers.hasOwnProperty(property)) {
        var answerID = property.substring(6);
        var ckEditorID = '#cke_editor-a' + answerID;
        console.log('data.answers[property]: ', data.answers[property]);
        console.log('property55: ', property);
        var aCon =  $('#cke_editor-a1 .cke_wysiwyg_frame').contents().find('body').html();
        console.log('aCon: ', aCon);
         // $('#cke_editor-a1 .cke_wysiwyg_frame').contents().find('body').html('testin\'');

        // $('#task-form textarea[name="' + property + '"]').val(data.answers[property]);
        $(ckEditorID + ' .cke_wysiwyg_frame').contents().find('body').html(data.answers[property]);
      }
    }
    
    for (var property in data.answer_points) {
			if (data.answer_points.hasOwnProperty(property)) {
        $('#task-form input[name="' + property + '"]').val(data.answer_points[property]);
      }
    }
    
    $('#task-form input[name="order_num"]').val(data.order_num);
    $('#task-form input[name="type"]').val(data.type);
    $('#cke_editor1 .cke_wysiwyg_frame').contents().find('body').html(data.task_content);
    $('#task-form input[type="hidden"').val(id);
    
    var formOffset = $("#task-form").offset().top - 50;
    $('html,body').animate({scrollTop: formOffset}, 'fast');
  });
  
}

//отключает прокрутку страницы при прокрутке сайдбара
function sideBarScroll() {
  var winHeight = $(window).height();
  var sidebarHeight = $('#sidebar .side-bar-tasks').height();
  
  if(1 || sidebarHeight >= winHeight) {
    $('#sidebar .side-bar-tasks').on('mouseenter', function () {
      $('html,body').on('mousewheel', function (e) {
          e.preventDefault();
      });
      $('#sidebar .side-bar-tasks').on('mousewheel', function (e) {
          var step = 30;
          var direction = e.originalEvent.deltaY > 0 ? 1 : -1;
          $(this).scrollTop($(this).scrollTop() + step * direction);
      });
    });
    $('#sidebar .side-bar-tasks').on('mouseleave', function () {
        $('html,body').off('mousewheel');
    });
  }
}

//заменить инлайновый mathjax на "блочный" (в нем font-size одинаковый у всех элементов)
//делается регекспом на html закодированной строке заменой /( и /) на /[ и /]
function inlineMathToBlock(string) {
  var expr = /(&answer[0-9]=.+?)(\%5C\))/g;
  var expr2 = /(&answer[0-9]=.+?)(\%5C\()/g;
  var newString = string.replace(expr, '$1%5C]');
  var newString = newString.replace(expr2, '$1%5C[');
   return newString;
}

//подключает редакторы
function attachEditors() {
  var CKFSYS_PATH='../../ckeditor/filemanager';
  
  CKEDITOR.replace( 'editor1', {
    // File manager
    filebrowserBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
    filebrowserImageBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?type=Image&Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
    toolbarGroups: [
      { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
      { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
      /* 	{ name: 'forms', groups: [ 'forms' ] }, */
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
      { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
      { name: 'links', groups: [ 'links' ] },
      { name: 'insert', groups: [ 'insert' ] },
      '/',
      { name: 'styles', groups: [ 'styles' ] },
      { name: 'colors', groups: [ 'colors' ] },
      { name: 'tools', groups: [ 'tools' ] },
      { name: 'others', groups: [ 'others' ] },
      { name: 'about', groups: [ 'about' ] }
    ]
  });

  CKEDITOR.replace( 'editor-d1', {
    // File manager
    filebrowserBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
    filebrowserImageBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?type=Image&Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
    toolbarGroups: [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        /* 	{ name: 'forms', groups: [ 'forms' ] }, */
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        '/',
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] }
    ]
  });

  CKEDITOR.replace( 'editor-d2', {
    // File manager
    filebrowserBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
    filebrowserImageBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?type=Image&Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
    toolbarGroups: [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        /* 	{ name: 'forms', groups: [ 'forms' ] }, */
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        '/',
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] }
    ]
  });

  
  CKEDITOR.replace( 'editor-a1', {
    height: 40,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  });
  CKEDITOR.replace( 'editor-a2', {
    height: 40,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  });
  CKEDITOR.replace( 'editor-a3', {
    height: 40,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  });
  CKEDITOR.replace( 'editor-a4', {
    height: 40,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  });
  CKEDITOR.replace( 'editor-a5', {
    height: 40,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  });
  CKEDITOR.replace( 'editor-a6', {
    height: 40,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  });
  
}

