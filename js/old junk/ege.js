'use strict';
function Ege() {

    var that = this;
    //ajax config
    $.ajaxSetup({cache: false, type: "POST", url: './ajax_request.php'});


    //получить из тестов по предмету нужный
    function getTestFromArray(obj) {
        //выдаем первый найденный тест
        for (var key in obj) {
            if (typeof(obj[key] != 'undefined')) {
                return obj[key];
            }
        }
        return false;
    }

    this.getQuestions = function (id) {
        var data = {};
        data['id'] = id;
        $.ajax({
            data: {type: 'getQuestions', data: data},
            success: function (data) {
                //проверяем корректность объекта
                var response=$.parseJSON(data);
                if(typeof response =='object') {
                    //если тест уже был, тормозим таймер и убиваем его
                    if (typeof(that.test) != 'undefined') {
                        that.test.timer_obj.stop();
                        that.test.timer_obj.clear();
                    }
                    that.test = new Test();
                    that.test.fill(getTestFromArray(response));
                    that.fillLeftPanel(that.test);
                    that.test.Mode.statusGame();
                } else{
                    console.log('не удалось получить корректный объект теста');
                }
            }
        });
    };

    this.start_test = function () {
        that.getQuestions(that.active_subject_id);
    };

    //обработчики событий
    $('.new').bind('click', this.start_test);
    $('.new_test').bind('click',this.start_test);
    $('.subjects div').bind('click', this.subject_click);

}

//получить выбранный предмет
Ege.prototype.active_subject_id=function(){
    return $('.yellow').attr('id');
};

//клик по предмету
Ege.prototype.subject_click=function(){
    if (!$(this).hasClass('off')) {
        $('.subjects div').removeClass('yellow');
        $(this).removeClass('white');
        $(this).addClass('yellow');
    }
};


//заполняем левую панель
Ege.prototype.fillLeftPanel=function(test){

    function desc(question) {
        var tmp = '';
        for (var i = 0; i < question.length; i++) {
            var count = i + 1;
            tmp += '<div class="shot_desc" id="' + i + '"><div class="inline img-check"></div><div class="inline right">' + count + '.</div><div class="inline left">(' + question[i].chapter + '.' + question[i].number + ')' + '</div><div class="inline balls"> '+question[i].balls+' </div></div>';
        }
        return tmp;
    }

    var panel = $('.left_panel');
    if (!panel[0]) {
        panel = $('<div class="left_panel"></div>');
        var test_window = $('.test_window');
        panel.offset({top: test_window.offset().top, left: test_window.offset().left - 100 - 25});
        $('.wrap').append(panel);
        $('.left_panel').css('visibility', 'visible');
    } else {
        $('.left_panel').empty();
    }
    panel.html(desc(test.question));
    //удаляем все выделения, если есть
    panel.find('div').removeClass('border_on');
    //выделяем текущий вопрос
    panel.find('#' + test.number).addClass('border_on');

    panel.find('.shot_desc').unbind();
    panel.find('.shot_desc').bind('click', function () {
        test.save();
        test.number = parseInt(this.id);
        test.showQuestion();
    });
};

//Конструктор теста

function Test() {

    /*
     * Mode
     * 1.game
     * 2.view
     */
    this.Mode='game';

    this.Mode = {

        status: 'game',

        statusGame: function () {
            this.status='game';
        },

        statusView: function () {
            this.status='view';
        }


    };

    //таймер
    this.timer_obj = new Timer($('.timer'));

    //очищаем предыдущий результат, если он есть
    $('.result').empty();

    var that = this;

    //номер вопроса
    this.number = 0;
    //массив вопросов и всей ифнормации к ним
    this.question = [];
    //массив с ответами
    this.answers = [];

    //добавление в массив с ответами
    this.add_answer = function (obj) {
        for (var i = 0; i < that.answers.length; i++) {
            if (that.answers[i].id == obj.id) {
                that.answers[i].answ = obj.answ;
                return false;
            }
        }
        this.answers.push({
            number: that.number,
            id: obj.id,
            answ: obj.answ,
            balls: Number(that.question[that.number].balls)
        });
        //подсвечиваем вопрос в панели слева
        //$('.left_panel').find('#' + that.number).addClass('answered');
        $('.left_panel').find('#' + that.number).find('.img-check').addClass('img-check-yes');
    };

    //сохраняем результат
    this.save = function () {
        var _answer='';
        if(that.question[that.number].answer_type=='one') {
            var input = $('.option_answ_input input');
            if (input[0] && input.val() != $.trim('')) {
                _answer = $('.option_answ_input input').val().replace('.', ',');
            }
        } else{
            var option_array=$('.checkbox_box .option_answ_checkbox input');
            for(var i=0;i<option_array.length;i++){
                if($(option_array[i]).prop( "checked" )) {
                    var tmp=Number($(option_array[i]).attr('id'));
                    if (_answer != '') {
                        _answer += ',' + tmp;
                    } else {
                        _answer += tmp;
                    }
                }

            }
        }
        //если ответ есть, записываем его
        if(_answer!='') {
            this.add_answer({
                number: this.number,
                id: this.question[that.number].qid,
                answ: _answer,
                balls: Number(this.question[this.number].balls)
            })
        }
    };

    //заполняем массив вопросов
    this.fill = function (data) {

        //проверяем, не включены ли кнопки
        var nav = $('.nav');
        if(!nav.hasClass('off')) {
            //кнопки серые
            nav.addClass('off');
            //выключаем навигацию
            nav.unbind();
        }

        this.question = data;

        //создаем массив ответов для каждого вопроса
        for(var i=0;i<that.question.length;i++){
            this.question[i].array_answers=[];
            if(this.question[i].options=='no'){
                this.question[i].array_answers.push(that.question[i].answ);
            } else{
                this.question[i].array_answers=that.question[i].options.split('&||');
                //если ответов несколько, то правильный ответ - номер элемента в массиве array_answers
            }
        }

        that.showQuestion();

        //включаем кнопки навигации
        var nav=$('.nav');
        nav.unbind();
        nav.bind('click', function () {
            //сохраняем результат
            that.save();
            if ($(this).hasClass('back')) {
                that.number--;
                that.showQuestion();
            } else if ($(this).hasClass('forward')) {
                that.number++;
                that.showQuestion();
            } else if ($(this).hasClass('finish')) {
                that.finish();
            }
        });
        this.timer_obj.start();
    };

    //считаем результат
    this.getResult = function () {

        function MaxBalls() {
            var balls = 0;
            for (var i = 0; i < that.question.length; i++) {
                balls += Number(that.question[i].balls);
            }
            if (balls != 0) {
                return balls;
            } else {
                return 0;
            }
        }

        //убираем ненужное выделение в левой панели
        $('.left_panel .shot_desc').removeClass('border_on');
        if (this.answers.length == 0) {
            return '<div class="h3">Вы не ответили ни на один вопрос.</div>';
        } else {
            var time = this.timer_obj.get();
            var balls = 0;
            for (var i = 0; i < this.answers.length; i++) {
                for (var j = 0; j < this.question.length; j++) {
                    if (this.answers[i].id == this.question[j].qid) {
                        if (this.answers[i].answ == this.question[j].answ) {
                            balls = balls + this.answers[i].balls;
                            $('.left_panel').find('#' + this.answers[i].number).addClass('true');
                        } else {
                            $('.left_panel').find('#' + this.answers[i].number).addClass('false');
                        }
                    }
                }
            }

            //меняем режим на просмотр
            this.Mode.statusView();
            //номер вопроса на 1
            this.number=0;

            //удаляем галочки
            //$('.left_panel .img-check').removeClass('img-check-yes');
            return '<div class="h3">Тест закончен, количество набранных вами баллов составляет ' + balls + ' из ' + MaxBalls() + '. </br>Время потраченное на прохождение теста составляет ' + this.timer_obj.timeConvert(time) + '</div>';
        }

    };

    //кнопка закончить
    this.finish = function () {
        $('.number_question').empty();
        $('.question').empty();
        $('.option').empty();
        $('.result').html(this.getResult());
        this.timer_obj.stop();
        this.timer_obj.clear();
        //выключаем левое панель
        //$('.left_panel .shot_desc').unbind();

        var $finish=$('.finish');
        $finish.addClass('off');
        $finish.unbind();
    };

    this.showQuestion = function () {

        //очищаем результат теста, если он есть
        $('.result').empty();

        //скрываем содержимое вопроса
        $('.question').css('visibility', 'hidden');
        $('.option').css("visibility", "hidden");

        //получаем варианты ответов
        function getOption() {
            //преобразуем строку в массив с вариантами ответов и отдаем их
            function parseOptionString(option_array, type, count) {
                var tmp = '';
                if(count=='one') {
                    for (var i = 0; i < option_array.length; i++) {
                        var index=i+1;
                        tmp += '<div  class="option_answ" id="'+index+'">';
                        if (type == 'img') {
                            tmp += '<img src="./img/' + option_array[i] + '"/>';
                        } else {
                            tmp += '<div id="MathDiv">'+option_array[i]+'</div>';
                        }
                        tmp += '</div>';
                    }
                } else {
                    tmp+='<div class="checkbox_box">';
                    for (var i = 0; i < option_array.length; i++) {
                        var index=i+1;
                        tmp += '<div class="option_answ_checkbox"><input id="'+index+'" type="checkbox" ><span id="MathDiv" class="answ">' + option_array[i] + '</span></div>';
                    }
                    tmp+='</div>';
                }
                return tmp;
            }

            if (that.question[that.number].options == 'no') {
                var tmp = '<div class="option_box"><div class="inline">введите число: </div><div class="option_answ_input inline"><input type="text"></div></div>';
            } else {
                if(that.question[that.number].answer_type=='one') {
                    var tmp = '<div class="option_help">Выберите правильный вариант</div>';
                } else if(that.question[that.number].answer_type=='many'){
                    var tmp = '<div class="option_help">Выберите один или несколько<br> правильных вариантов</div>';
                }
                tmp += parseOptionString(that.question[that.number].array_answers, that.question[that.number].option_type, that.question[that.number].answer_type);
            }

            return tmp;
        }

        function findAnswerByNumber(number){
            for (var i = 0; i < that.answers.length; i++) {
                if (that.answers[i].number == number) {
                    console.log(that.answers[i]);
                     return that.answers[i];
                }
            }
        }

        //показываем ответ, если на вопрос уже отвечали
        function showUserAnswer() {
            //смотрим есть ли ответ
            var answ=findAnswerByNumber(that.number);

            //если ничего не нашли
            if (typeof(answ) == 'undefined') {
                return false;
            }else{
                //если есть, берем ответ
                answ=answ.answ;
            }

            //показ вовремя прохождения
            if(that.Mode.status=='game') {
                //если нет вариантов ответа
                if (that.question[that.number].options == 'no') {
                    $('.option_answ_input input').val(answ);
                    return true;
                } else {
                    //если ответ один
                    if (that.question[that.number].answer_type == 'one') {
                        $('.option .option_answ').each(function () {
                            if ($(this).attr('id') == answ) {
                                $(this).addClass('checked');
                                return false
                            }
                        });
                    } else {
                        //если ответов несколько
                        answ = answ.split(',');
                        for (var i = 0; i < answ.length; i++) {
                            $('.option .option_answ_checkbox').each(function () {
                                if ($(this).find('input').attr('id') == answ[i]) {
                                    $(this).find('input').attr('checked', 'checked');
                                }
                            });
                        }
                    }
                }
            }

            if(that.Mode.status=='view') {
                //если нет вариантов ответа
                if (that.question[that.number].options == 'no') {
                    $('.option_answ_input input').val(answ);
                    //если правильно ответил
                    if(that.question[that.number].answ==answ){
                        $('.option_answ_input').css('border-color','green');
                        $('.option_answ_input').css('border-width','3px');
                    } else{
                        $('.option_answ_input').css('border-color','red');
                        $('.option_answ_input').css('border-width','3px');
                        $('.option').append('<div style="color:green;text-align: center">Правильный ответ:'+that.question[that.number].answ+'</div>');
                    }
                    return true;
                } else{
                    //если ответ один
                    if (that.question[that.number].answer_type == 'one') {
                        $('.option .option_answ').each(function () {
                            if ($(this).attr('id') == answ) {

                                if(that.question[that.number].answ==answ){
                                    $(this).css('border-color','green');
                                    $(this).css('border-width','3px');
                                }  else{
                                    $(this).css('border-color','red');
                                    $(this).css('border-width','3px');

                                    //показываем правильный
                                    $('.option').find('#'+that.question[that.number].answ).css('border-color','green');
                                    $('.option').find('#'+that.question[that.number].answ).css('border-width','3px');
                                }

                            }
                        });
                    } else {
                        //если ответов несколько
                        //ответы пользователя
                        answ = answ.split(',');
                        //правильные ответы
                        var true_answ=that.question[that.number].answ.split(',');
                        for (var i = 0; i < answ.length; i++) {
                            $('.option .option_answ_checkbox').each(function () {
                                if ($(this).find('input').attr('id') == answ[i]) {
                                    $(this).find('input').attr('checked', 'checked');

                                    var t_answ=0;
                                    for(var l=0;l<true_answ.length;l++){
                                        if(true_answ[l]==answ[i]){
                                            /*$(this).css('border-width','3px');
                                            $(this).css('border-style','solid');
                                            $(this).css('border-color','green');*/
                                            t_answ=1;
                                            break;
                                        }
                                    }
                                    if(t_answ==0){
                                        $(this).css('border-width','3px');
                                        $(this).css('border-style','solid');
                                        $(this).css('border-color','red');
                                        $(this).css('border-radius','4px');
                                    }

                                }
                            });
                        }

                        for (var i = 0; i < true_answ.length; i++) {
                            var opt = $('.checkbox_box');
                            opt.find('#'+true_answ[i]).parent().css('border-width', '3px');
                            opt.find('#'+true_answ[i]).parent().css('border-style', 'solid');
                            opt.find('#'+true_answ[i]).parent().css('border-color', 'green');
                            opt.find('#'+true_answ[i]).parent().css('border-radius','4px');
                        }


                    }
                }
            }
        }

        // назад, первый вопрос
        if (this.number < 0) {
            this.number = this.question.length - 1;
        }
        //последний вопрос
        if (this.number > this.question.length - 1) {
            if (this.Mode.status == 'game') {
                this.finish();
                return false;
            } else {
                that.number = 0;
            }
        }
        //номер вопросы
        $('.number_question').html('Вопрос ' + this.question[that.number].chapter +'.'+this.question[this.number].number/*+' из '+that.question.length*/);
        //сам вопрос
        $('.work_space .question').html(this.question[this.number].qtext);

        //варианты ответов, если есть
        $('.option').html(getOption());

        //выделяем в левой панели текущий вопрос
        var left_panel = $('.left_panel');
        left_panel.find('div').removeClass('border_on');
        left_panel.find('#' + this.number).addClass('border_on');

        //клик по варианту ответа
        var answ_div = $('.option_answ');
        answ_div.unbind();
        answ_div.bind('click', function () {
            //увеличиваем на один, т.к массив начинается с 0, а ответы в базе с 1
            var value = Number($(this).attr('id'));
            that.add_answer({id: that.question[that.number].qid, answ: value});
            that.number++;
            that.showQuestion()
        });


        //клик enter
        //input.unbind();
        $(document).unbind();
        $(document).bind('keypress', function (event) {
            if (event.which == 13) {
                that.save();
                that.number++;
                that.showQuestion();

                //ставим курсор
                var input = $('.option_answ_input input');
                input.focus();
            }
        });

        //выводим варианты ответов
        showUserAnswer();
        //инициализируем рендеринг формул
        var math = MathJax.Hub.getAllJax("MathDiv")[0];

        MathJax.Hub.Queue(
            ["Typeset", MathJax.Hub, math],
            function () {
                $(".question").css("visibility", "visible");
                $(".option").css("visibility", "visible");
            }
        );

        //включаем навигацию
        var nav = $('.nav');
        if (nav.hasClass('off')) nav.removeClass('off');
    };

    var subject_click=function(){
        if (!$(this).hasClass('off')) {
            $('.subjects div').removeClass('yellow');
            $(this).removeClass('white');
            $(this).addClass('yellow');
            that.timer_obj.stop();
            that.timer_obj.clear();
            that.clearBlocks(['.number_question','.option','.result']);
            $('.left_panel').remove();
            $('.work_space .question').html('<div class="invite"><br><br><br><br><br><br><br><br>Чтобы начать прохождение теста нажмите кнопку <div class="button new_test">Новый тест</div></div>');

            //биндим кнопку в серой области
            $('.new_test').bind('click', function () {
                ege.start_test(ege.active_subject_id);
            });


        }
    };
    var subjects=$('.subjects div');
    subjects.unbind();
    subjects.bind('click', subject_click);
}

Test.prototype.clearBlocks=function(blocks){
    for(var i=0;i<blocks.length;i++){
        $(blocks[i]).empty();
    }
};