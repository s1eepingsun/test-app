/**
 * Created by User on 31.08.2015.
 */
/*console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
    console.log("init");
}*/

$(function() {
    //подключение редакторов для форм админки
    attachEditors();

    //регистрация хэлперов handlebars.js
    registerHandlebarsHelpers();

    //эмуляция JSON и REST
    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;

    //инициализация теста
    window.adminTestApp = new AdminTestApp();
    adminTestApp.init();

    //Подключение mathjax
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

//главный класс админки теста, он запускает модели и вьюшки Backbone'a
function AdminTestApp() {
    //инициализация админки
    this.init = function() {
        //инициализация коллекции заданий
        var modelsArr =  _.values(phpTestData.tasks);
        console.log('_.values', _.values(phpTestData.tasks));
        this.testTasks = new TestTasks(modelsArr);

        //создаёт модель общей инфы о тесте
        var testInfoArr = phpTestData;
        delete testInfoArr['tasks'];
        this.testInfo = new TestInfo(testInfoArr);
        console.log('testTasks 45', this.testTasks);

        //подключение View списка задач
        this.taskListView = new TaskListView({model: this.testTasks}, {templateFile: 'side-bar-admin.hbs'});
        $('#left-side-bar').html(this.taskListView.render().el);

        //подключение View детального показа задач
        this.mainTestView = new MainTestView({model: this.testTasks});
        $('.test-tasks').html(this.mainTestView.render().el);

        //подключение View редактирования теста
        this.testEdit = new TestEdit({model: this.testInfo});
    }
}


//регистрация хэлперов handlebars.js
function registerHandlebarsHelpers() {
    //для показа индекса, начинающегося с 1
    Handlebars.registerHelper('plus1', function(options) {
        return new Handlebars.SafeString(
            Number(options.fn(this)) + 1
        );
    });

    //математическая сумма элементов (для показа макс. баллов за задание)
    Handlebars.registerHelper('sum', function(context) {
        var sum = 0;
        var values = _.values(context);
        for(var i=0; i<values.length; i++) {
            sum += Number(values[i]);
        }
        return sum;
    });
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

    CKEDITOR.replace( 'editor-m1', {
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