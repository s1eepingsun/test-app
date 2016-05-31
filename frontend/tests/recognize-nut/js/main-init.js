$(function() {

    var testTypeDir = window.location.pathname.split('/');
    testTypeDir.pop();
    testTypeDir = testTypeDir.pop();
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
            answersView: 'right-side',
            fireworks: true,
            calculateMark1: true,
            testTimer: false,
            displayTestNumber: false,
            horizontalTaskList: true,
            showWrongs: true,
            testType: 'recognize-nut-ege',
            testTypeDir: testTypeDir

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


});