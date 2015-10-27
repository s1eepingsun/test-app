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
            //answerOrder: 'inc'
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

    /*$('#bbParameters').click(function(e) {
        console.log2('testApp before', testApp);

        var testTypeDir = 'ege';
        var testType = 'math-ege';

        var data2 = loadNewTest2(testTypeDir, testType, 2);
        $('#left-side-bar').hide();
        console.log2('testModel Before parsing', data2);
        console.log2('testModel parsed', data2);
    });*/

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

function loadNewTest2(testNumber) {
    var that = this;
    var testTypeDir = 'ege';
    var testType = 'math-ege';
    var pathname = window.location.pathname;
    var parts = pathname.split('/');
    parts.pop();
    parts.shift();
    var dir = parts.join('/');
    dir = '/' + dir + '/';
    console.log2('dir: ', dir);

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    if(testNumber) console.log2('**************** test NUmber', testNumber);

    if(!testNumber) {
        var randomTests = testApp.testModel.randomTests;
        var maxTestNumber = testApp.testModel.maxTestNumber;
        var currentTestNumber = testApp.testModel.currentTestNumber;
        if(randomTests == true) {
            testNumber = getRandomInt(1, maxTestNumber);
            while(testNumber == currentTestNumber) {
                testNumber = getRandomInt(1, maxTestNumber);
            }
        } else {
            if(currentTestNumber != maxTestNumber) {
                console.log2('------------------ currentTestNumber != maxTestNumber', currentTestNumber, maxTestNumber);
                testNumber = Number(currentTestNumber) + 1;
            } else {
                console.log2('------------------ currentTestNumber == maxTestNumber');
                testNumber = 1;
            }
        }
    } else {}


    testApp.testModel.currentTestNumber = testNumber;

    console.log2('testNumber, currentTestNumber', testNumber, testApp.testModel.currentTestNumber);

    var fileName = testType + '-' + testNumber;

    console.log2('fileName', fileName);

    var reqData = {
        dir: dir,
        testTypeDir: testTypeDir,
        fileName: fileName
    };

    console.log2('reqData ---------------------------------------------------', reqData);

    $.get(dir + 'controllers/testDataAjax.php', reqData, function(data) {
        //data = $.parseJSON(data);

        //data2 = JSON.parse(data);
        //data2 = JSON.parse(data2);
        console.log2('response data1:', data);
        data2 = $.parseJSON(data);

        console.log2('response data2:', data2);

        console.log2('Type of data2', typeof data2);
        if(typeof data2 !== 'object') {
            data2 = $.parseJSON(data2);
        }

        console.log2('response data3:', data2);
        //that.wholeTestData = data2;
        //console.log2('response data2:', that.wholeTestData);
        that.data2 = data2;


        delete testApp.testModel;
        delete testApp.listView;
        delete testApp.mainView;
        delete testApp.testController;
        if (window.testApp) {
            if (window.testApp.testModel) delete testApp.testModel;
            if (window.testApp.testModel) delete testApp.listView;
            if (window.testApp.testModel) delete testApp.mainView;
            if (window.testApp.testModel) delete testApp.testController;
        }

        delete testApp.observable;
        testApp.observable = new Observable();
        
        testApp.testModel = new testApp.TestModel();
        testApp.testModel.data = data2;
        testApp.testModel.randomTests = randomTests;
        testApp.testModel.currentTestNumber = testNumber;
        testApp.testModel.init({config:{
            //answerOrder: 'rand'
        }}, data2);


        console.log2('testModel.data', testApp.testModel.data);


        //delete testApp.listView;
        testApp.listView = new testApp.ListView(testApp.testModel);
        testApp.listView.renderTasksList(data2);
        testApp.listView.init();


        //delete testApp.mainView;
        testApp.mainView = new testApp.MainView(testApp.testModel);
        testApp.mainView.renderTaskMainVIew(data2);
        testApp.mainView.init();

        //delete testApp.testController;
        //console.log2('in ajax testApp.testController', testApp.testController);
        testApp.testController = new testApp.TestController(testApp.testModel, testApp.mainView, testApp.listView);
        //console.log2('in ajax testApp.testController', testApp.testController);
        testApp.testController.init();
        //console.log2('in ajax testApp.testController', testApp.testController);

        testApp.mainView.fireEvent('view:clickStart');

        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

    });



    return this.data2;
}



