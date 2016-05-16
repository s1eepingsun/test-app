/*$(function() {
    /!**
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
     *!/
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


    /!*$('#bbParameters').click(function(e) {
        console.log2('testApp before', testApp);

        var testTypeDir = 'ege';
        var testType = 'math-ege';

        var data2 = loadNewTest2(testTypeDir, testType, 2);
        $('#left-side-bar').hide();
        console.log2('testModel Before parsing', data2);
        console.log2('testModel parsed', data2);
    });*!/

    //подключение mathjax
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

});*/

testApp.init = function(attrs) {
    var hash = window.location.hash.substr(1);
    hash = hash.split('&');
    var hashVars = {};
    hash.forEach(function(item, i) {
        var objElem = item.split('=');
        hashVars[objElem[0]] = objElem[1];
    });

    if(hashVars['test-start']) {
        testApp.testModel = new testApp.TestModel();
        testApp.testModel.init(attrs);
        testApp.loadNewTest2(testApp.testModel.config, hashVars['test-start'], true);
    } else if(window.sessionStorage.trainingStart) {
        testApp.testModel = new testApp.TestModel();
        testApp.testModel.init(attrs);
        var model = testApp.testModel;

        var oldData = {
            data: {},
            horizontalTaskList: model.config.horizontalTaskList,
            correctAnswers: [],
            answersGiven: [],
            pastTasksLength: 0,
            maxTestNumber: model.maxTestNumber,
            showWrongs: model.config.showWrongs
        };
        model.isFirstTraining = true;
        model.trainingTaskKeys = [];
        testApp.loadTraining(model.config.trainingTasksBatch, model.trainingTaskKeys, model.isFirstTraining, oldData);

        window.sessionStorage.removeItem('trainingStart');
    } else {
        testApp.testModel = new testApp.TestModel();
        testApp.testModel.init(attrs);

        testApp.listView = new testApp.ListView(testApp.testModel);
        testApp.listView.init();

        testApp.mainView = new testApp.MainView(testApp.testModel);
        $('.start-message').show();
        testApp.mainView.init();

        if(testApp.ReferenceBookView) {
            testApp.referenceBookView = new testApp.ReferenceBookView(testApp.testModel);
            testApp.referenceBookView.init();
        }

        testApp.testController = new testApp.TestController(testApp.testModel, testApp.mainView, testApp.listView);
        testApp.testController.init();
    }
};


testApp.loadNewTest2 = function(oldConfig, testNumber) {
    var that = this;
    var testTypeDir = 'ege';
    var currentConfig = testApp.testModel.config;

    var pathname = window.location.pathname;
    var parts = pathname.split('/');
    parts.pop();
    parts.shift();

    //crutch
    oldConfig.trainingMode = false;

    var testType;
    if(currentConfig.isTestCatalog != true) {
        testType = oldConfig.testTypeDir + '-' + testTypeDir;
        var dir = parts.join('/');
        dir = '/' + dir + '/';
    } else {
        parts.push(currentConfig.maxCountTestType);
        dir = parts.join('/');
        dir = '/' + dir + '/';
        window.location = dir + 'index.php#test-start=' + testNumber;
        testType = currentConfig.maxCountTestType + '-' + testTypeDir;
    }


    console.log2('dir: ', parts, dir);
    console.log2('testApp.loadNewTest2 oldConfig, testNumber: ', oldConfig, testNumber);

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //if(data && data.testNumber) console.log2('data.testNumber:', data.testNumber);

    var randomTests = window.sessionStorage.randomTests;

    console.log2('typeof testNumber:', typeof testNumber);
    if(typeof testNumber === 'undefined') {
        //console.log2('no data.testNumber', typeof testNumber);
        var maxTestNumber = testApp.testModel.maxTestNumber;
        var currentTestNumber = testApp.testModel.currentTestNumber;
        //var showWrongs = testApp.testModel.config.showWrongs;
        if(randomTests == 'true') {
            testNumber = getRandomInt(1, maxTestNumber);
            while(testNumber == currentTestNumber) {
                testNumber = getRandomInt(1, maxTestNumber);
            }
        } else {
            if(currentTestNumber != maxTestNumber) {
                console.log2('----------- currentTestNumber != maxTestNumber', currentTestNumber, maxTestNumber);
                testNumber = Number(currentTestNumber) + 1;
            } else {
                console.log2('----------- currentTestNumber == maxTestNumber');
                testNumber = 1;
            }
        }
    //} else {
    //    testNumber = data.testNumber;
    }

    showWrongs = currentConfig.showWrongs;


    var testHistory = currentConfig.testHistory;
    var lastInHistory = testHistory[testHistory.length - 1];
    //console.log2('testHistory, lastInHistory, testNumber, model.currentTestNumber(old model)', testHistory, lastInHistory, testNumber, testApp.testModel.currentTestNumber);
    if(testHistory.indexOf(testNumber) < 0) {
        testHistory.push(testNumber);
    } else if(testHistory.indexOf(testNumber) > -1 && testNumber != lastInHistory) {
        testHistory.splice(testHistory.length - 1, 1);
        //testNumber = testHistory[testHistory.length - 1];
    } else if(typeof lastInHistory === 'undefined') {
        testHistory.push(testNumber);
    } else if(testHistory.length > 1) {
        testNumber = testHistory[testHistory.length - 1];
        testHistory.splice(testHistory.length - 1, 1);
    }
    //if loading test from dir without specific test (e.g. gims/)
    if(testNumber == 'undefined') testNumber = 1;

    testApp.testModel.currentTestNumber = testNumber;

    //console.log2('new testHistory, testNumber, currentTestNumber', testHistory, testNumber, testApp.testModel.currentTestNumber);

    var fileName = testType + '-' + testNumber;

    console.log2('fileName', fileName);

    var reqData = {
        dir: dir,
        testTypeDir: testTypeDir,
        fileName: fileName
    };


    console.log2('reqData', reqData);

    if(parts.length == 3) {
        var pathToAjax = '../../controllers/testDataAjax.php';
    } else if(parts.length == 4) {
        pathToAjax = '../../../controllers/testDataAjax.php';
    }

    $.get(dir + pathToAjax, reqData, function(data) {
        //data2 = JSON.parse(data);
        //data2 = JSON.parse(data2);
        //console.log2('response data1:', data);
        data2 = $.parseJSON(data);

        //console.log2('response data2:', data2);

        console.log2('Type of data2', typeof data2);
        if(typeof data2 !== 'object') {
            data2 = $.parseJSON(data2);
        }

        console.log2('response data3:', data2);

        that.data2 = data2;


        if (window.testApp) {
            if (window.testApp.testModel) delete testApp.testModel;
            if (window.testApp.listView) delete testApp.listView;
            if (window.testApp.horizontalTaskList) delete testApp.horizontalTaskList;
            if (window.testApp.horizontalListView) delete testApp.horizontalListView;
            if (window.testApp.mainView) delete testApp.mainView;
            if (window.testApp.testController) delete testApp.testController;
        }

        delete testApp.observable;
        testApp.observable = new Observable();

        var testTypeDir = window.location.pathname.split('/');
        testTypeDir.pop();
        testTypeDir = testTypeDir.pop();


        testApp.testModel = new testApp.TestModel();
        testApp.testModel.data = data2;
        testApp.testModel.currentTestNumber = testNumber;
        testApp.testModel.init({config: oldConfig}, data2);

        if(typeof oldConfig.horizontalTaskList === 'undefined' || oldConfig.horizontalTaskList != true) {
            testApp.listView = new testApp.ListView(testApp.testModel);
            testApp.listView.renderTasksList(data2);
            testApp.listView.init();
        } else {
            testApp.horizontalListView = new testApp.HorizontalListView(testApp.testModel);
            testApp.horizontalListView.renderTaskList(data2);
            testApp.horizontalListView.init();
        }

        testApp.mainView = new testApp.MainView(testApp.testModel);
        testApp.mainView.renderTaskMainView(data2);

        //testApp.mainView.renderTaskListHorizonal(data2);
        testApp.mainView.init();

        testApp.testController = new testApp.TestController(testApp.testModel, testApp.mainView, testApp.listView, testApp.horizontalListView);
        testApp.testController.init();

        //testApp.mainView.fireEvent('view:clickStart');

        if(typeof MathJax !== 'undefined') {
            testApp.mainView.loadingAnimationOn();

            MathJax.Hub.Register.StartupHook("End",function () {
                testApp.mainView.loadingAnimationOff();
                testApp.mainView.fireEvent('view:clickStart');
            });

            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        } else {
            testApp.mainView.fireEvent('view:clickStart');
        }
    }).fail(function(data, data2, data3) {
        console.log2( "error", data , data2, data3);
    });


    window.location.hash = '';
};

testApp.loadTraining = function(tasksQuantity, taskKeys, isFirstTraining, oldData, oldConfig) {
    var that = this;
    console.log2('loadTraining: isFirstTraining', isFirstTraining, oldData, oldConfig);

    var isStillFirstTraining = isFirstTraining;
    if(!isFirstTraining) {
        var lastID = Object.keys(oldData.data.tasks).length + 1;
    }

    var horizontalTaskList = oldData.horizontalTaskList;
    var horListHeightAdjusted = oldData.horListHeightAdjusted;
    var testTypeDir = 'ege';
    var testType = 'math-ege';
    var pathname = window.location.pathname;
    var parts = pathname.split('/');
    console.log2('main2 205 location.parthname', parts);
    parts.pop();
    var subject = parts.pop(); //i.e. math
    parts.shift();
    var dir = parts.join('/');
    dir = '/' + dir + '/' + subject + '/';

    testType = subject + '-' + testTypeDir;

    var reqData = {
        dir: dir,
        testTypeDir: testTypeDir,
        fileName: testType,
        tasksQuantity: tasksQuantity,
        taskKeys: taskKeys
    };

    console.log2('reqData:', reqData);

    if(parts.length == 2) {
        var pathToAjax = '../../controllers/trainingAjax.php';
    } else if(parts.length == 3) {
        pathToAjax = '../../../controllers/trainingAjax.php';
    }

    $.get(pathToAjax, reqData, function(data) {
        data = $.parseJSON(data);

        console.log2('response data2:', data);

        if(Object.keys(data).length == 0) {
            testApp.mainView.showTrainingEnd();
            testApp.mainView.disablePrevButtons();
            testApp.mainView.disableNextButtons();
            return;
        }

        data2 = {tasks: data};

        that.data2 = data2;


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
        testApp.testModel.lastID = lastID;
        testApp.testModel.trainingTaskKeys = reqData.taskKeys;
        testApp.testModel.maxTestNumber = oldData.maxTestNumber;


        var testTypeDir = window.location.pathname.split('/');
        testTypeDir.pop();
        testTypeDir = testTypeDir.pop();
        //testApp.testModel.trainingTaskKeys = taskKeys;

        //in dir gims/ there is no oldConfig
        if(typeof oldConfig === 'undefined') {
            oldConfig = {
                showWrongs: oldData.showWrongs,
                horizontalTaskList: horizontalTaskList,
                horListHeightAdjusted: horListHeightAdjusted
            }
        }

        oldConfig.trainingMode = true;
        oldConfig.testTypeDir = testTypeDir;

        /*testApp.testModel.init({config:{
            //answerOrder: 'rand'
            showWrongs: oldData.showWrongs,
            horizontalTaskList: horizontalTaskList,
            horListHeightAdjusted: horListHeightAdjusted,
            trainingMode: true,
            testTypeDir: testTypeDir
        }}, data2);*/
        testApp.testModel.init({config:oldConfig}, data2);

        if(isFirstTraining == false) {
            console.log2('isFirstTraining == false -> merging data');
            //console.log2('testApp.testModel.isFirstTraining', testApp.testModel.isFirstTraining);

            var newData = {
                data: testApp.testModel.data,
                correctAnswers: testApp.testModel.correctAnswers
            };


            testApp.testModel.mergeOldData(oldData, newData);

            console.log2('new merged tasksCount', testApp.testModel.tasksCount);
        } else {
            //testApp.testModel.isFirstTraining = false;
        }


        data2 = testApp.testModel.data;
        data2['maxTestNumber'] = testApp.testModel.maxTestNumber;
        console.log2('testModel.data, answersGiven', data2, testApp.testModel.answersGiven);
        var answersGiven = testApp.testModel.answersGiven;


        /*testApp.listView = new testApp.ListView(testApp.testModel);
        testApp.listView.renderTasksList(data2);
        testApp.listView.init();*/


        testApp.mainView = new testApp.MainView(testApp.testModel);
        testApp.mainView.renderTaskMainView(data2);
        testApp.mainView.init();
        console.log2('testApp.testModel.showTask(lastID)', lastID);
        //var lastID = testApp.testModel.trainingTaskKeys.length + 1;
        //testApp.testModel.showTask(lastID);



        testApp.testModel.isFirstTraining = isStillFirstTraining;

        testApp.testController = new testApp.TestController(testApp.testModel, testApp.mainView, testApp.listView);
        testApp.testController.init();

        if(horListHeightAdjusted == true) {
            testApp.testModel.config.horListHeightAdjusted = false;
            testApp.horizontalListView = new testApp.HorizontalListView(testApp.testModel);
            testApp.horizontalListView.lengthenField();
        }

        //testApp.mainView.fireEvent('view:clickStart');
        //testApp.testModel.showGivenAnswers(answersGiven);

        //if(typeof MathJax !== 'undefined') MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        if(typeof MathJax !== 'undefined') {
            testApp.mainView.loadingAnimationOn();
            MathJax.Hub.Register.StartupHook("End",function () {
                testApp.mainView.loadingAnimationOff();
                //testApp.mainView.fireEvent('view:clickStart');
                testApp.mainView.fireEvent('view:clickStart');
                testApp.testModel.showGivenAnswers(answersGiven);
            });

            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        } else {
            //testApp.mainView.fireEvent('view:clickStart');
            testApp.mainView.fireEvent('view:clickStart');
            testApp.testModel.showGivenAnswers(answersGiven);
        }
    });

};



