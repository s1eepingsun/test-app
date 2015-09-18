<!DOCTYPE html>
<!-- saved from url=(0034)http://logic-games.spb.ru/example/ -->
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Example-new.php</title>
    <script type="text/javascript" async="" src="./Example_files/watch.js"></script><script type="text/javascript">
        var _sessionId = "185902893855c0c045d5e279.29875954";
        var _userId = 9516893;
        var _username = "Kirill1";
        var _sign = "e82be25b8b8b6c2b866cf898d037cbaabc23577e5b722681d20d2a1b197999f3";
        var _isGuest = false;
        var _gameVariationId = 666;
        var _isFreshUser = false;
        var _isVk = false;
    </script>
    <script src="./Example_files/openapi.js" type="text/javascript"></script><script type="text/javascript" src="./Example_files/public-main.min.js"></script><style type="text/css"></style> 
    <script type="text/javascript" src="./Example_files/shared-main.js"></script>
    <script type="text/javascript" src="./Example_files/lang.ru.js"></script>
    <!-- styles -->
    <link rel="shortcut icon" type="image/x-icon" href="http://logic-games.spb.ru/freecell/favicon.ico">
    <link media="screen" href="./Example_files/shared.css" rel="stylesheet" type="text/css">
    <link media="screen" href="./Example_files/game-layout.css" rel="stylesheet" type="text/css">
    <link media="screen" href="css/test-main.css" rel="stylesheet" type="text/css">

    <!-- assigning php data to js variable -->
    <?php include 'controllers/testDataToJS.php'; ?>

    <!-- handlebars templates -->
    <script id="test-result-tmpl" type="text/x-handlebars-template">
        <?php include 'tmpl/result.hbs'; ?>
    </script>

    <!-- thrid-party libraries -->
    <script type="text/javascript" src="js/libs/handlebars-v3.0.3.js"></script>
    <script type="text/javascript" src="js/libs/underscore-min.js"></script>
    <script type="text/javascript" src="js/libs/backbone-min.js"></script>
    <script type="text/javascript" src="../mathjax/MathJax.js?config=TeX-AMS_HTML"></script>

    <!-- modules -->
    <script type="text/javascript" src="js/Timer.js"></script>
    <script type="text/javascript" src="js/models/Test.js"></script>
    <script type="text/javascript" src="js/views/TestView.js"></script>

    <!-- application core (should be positioned after modules) -->
    <script type="text/javascript" src="js/main.js"></script>
</head>
<body>

<!-- MAIN -->
<table class="mainLayout" cellspacing="0" cellpadding="0">
<tbody><tr>
<td class="gameAreaLayout">

    <div class="gameArea" id="gameArea">
        <div id="left-side-bar">
        <?php include 'controllers/testSidebar.php'; ?>
        </div>
        <!-- TOP LINKS -->
        <div class="titleBand">
            <div class="titleBandInner">
                <table cellspacing="0" cellpadding="0" width="100%" border="0">
                    <tbody><tr>
                        <td width="1%" style="white-space: nowrap;">
                            <span class="titleBandLink" id="title">
                                Математика
                            </span>
                        </td>

                        <td>&nbsp;</td>

                        <td width="1%" align="center" style="white-space: nowrap;">
                            <span class="titleBandLink" id="showDescription">
                                Описаниие
                            </span>
                        </td>

                        <td>&nbsp;</td>

                        <td width="1%" align="center" style="white-space: nowrap;">
                            <span id="gbShow" class="titleBandLink">
                                Вопросы и отзывы
                            </span>
                        </td>

                        <td>&nbsp;</td>

                        <td width="1%" align="right" style="white-space: nowrap;">
                            <a href="http://logic-games.spb.ru/" class="titleBandLink">
                                Перейти на другие игры
                            </a>
                        </td>
                    </tr>
                </tbody></table>
            </div>
        </div>

        <!-- TOP BUTTONS -->
        <div class="controlPanel top-c-panel nonSelectable">
            <table class="controlPanelLayout" cellpadding="0">
                <tbody><tr>
                    <td id="tb-prev-task" class="cpButton cpNormal nonSelectable disabled">Предыдущий вопрос</td>
                    <td id="tb-next-task" class="cpButton cpNormal nonSelectable  disabled">Следующий вопрос</td>
                    <td id="tbNewGameContainer" class="cpButton cpNormal nonSelectable cpKillHover">
                        <table style="width: 100%; height: 100%;" cellspacing="0" cellpadding="0">
                            <tbody><tr>
                                <td id="tb-new-test" class="cpNormal roundedRight4px">Новый тест</td>
                            </tr>
                        </tbody></table>
                    </td>
                    <td id="tb-finish-test" class="cpButton cpNormal nonSelectable disabled">Закончить тест</td>
                </tr>
            </tbody></table>
        </div>

        <!-- GAME FIELD !! важно чтобы был див с таким айдишников и центрированием, относительного него и будет центрироваться блок с авторизацией !!-->
        <div id="field"> 
        <?php include 'controllers/testMain.php'; ?>
        </div>

        <!-- BOTTOM BUTTONS -->
        <div class="controlPanel nonSelectable">
            <table class="controlPanelLayout">
                <tbody><tr>
                    <td id="bbParameters" class="cpButton cpNormal nonSelectable">Параметры</td>
                    <td id="bbHistory" class="cpButton cpNormal nonSelectable">История</td>
                    <td id="bbRatings" class="cpButton cpNormal nonSelectable">Рейтинг</td>
                    <td id="bbLoginRegister" class="cpButton cpNormal nonSelectable" style="display: none;"> Авторизация </td>
                    <td id="bbProfile" class="cpButton cpNormal nonSelectable"> <span id="bbProfileLabel" style="display: none;">Личный кабинет</span> <span id="bbUnreadMsgCount" style="font-size: 8pt;">Новых сообщений: 1</span> </td>
                </tr>
            </tbody></table>
        </div>

        <!-- INCLUDE AUTHFORM  !! обязательно для включения, в блоке, с центрированием !! -->
        <!-- welcome panel !-->
<div class="bubblePanel _hackOverFieldPanel" id="welcomePanel">
    <div class="overFieldInnerPanel">

        <h4 style="margin-top: 3px; margin-bottom: 13px; text-align: center;">
            Авторизация        </h4>

        <table style="margin-bottom: 5px; width: 100%;" cellspacing="5px">
            <tbody><tr>
                <td class="constantWidthTd" id="wpReg" style="width: 25%;">
                    <div style="color: #C42E21; font-weight: bold;" class="lrWelcomeBtnText">
                        Регистрация                    </div>
                    <span class="lrWelcomeHint">только<br>имя и пароль </span>
                </td>
                <td class="constantWidthTd" id="wpLogin" style="width: 25%;">
                    <div style="font-weight: bold; color: #444;" class="lrWelcomeBtnText">
                        Войти                    </div>
                    <span class="lrWelcomeHint">если вы уже<br>регистрировались</span>
                </td>
                <td class="constantWidthTd" id="wpVK" style="width: 25%;">
                    <div style="font-weight: bold; color: #444;" class="lrWelcomeBtnText">
                        <p style="margin-top: 2px;margin-bottom: 4px;"> Войти через</p> <img src="./Example_files/vk_logo.png">
                    </div>
                </td>
                <td class="constantWidthTd" id="wpClose" style="width: 25%;">
                    <div style="font-weight: bold; color: #444;" class="lrWelcomeBtnText">
                        Играть как гость                    </div>
                    <span class="lrWelcomeHint">без регистрации</span>
                </td>
            </tr>
        </tbody></table>
        <div id="WelcomePanelContainer">

            <div style="padding-top: 10px;" id="lrLoginSection" class="lrSection">
                <h4>Войти</h4>
                <!--<span class="lrHeaderHint">если у вас уже есть имя и пароль</span>-->

                <form id="loginForm" method="POST" action="http://logic-games.spb.ru/example/#">
                    <input type="hidden" name="action" value="login">
                    <input type="hidden" name="sessionId" id="hfSessionId" value="">
                    <input type="hidden" name="userId" id="hfUserId" value="">
                    <table style="margin-top: 5px;" width="100%">
                        <tbody><tr>
                            <td width="10%">Имя&nbsp;пользователя:</td>
                            <td width="10%">
                                <input id="loginUsername" name="login" tabindex="1">
                            </td>
                            <td rowspan="3" style="vertical-align: top;">
                                <div style="float: left;" id="loginResult"></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Пароль:</td>
                            <td><input type="password" id="loginPasswd" name="password" tabindex="2"></td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding-top: 5px;">
                                <input class="lrRememberCheckBox" name="remember" value="1" type="checkbox" checked="">
                                запомнить меня на этом компьютере                            </td>
                        </tr>
                    </tbody></table>
                    <br>

                    <div style="margin-bottom: 32px;">
                        <div class="constantWidthBtn" id="loginCommit" tabindex="3">
                            Войти                        </div>
                        <p class="msgShort" id="restorePass" style="float: right;">Забыли пароль?</p>
                    </div>
                </form>

            </div>

            <div style="padding-top: 10px;" id="lrRegisterSection" class="lrSection">
                <h4>Ввести новое имя</h4>
                <!--<span class="lrHeaderHint">если у вас ещё нет имени и пароля</span>-->

                <form id="regForm" method="post" action="http://logic-games.spb.ru/example/#" autocomplete="off">
                    <table style="margin-top: 5px;">
                        <tbody><tr>
                            <td>
                                Имя&nbsp;пользователя:                            </td>
                            <td><input type="text" id="regUsername" name="login" autocomplete="off"></td>
                            <td>
                                <div id="usernameAlert"></div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Пароль:                            </td>
                            <td><input type="password" id="regPasswd" name="password"></td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                Повторите пароль:                            </td>
                            <td><input type="password" id="regPasswdVerification"></td>
                            <td>
                                <div id="passwdAlert"></div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <div id="regResult"></div>
                            </td>
                        </tr>
                    </tbody></table>
                    <br>


                    <div style="margin-bottom: 32px;">
                        <div class="constantWidthBtn" id="regMeBtn">
                            Продолжить                        </div>
                    </div>
                </form>
            </div>

            <div style="padding-top: 10px;" id="lrGuestSection" class="lrSection">
                <p>Вы можете играть как <span id="guestName"></span>.</p>
                <p>В этом случае Вы не сможете пользоваться личным кабинетом и Вам будет не доступна история игр с другого компьютера.</p>
                <div class="constantWidthBtn" id="guestContinue">Продолжить</div>
                <br>
            </div>

            <div style="padding-top: 10px;" class="lrSection" id="restorePassPanel">
                <h4>Восстановление пароля</h4>
                <span class="lrHeaderHint">На почту, указанную в профиле, будет отправлен новый пароль</span>
                            <form id="rpForm" method="POST" action="http://logic-games.spb.ru/example/#">
                                <input type="hidden" name="action" value="login">
                                <table style="margin-top: 5px;" width="100%">
                                    <tbody><tr>
                                        <td width="10%">Имя&nbsp;пользователя:</td>
                                        <td width="10%">
                                            <input id="rpUsername" name="login">
                                        </td>
                                        <td rowspan="3" style="vertical-align: top;">
                                            <div style="float: left;" id="rpResult"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Электронная почта</td>
                                        <td><input id="rpMail" name="mail"></td>
                                    </tr>
                                </tbody></table>
                                <br>

                                <div style="margin-bottom: 32px;">
                                    <div class="constantWidthBtn" id="rpCommit">
                                        Отправить
                                        <!--<input type="submit" style="display: none;"/>-->
                                    </div>
                                    <div class="constantWidthBtn" id="rpCancel">
                                        Отмена                                    </div>
                                </div>
                            </form>
            </div>
        </div>
    </div>
</div>
<div id="welcomeOverlay"></div>
<!-- end of welcome panel -->

<!-- login panel !-->
<div class="bubblePanel _hackOverFieldPanel" id="loginRegisterPanel">
    <img id="lrCloseIcon" class="closePanelIcon iconPadding" alt="Закрыть форму входа / ввода нового имени" src="./Example_files/icon_close.png">

    <div class="overFieldInnerPanel">
        <h2 class="lrCommonHeader">Войти в личный кабинет</h2>

        <div id="lrLoginRegisterContainer">




        </div>
    </div>
</div>
<!-- end of register panel -->

<!-- restore password panel !-->

<!-- end of register panel -->

<!-- change password panel !-->
<div class="bubblePanel _hackOverFieldPanel" id="changePassPanel">
    <img id="cpCloseIcon" class="closePanelIcon iconPadding" alt="Закрыть форму входа / ввода нового имени" src="./Example_files/icon_close.png">

    <div class="overFieldInnerPanel">
        <h2 class="lrCommonHeader">Смена пароля</h2>

        <div id="cpLoginRegisterContainer">

            <div style="padding-top: 10px;" id="cpSection" class="lrSection">
                <form id="cpForm" method="POST" action="http://logic-games.spb.ru/example/#">
                    <input type="hidden" name="action" value="login">
                    <table style="margin-top: 5px;" width="100%">
                        <tbody><tr>
                            <td width="35%">Старый пароль</td>
                            <td width="35%">
                                <input type="password" id="cpOldPassword" name="cpOldPassword">
                            </td>
                            <td rowspan="3" style="vertical-align: top;">
                                <div style="float: left;" id="cpResult"></div>
                            </td>
                        </tr>
                        <tr>
                            <td>Новый пароль</td>
                            <td><input type="password" id="cpNewPassword1" name="cpNewPassword1"></td>
                        </tr>
                        <tr>
                            <td>Повторите новый пароль</td>
                            <td><input type="password" id="cpNewPassword2" name="cpNewPassword2"></td>
                        </tr>
                    </tbody></table>
                    <br>

                    <div style="margin-bottom: 32px;">
                        <div class="constantWidthBtn" id="cpCommit">
                            Ок
                        </div>
                        <div class="constantWidthBtn" id="cpCancel">
                            Отмена                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- end of change password panel -->    </div>


    <!-- BOTTOM AREA AND PANELS !! обязательно для включения, в блоке, с центрированием !! -->
    <div class="bottomArea" id="bottomArea">
        <!-- profile panel -->
<div class="bubblePanel bottomSubPanel bottomPanel _hackPaddingLayer" id="profilePanel" style="display: none;">
    <div id="profileMainTab" style="display: block;">
        <img id="profileCloseImg" src="./Example_files/icon_close.png" alt="Закрыть">

        <div id="profileLoading" style="padding-top: 20px; padding-left: 20px; height: 35px; font-family: Verdana; font-weight: bold; display: none;">
            <span style="float: left; color:#444444;">Загрузка...&nbsp;</span>
            <img style="float: left; margin-top: -10px;" src="./Example_files/loading.gif">
        </div>

        <div id="profileContents" style="display: block;">
            <div style="float: left;">
                <h4>Ваш личный кабинет («<span id="profileUsername">Kirill1</span>»)</h4>
            </div>
            <img src="./Example_files/loading.gif" class="profileLoadingIcon" id="profileLoadingIcon" style="display: none;">

            <div class="clear"></div>

            <table>
                <tbody><tr>
                    <td width="1%" style="vertical-align: top;">
                        <div id="profilePhoto" style="float: left; padding-top: 10px; padding-right: 10px; width: 135px;">
                            <div class="profilePhotoFrame" id="profilePhotoFrame" style="border: 1px solid rgb(204, 204, 204);"><img class="profilePhoto" src="./Example_files/nophoto-ru.png"></div>
                        </div>
                    </td>
                    <td style="vertical-align: top;">
                        <div id="profileData" style="float: left; padding-top: 3px;">
                            <table id="profilePIStaticLayout">
                                <tbody><tr>
                                    <td>
                                        <div id="profilePIStatic"><table class="playerProfileTable" style=" width: 100%;word-wrap: break-word; table-layout: fixed; "><tbody><tr><td>Дата&nbsp;рождения: </td><td><span class="profileAbsentField">не указано</span></td></tr><tr><td>Город: </td><td><span class="profileAbsentField">не указано</span></td></tr><tr><td>Ссылка в соц-сети: </td><td><span class="profileAbsentField">не указано</span></td></tr><tr><td title="Для восстановления пароля">Электронная почта:</td><td title="Для восстановления пароля"><span class="profileAbsentField">не указано</span></td></tr><tr><td>О себе: </td><td><span class="profileAbsentField">не указано</span></td></tr><tr><td>Дата регистрации: </td><td>10 августа 2015</td></tr></tbody></table></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div id="profileEditBtn" class="constantWidthBtn nonSelectable" style="margin-left: 0px;">Редактировать профиль                                        </div>
                                    </td>
                                </tr>
                            </tbody></table>
                            <div id="profilePIEditable" style="display: none;">
                                <form id="profileForm" method="post" enctype="multipart/form-data" action="http://logic-games.spb.ru/gw/profile/updateProfile.php">
                                    <table>
                                        <tbody><tr>
                                            <td>День рождения:</td>
                                            <td>
                                                <table style="width: 100%" cellspacing="0" cellpadding="0">
                                                    <tbody><tr>
                                                        <td style="text-align: left;">
                                                            <select name="birthDay" id="profileBirthDay" class="profileShortField">
                                                                <option value="0">—</option>
                                                                <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option>                                                            </select>
                                                        </td>
                                                        <td style="text-align: center;">
                                                            <select name="birthMonth" id="profileBirthMonth" class="profileShortField">
                                                                <option value="0">—</option>
                                                                <option value="1">января</option><option value="2">февраля</option><option value="3">марта</option><option value="4">апреля</option><option value="5">мая</option><option value="6">июня</option><option value="7">июля</option><option value="8">августа</option><option value="9">сентября</option><option value="10">октября</option><option value="11">ноября</option><option value="12">декабря</option>                                                            </select>
                                                        </td>
                                                        <td style="text-align: right;">
                                                            <select name="birthYear" id="profileBirthYear" class="profileShortField">
                                                                <option value="0">—</option>
                                                                
                                                                <option value="2015">2015</option>
                                                                
                                                                <option value="2014">2014</option>
                                                                
                                                                <option value="2013">2013</option>
                                                                
                                                                <option value="2012">2012</option>
                                                                
                                                                <option value="2011">2011</option>
                                                                
                                                                <option value="2010">2010</option>
                                                                
                                                                <option value="2009">2009</option>
                                                                
                                                                <option value="2008">2008</option>
                                                                
                                                                <option value="2007">2007</option>
                                                                
                                                                <option value="2006">2006</option>
                                                                
                                                                <option value="2005">2005</option>
                                                                
                                                                <option value="2004">2004</option>
                                                                
                                                                <option value="2003">2003</option>
                                                                
                                                                <option value="2002">2002</option>
                                                                
                                                                <option value="2001">2001</option>
                                                                
                                                                <option value="2000">2000</option>
                                                                
                                                                <option value="1999">1999</option>
                                                                
                                                                <option value="1998">1998</option>
                                                                
                                                                <option value="1997">1997</option>
                                                                
                                                                <option value="1996">1996</option>
                                                                
                                                                <option value="1995">1995</option>
                                                                
                                                                <option value="1994">1994</option>
                                                                
                                                                <option value="1993">1993</option>
                                                                
                                                                <option value="1992">1992</option>
                                                                
                                                                <option value="1991">1991</option>
                                                                
                                                                <option value="1990">1990</option>
                                                                
                                                                <option value="1989">1989</option>
                                                                
                                                                <option value="1988">1988</option>
                                                                
                                                                <option value="1987">1987</option>
                                                                
                                                                <option value="1986">1986</option>
                                                                
                                                                <option value="1985">1985</option>
                                                                
                                                                <option value="1984">1984</option>
                                                                
                                                                <option value="1983">1983</option>
                                                                
                                                                <option value="1982">1982</option>
                                                                
                                                                <option value="1981">1981</option>
                                                                
                                                                <option value="1980">1980</option>
                                                                
                                                                <option value="1979">1979</option>
                                                                
                                                                <option value="1978">1978</option>
                                                                
                                                                <option value="1977">1977</option>
                                                                
                                                                <option value="1976">1976</option>
                                                                
                                                                <option value="1975">1975</option>
                                                                
                                                                <option value="1974">1974</option>
                                                                
                                                                <option value="1973">1973</option>
                                                                
                                                                <option value="1972">1972</option>
                                                                
                                                                <option value="1971">1971</option>
                                                                
                                                                <option value="1970">1970</option>
                                                                
                                                                <option value="1969">1969</option>
                                                                
                                                                <option value="1968">1968</option>
                                                                
                                                                <option value="1967">1967</option>
                                                                
                                                                <option value="1966">1966</option>
                                                                
                                                                <option value="1965">1965</option>
                                                                
                                                                <option value="1964">1964</option>
                                                                
                                                                <option value="1963">1963</option>
                                                                
                                                                <option value="1962">1962</option>
                                                                
                                                                <option value="1961">1961</option>
                                                                
                                                                <option value="1960">1960</option>
                                                                
                                                                <option value="1959">1959</option>
                                                                
                                                                <option value="1958">1958</option>
                                                                
                                                                <option value="1957">1957</option>
                                                                
                                                                <option value="1956">1956</option>
                                                                
                                                                <option value="1955">1955</option>
                                                                
                                                                <option value="1954">1954</option>
                                                                
                                                                <option value="1953">1953</option>
                                                                
                                                                <option value="1952">1952</option>
                                                                
                                                                <option value="1951">1951</option>
                                                                
                                                                <option value="1950">1950</option>
                                                                
                                                                <option value="1949">1949</option>
                                                                
                                                                <option value="1948">1948</option>
                                                                
                                                                <option value="1947">1947</option>
                                                                
                                                                <option value="1946">1946</option>
                                                                
                                                                <option value="1945">1945</option>
                                                                
                                                                <option value="1944">1944</option>
                                                                
                                                                <option value="1943">1943</option>
                                                                
                                                                <option value="1942">1942</option>
                                                                
                                                                <option value="1941">1941</option>
                                                                
                                                                <option value="1940">1940</option>
                                                                
                                                                <option value="1939">1939</option>
                                                                
                                                                <option value="1938">1938</option>
                                                                
                                                                <option value="1937">1937</option>
                                                                
                                                                <option value="1936">1936</option>
                                                                
                                                                <option value="1935">1935</option>
                                                                
                                                                <option value="1934">1934</option>
                                                                
                                                                <option value="1933">1933</option>
                                                                
                                                                <option value="1932">1932</option>
                                                                
                                                                <option value="1931">1931</option>
                                                                
                                                                <option value="1930">1930</option>
                                                                
                                                                <option value="1929">1929</option>
                                                                
                                                                <option value="1928">1928</option>
                                                                
                                                                <option value="1927">1927</option>
                                                                
                                                                <option value="1926">1926</option>
                                                                
                                                                <option value="1925">1925</option>
                                                                
                                                                <option value="1924">1924</option>
                                                                
                                                                <option value="1923">1923</option>
                                                                
                                                                <option value="1922">1922</option>
                                                                
                                                                <option value="1921">1921</option>
                                                                
                                                                <option value="1920">1920</option>
                                                                
                                                                <option value="1919">1919</option>
                                                                
                                                                <option value="1918">1918</option>
                                                                
                                                                <option value="1917">1917</option>
                                                                
                                                                <option value="1916">1916</option>
                                                                
                                                                <option value="1915">1915</option>
                                                                
                                                                <option value="1914">1914</option>
                                                                
                                                                <option value="1913">1913</option>
                                                                
                                                                <option value="1912">1912</option>
                                                                
                                                                <option value="1911">1911</option>
                                                                
                                                                <option value="1910">1910</option>
                                                                
                                                                <option value="1909">1909</option>
                                                                
                                                                <option value="1908">1908</option>
                                                                
                                                                <option value="1907">1907</option>
                                                                
                                                                <option value="1906">1906</option>
                                                                
                                                                <option value="1905">1905</option>
                                                                
                                                                <option value="1904">1904</option>
                                                                
                                                                <option value="1903">1903</option>
                                                                
                                                                <option value="1902">1902</option>
                                                                
                                                                <option value="1901">1901</option>
                                                                
                                                                <option value="1900">1900</option>
                                                                                                                            </select>
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Город:</td>
                                            <td>
                                                <input name="where" id="profileWhere" type="text" class="profileField">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Ссылка в соц-сети:</td>
                                            <td>
                                                <input name="link" id="profileLink" type="text" class="profileField">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td title="Для восстановления пароля">Электронная почта:</td>
                                            <td title="Для восстановления пароля">
                                                <input name="mail" id="profileMail" type="email" class="profileField">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>О себе:</td>
                                            <td>
                                                <textarea name="about" id="profileAbout" type="text" class="profileField"></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Фото:</td>
                                            <td>
                                                <input id="profilePhotoField" name="photo" type="file" size="33" class="profileField">
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <div class="profileCP">
                                                    <div id="profileSaveBtn" class="constantWidthBtn nonSelectable" style="margin-left: 0px;">
                                                        Сохранить                                                    </div>
                                                    <div id="profileDiscardChangesBtn" class="constantWidthBtn nonSelectable" style="margin-left: 0px;">
                                                        Отмена                                                    </div>
                                                    <img id="profileLoadingImg" src="./Example_files/loading.gif">
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                </form>
                            </div>
                        </div>
                        <div style="padding-top:15px; padding-left: 3px; clear: both;">
                            <div class="bspTopHeader" id="profileUnreadMsgAlert" style="display: block;">
                                <span id="profileReadMsgBtn">Новых сообщений: 1</span>
                            </div>
                            <div style="display: block; padding-bottom: 15px;">
                                <input type="checkbox" id="profileGoInvisible">Скрыть моё пребывание на сайте                                <img id="profileGoInvisibleLoadingImg" src="./Example_files/loading_transparent.gif" style="width: 14px; padding-left: 5px; display: none;" alt="">
                            </div>
                            <span class="bspTopHeader" id="profileGoToInbox" style="display: none;">
                                Посмотреть личные сообщения                            </span><br>
                            <span class="bspTopHeader" id="sendToAdmin">
                                Написать админу                            </span>
                            <span class="bspTopHeader" id="changePassword">
                                Изменить пароль                            </span>
                        </div>
                        <div id="profileSideActivity"></div>
                    </td>
                </tr>
            </tbody></table>

            <div class="clear"></div>
            <div class="profileLogoutPanel">
                <div style="margin-top: 20px; padding-top: 5px; border-top: 1px dashed rgb(204, 204, 204); display: block;">
                    <span class="bspAuxBtn" style="float: left;" id="profileLogoutBtn">[Выйти из ЛК и играть как гость]</span>
                    <span class="bspAuxBtn" style="float: right;" id="shareBtn">[Рекомендовать игру в соц. сетях]</span>
                </div>
                <div class="clear"></div>
            </div>
        </div>

    </div>

    <div id="profileSubTab" style="display: none;"></div>
</div>
<!-- end of profile panel --><div class="bubblePanel bottomSubPanel bottomPanel _hackPaddingLayer" id="guestBookPanel" style="display: none;">
    <img id="gbLoadingIcon" class="loadingIcon" src="./Example_files/loading.gif" alt="Загрузка">
    <img id="gbCloseIcon" class="closePanelIcon" src="./Example_files/icon_close.png" alt="Закрыть гостевую книгу">

    <div id="gbContents"><h4>Вопросы и отзывы</h4><textarea id="gbPostText" class="gbPostTextArea" rows="3"></textarea><img src="./Example_files/loading.gif" id="gbPostLoadingIcon" alt="Отправка сообщения"><div id="gbPostBtn" class="constantWidthBtn">Добавить сообщение</div><div class="clear"></div><div class="gbNoMessagesAlert">Пока никто не оставил сообщений.</div></div>
</div>
    </div>

</td>
</tr>

    <!-- FOOTER STATS  -->
<tr>
    <td style="text-align: center; padding-bottom: 10px;">
        <!-- !! обязательно для включения, в блоке, с центрированием !! -->
        <div class="lg-workbaner" style="padding-top: 10px; width: 544px; margin: 0px auto; position: relative; left: 0px; right: 0px; display: block;">
        <img id="closeBanner" src="./Example_files/icon_close.png" alt="Закрыть" style="    box-shadow: rgba(255, 255, 255, 0.84) 0px 0px 1px 1px;position: absolute;margin-top: 1px;right: 1px;float: right;cursor: pointer;width: 22px;background-color: white;border-radius: 12px;" onclick="$(&#39;.lg-workbaner&#39;).hide();">
        <a href="http://logic-games.spb.ru/poker" onclick="$.post(&#39;/gw/banner.php&#39;, {user_id:_userId, game_id:_gameVariationId, link:&#39;http://http://logic-games.spb.ru/poker&#39; })"><img width="544" src="./Example_files/poker.png"></a>
    </div><div id="activityDiv">
    <p>Сейчас на сайте — гостей: 0, зарегистрированных пользователей: 0 (из 0).</p></div>
<div id="vstats">
    <p></p><p>Всего уникальных посетителей — вчера: 0, сегодня: 0</p>    <p></p>
</div>
<div id="copyright">©
    Программный продукт <a href="http://v6.spb.ru/" target="_blank">Юридического центра «Восстания-6»</a>
    <script type="text/javascript"><!--
    document.write("<img src='//counter.yadro.ru/hit?t39.5;r" +
            escape(document.referrer) + ((typeof(screen) == "undefined") ? "" :
            ";s" + screen.width + "*" + screen.height + "*" + (screen.colorDepth ?
                    screen.colorDepth : screen.pixelDepth)) + ";u" + escape(document.URL) +
            ";" + Math.random() +
            "' " +
            "border='0' width='1' height='1'>")
    //--></script><img src="./Example_files/hit" border="0" width="1" height="1">
</div>

<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter20303959 = new Ya.Metrika({id:20303959,
                    webvisor:true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true});
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = (d.location.protocol == "https:" ? "https:" : "http:") +
            "//mc.yandex.ru/metrika/watch.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
</script>
<noscript>&lt;div&gt;&lt;img src="//mc.yandex.ru/watch/20303959"
                    style="position:absolute; left:-9999px;" alt="" /&gt;&lt;/div&gt;</noscript>
<script></script>
<!-- /Yandex.Metrika counter -->    </td>
</tr>
</tbody></table>

<div id="lightboxOverlay" style="display: none;"></div><div id="lightbox" style="display: none;"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src=""><div class="lb-nav"><a class="lb-prev" href=""></a><a class="lb-next" href=""></a></div><div class="lb-loader"><a class="lb-cancel"><img src="./Example_files/loading(1).gif"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close"><img src="./Example_files/close.png"></a></div></div></div></div></body></html>