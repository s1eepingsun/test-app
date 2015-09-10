$(function() {

	loadTest(1);


  //подключение редакторов
  var CKFSYS_PATH='../ckeditor/filemanager';
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
    ],
  } );
  CKEDITOR.replace( 'editor-a1', {
    height: 100,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  } );
  
  CKEDITOR.replace( 'editor-a2', {
    height: 60,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  } );
  CKEDITOR.replace( 'editor-a3', {
    height: 60,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  } );
  CKEDITOR.replace( 'editor-a4', {
    height: 60,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  } );
  CKEDITOR.replace( 'editor-a5', {
    height: 60,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  } );
  CKEDITOR.replace( 'editor-a6', {
    height: 60,
    toolbarCanCollapse: true,
    toolbarStartupExpanded : false,
    enterMode : CKEDITOR.ENTER_BR
  } );
  
})



//Посылает данные на контроллер админки через ajax
function loadTest(id) {
	var dataSend = {'id': id};
	
	$.get('controllers/adminAjax.php', dataSend, function(data) {
		console.log('data: ', data);
		var data = JSON && JSON.parse(data) || $.parseJSON(data);   
		console.log('data after json parse: ', data);
    
		//подготавливает data для mustache.js
    testData = {
			tasks: []
		};

		for (var property in data.tasks) {
			if (data.tasks.hasOwnProperty(property)) {
					console.log('property log: ', property);
					console.log('property log2: ', data.tasks[property]['answers']);
					// testData.tasks[property] = data.tasks[property];
          
          var answers = $.map(data.tasks[property]['answers'], function(value, index) {
            return [value];
          });
          data.tasks[property]['answers'] = answers;
          
          var answer_points = $.map(data.tasks[property]['answer_points'], function(value, index) {
            return [value];
          });
          data.tasks[property]['answer_points'] = answer_points;
          
          
          testData.tasks.push(data.tasks[property]);
          
			}
		}
    console.log('answers: ', answers);
		console.log('testData : ', testData);
		data = testData;
    

		//загружает главную страницу админки
		$.get('./tmpl/admin-list.mst?4981', function(template) {
			var rendered = Mustache.render(template, data);
			$('#admin-section').html(rendered);

    /*   var math = MathJax.Hub.getAllJax();
       MathJax.Hub.Queue(
          ["Typeset", MathJax.Hub, math]
      );  
      MathJax.Hub.Queue(
          ["Rerender", MathJax.Hub, math]
      );   */
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
      MathJax.Hub.Queue(["Rerender",MathJax.Hub]);
        
      $('.create-new-task').click(function() {
        $('#task-modify').val('Создать');
        $('#task-modify').attr('id', 'task-create');
        $('#task-form input[name="task_id"]').val('');
      });
      
      
      $('.single-test-data .delete-task').click(function() {
        var taskID = $(this).parent().attr('id');
        taskID = taskID.substring(5);
        deleteTask(taskID);
      });
      
       $('.single-test-data .modify-task').click(function() {
        var taskID = $(this).parent().attr('id');
        modifyTask(taskID);
      });

		});

	});
	
}

serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

//создаёт задачу
function createQuestion() {
  
  setTimeout(function() {
    var formData = $('#task-form').serialize();
    var submitButtonID = $('#task-form input[type="submit"]').attr('id');
    var action = submitButtonID.substring(5);
    var formData = formData + '&' + action + '=true';
    console.log('formData2: ', formData);
     
    /*  var datatxt = CKEDITOR.instances.editor1.getData();
     datatxt = datatxt.replace(/\r?\n/g, '');
     console.log('datatxt: ', datatxt);
     datatxt = serialize({top: datatxt});
     console.log('textarea.editor: ', datatxt);
     var formData =datatxt + '&bottom=&answer1=&answer2=&answer3=&answer4=&answer5=&answer6=&create=true';
     console.log('new form data: ',  formData); */
     
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
            alert('Возникла ошибка: ' + xhr.responseCode);
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











