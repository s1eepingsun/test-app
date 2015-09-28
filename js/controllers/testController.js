var testApp = testApp || {};
testApp.TestController = function() {
    //клик на "Новый тест"
    $.cache('#tb-new-test').click(function () {
        testApp.testModel.startNewTest();
    });

    //клик на "Закончить тест"
    $.cache('#tb-finish-test').click(function () {
        testApp.testModel.finishTest();
    });

    //клик на ответ
    $.cache('.answers').find('.answer').click(function (e) {
        var element = e.currentTarget;
        if ($(element).hasClass('disabled')) return;

        var id = $(element).parents('.single-test-data').attr('id');
        id = Number(id.substring(2));
        var answer = $(element).attr('answer');

        //отправляет данные в модель для записи
        testApp.testModel.giveAnswer(id, answer);
    });

    //клик на "Предыдущий вопрос" в верхнем меню
    $.cache('#tb-prev-task').click(function (e) {
        if ($(e.currentTarget).hasClass('disabled')) return;
        testApp.testModel.showPrevTask();
    });

    //клик на "Предыдущий вопрос" в задаче
    $.cache('.single-test-data').find('.tb-prev-task div:last-child').click(function (e) {
        if ($(e.currentTarget).hasClass('disabled')) return;
        testApp.testModel.showPrevTask();
    });

    //клик на "Следующий вопрос" в верхнем меню
    $.cache('#tb-next-task').click(function (e) {
        if ($(e.currentTarget).hasClass('disabled')) return;
        testApp.testModel.showNextTask();
    });

    //клик на "Следующий вопрос" в задаче
    $.cache('.single-test-data').find('.tb-next-task div:last-child').click(function (e) {
        if ($(e.currentTarget).hasClass('disabled')) return;
        testApp.testModel.showNextTask();
    });

    //клик на задачу на сайдбаре
    $.cache('#left-side-bar').find('.task-item').click(function(e) {
        var element = e.target;
        var id = $(element).parent().attr('id');
        id = id.substring(2);

        testApp.testModel.sidebarClick(id, element);
    });

    //клик на крестик для закрытия задания при показе результата теста
    $.cache('#close-result-task').click(function () {
        testApp.mainView.closeTask();
    });

    //клик на "Описание"
    $.cache('#showDescription').click(function () {
        testApp.mainView.showDescription();
    });

    //клик на крестик для зарытия описания
    $.cache('.close-test-description').click(function (e) {
        $(e.currentTarget).parent().hide();
    });

};

//добавление возможности запускать и слушать события
extend(testApp.TestController, Observable);
