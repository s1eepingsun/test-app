console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
console.log("init");
}

$(function() {
    //инициализировать тест
    new Test({
        testConfig: {answerOrder: 'rand'} //случайный порядок для вопросов
    });

    //Подключение mathjax
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

/**
 * Created by User on 25.08.2015.
 */
