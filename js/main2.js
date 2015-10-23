$(function() {
    /**
     * метод инициализирует тест
     * Пояснения к конфигу:
     * answerOrder - сортировка ответов: 'rand' - случайный порядок, 'dec' - по убыванию order_num
     * taskTimer - использовать ли индивидуальный таймер для каждой задачи
     * taskTimerMode - 'inc' - отчитывает время с нуля, 'dec' - обратный отчёт со времени заданного в админке
     * freeTaskChange - позволить ли свободно переключать задачи? (иначе только по порядку)
     * lastTaskFinish - заканчивать тест после ответа на последний вопрос
     * multipleChoices - позволяет выбирать несколько ответов на один вопрос одновременно
     * navInResult - включить кнопки навигации "след. вопрос" & "пред. вопрос" при показе результата
     * resultAnswersStyle - стиль отображения ответов при показе результатов теста:
     *      по умолчанию - закрашивает неправильные и закрашивает правильные с более высоким приоритетом;
     *      'wrong-borders' - все правильные ответы - зелёный фон, все данные ответы: правильные - чёрная граница, неправильные - красная границей;
     *      'answered-borders' - все правильные ответы - зелёный фон, все данные ответы - чёрная граница, неправильные данные ответы - красный фон
     *      'right-wrong-borders' - все данные ответы - серай фон, правильные - зелёная граница, неправильные - красная граница
     */
    testApp.init({
        config: {
            //answerOrder: 'inc',
            //taskTimer: true,
            //taskTimerMode: 'inc'
            //freeTaskChange: false
            //lastTaskFinish: true,
            //multipleChoices: false,
            //resultAnswersStyle: 'wrong-border',
            //navInResult: true,
            //production: false
        }
    });

    $('#bbParameters').click(function(e) {
        console.log('testApp before', testApp);

        var testTypeDir = 'ege';
        var testType = 'math-ege';

        var data2 = loadNewTest2(testTypeDir, testType, 2);
        console.log2('testModel Before parsing', data2);
        //var wholeData = JSON.parse(this.wholeTestData);

        console.log2('testModel parsed', data2);
        //testApp.ListView.renderTasksList(data2);
        //testApp.MainView.renderTaskMainVIew(data2);



       /* delete testApp.testModel;
        delete testApp.listView;
        delete testApp.mainView;
        delete testApp.testController;

        console.log('testApp after', testApp);

        testApp.init();

        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);*/



        /*testApp.loadNewTest(testApp.testTypeDir, testApp.testType, 2);
        var wholeData = JSON.parse(this.wholeTestData);

         //console.log2('testModel parsed', wholeData);
         testApp.ListView.renderTasksList(wholeData);
         testApp.MainView.renderTaskMainVIew(wholeData);
         testApp.init();*/
    });

    //подключение mathjax
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

});

testApp.init = function(attrs) {
    testApp.testModel = new testApp.TestModel();
    testApp.testModel.init(attrs);

    testApp.listView = new testApp.ListView(testApp.testModel);
    testApp.listView.init();

    testApp.mainView = new testApp.MainView(testApp.testModel);
    testApp.mainView.init();

    testApp.testController = new testApp.TestController(testApp.testModel, testApp.mainView, testApp.listView);
    testApp.testController.init();
};

/*testApp.testTypeDir = 'ege';
testApp.testType = 'math-ege';*/

function loadNewTest2(testTypeDir, testType, testNumber) {
    var that = this;
    var pathname = window.location.pathname;
    var parts = pathname.split('/');
    parts.pop();
    parts.shift();
    var dir = parts.join('/');
    dir = '/' + dir + '/';
    console.log('dir: ', dir);
    var fileName = testType + '-' + testNumber;

    var reqData = {
        dir: dir,
        testTypeDir: testTypeDir,
        fileName: fileName
    };

    console.log('reqData', reqData);

    $.get(dir + 'controllers/testDataAjax.php', reqData, function(data) {
        //data = $.parseJSON(data);
        data2 = JSON.parse(data);
        data2 = JSON.parse(data2);
        console.log('response data1:', data2);
        //that.wholeTestData = data2;
        //console.log('response data2:', that.wholeTestData);
        that.data2 = data2;


        delete testApp.testModel;
        testApp.testModel = new testApp.TestModel();
        testApp.testModel.init({config:{}}, data2);

        testApp.listView.renderTasksList(data2);
        delete testApp.listView;
        testApp.listView = new testApp.ListView(testApp.testModel);
        testApp.listView.init();

        testApp.mainView.renderTaskMainVIew(data2);
        delete testApp.mainView;
        testApp.mainView = new testApp.MainView(testApp.testModel);
        testApp.mainView.init();

        /*delete testApp.testController;
        testApp.testController = new testApp.TestController(testApp.testModel, testApp.mainView, testApp.listView);
        testApp.testController.init();*/
    });

    return this.data2;
}



