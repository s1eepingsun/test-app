console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
console.log("init");
}

$(function() {
    //инициализирует тест
    //answerOrder - сортировка ответов: rand - случайный порядок, dec - по убыванию order_num
    testApp.init({
        testConfig: {answerOrder: 'rand'} //случайный порядок для вопросов
    });

    //Подключение mathjax
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});

testApp.init = function(attrs) {
    testApp.test = new testApp.Test(attrs);
};

