<div class="titleBand">
    <div class="titleBandInner">
        <table cellspacing="0" cellpadding="0" width="100%" border="0">
            <tbody>
            <tr>
                <td width="1%" style="white-space: nowrap;">
                            <span class="titleBandLink" id="title">
                                ЕГЭ по математике
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
            </tbody>
        </table>
    </div>
</div>

<!-- TOP BUTTONS -->
<div class="controlPanel top-c-panel nonSelectable">
    <table class="controlPanelLayout" cellpadding="0">
        <tbody>
        <tr>
            <td id="tb-prev-task" class="cpButton cpNormal nonSelectable disabled">Предыдущий вопрос</td>
            <td id="tb-next-task" class="cpButton cpNormal nonSelectable  disabled">Следующий вопрос</td>
            <td id="tbNewGameContainer" class="cpButton cpNormal nonSelectable cpKillHover">
                <table style="width: 100%; height: 100%;" cellspacing="0" cellpadding="0">
                    <tbody>
                    <tr>
                        <td id="tb-new-test" class="cpNormal roundedRight4px">Новый тест</td>
                    </tr>
                    </tbody>
                </table>
            </td>
            <td id="tb-finish-test" class="cpButton cpNormal nonSelectable disabled">Закончить тест</td>
        </tr>
        </tbody>
    </table>
</div>

<!-- GAME FIELD !! важно чтобы был див с таким айдишников и центрированием, относительного него и будет центрироваться блок с авторизацией !!-->
<div id="field">
    <?php include 'controllers/testMain.php'; ?>
</div>

<!-- BOTTOM BUTTONS -->
<div class="controlPanel nonSelectable">
    <table class="controlPanelLayout">
        <tbody>
        <tr>
            <td id="bbParameters" class="cpButton cpNormal nonSelectable disabled">Параметры</td>
            <td id="bbHistory" class="cpButton cpNormal nonSelectable disabled">История</td>
            <td id="bbRatings" class="cpButton cpNormal nonSelectable disabled">Рейтинг</td>
            <td id="bbLoginRegister" class="cpButton cpNormal nonSelectable" style="display: none;"> Авторизация</td>
            <td id="bbProfile" class="cpButton cpNormal nonSelectable"><span id="bbProfileLabel" style="display: none;">Личный кабинет</span>
                <span id="bbUnreadMsgCount" style="font-size: 8pt;">Новых сообщений: 1</span></td>
        </tr>
        </tbody>
    </table>
</div>

<!-- INCLUDE AUTHFORM  !! обязательно для включения, в блоке, с центрированием !! -->
<!-- welcome panel !-->
<div class="bubblePanel _hackOverFieldPanel" id="welcomePanel">
    <div class="overFieldInnerPanel">

        <h4 style="margin-top: 3px; margin-bottom: 13px; text-align: center;">
            Авторизация </h4>

        <table style="margin-bottom: 5px; width: 100%;" cellspacing="5px">
            <tbody>
            <tr>
                <td class="constantWidthTd" id="wpReg" style="width: 25%;">
                    <div style="color: #C42E21; font-weight: bold;" class="lrWelcomeBtnText">
                        Регистрация
                    </div>
                    <span class="lrWelcomeHint">только<br>имя и пароль </span>
                </td>
                <td class="constantWidthTd" id="wpLogin" style="width: 25%;">
                    <div style="font-weight: bold; color: #444;" class="lrWelcomeBtnText">
                        Войти
                    </div>
                    <span class="lrWelcomeHint">если вы уже<br>регистрировались</span>
                </td>
                <td class="constantWidthTd" id="wpVK" style="width: 25%;">
                    <div style="font-weight: bold; color: #444;" class="lrWelcomeBtnText">
                        <p style="margin-top: 2px;margin-bottom: 4px;"> Войти через</p> <img
                            src="./Example_files/vk_logo.png">
                    </div>
                </td>
                <td class="constantWidthTd" id="wpClose" style="width: 25%;">
                    <div style="font-weight: bold; color: #444;" class="lrWelcomeBtnText">
                        Играть как гость
                    </div>
                    <span class="lrWelcomeHint">без регистрации</span>
                </td>
            </tr>
            </tbody>
        </table>
        <div id="WelcomePanelContainer">

            <div style="padding-top: 10px;" id="lrLoginSection" class="lrSection">
                <h4>Войти</h4>
                <!--<span class="lrHeaderHint">если у вас уже есть имя и пароль</span>-->

                <form id="loginForm" method="POST" action="http://logic-games.spb.ru/example/#">
                    <input type="hidden" name="action" value="login">
                    <input type="hidden" name="sessionId" id="hfSessionId" value="">
                    <input type="hidden" name="userId" id="hfUserId" value="">
                    <table style="margin-top: 5px;" width="100%">
                        <tbody>
                        <tr>
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
                                запомнить меня на этом компьютере
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br>

                    <div style="margin-bottom: 32px;">
                        <div class="constantWidthBtn" id="loginCommit" tabindex="3">
                            Войти
                        </div>
                        <p class="msgShort" id="restorePass" style="float: right;">Забыли пароль?</p>
                    </div>
                </form>

            </div>

            <div style="padding-top: 10px;" id="lrRegisterSection" class="lrSection">
                <h4>Ввести новое имя</h4>
                <!--<span class="lrHeaderHint">если у вас ещё нет имени и пароля</span>-->

                <form id="regForm" method="post" action="http://logic-games.spb.ru/example/#" autocomplete="off">
                    <table style="margin-top: 5px;">
                        <tbody>
                        <tr>
                            <td>
                                Имя&nbsp;пользователя:
                            </td>
                            <td><input type="text" id="regUsername" name="login" autocomplete="off"></td>
                            <td>
                                <div id="usernameAlert"></div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Пароль:
                            </td>
                            <td><input type="password" id="regPasswd" name="password"></td>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                Повторите пароль:
                            </td>
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
                        </tbody>
                    </table>
                    <br>


                    <div style="margin-bottom: 32px;">
                        <div class="constantWidthBtn" id="regMeBtn">
                            Продолжить
                        </div>
                    </div>
                </form>
            </div>

            <div style="padding-top: 10px;" id="lrGuestSection" class="lrSection">
                <p>Вы можете играть как <span id="guestName"></span>.</p>

                <p>В этом случае Вы не сможете пользоваться личным кабинетом и Вам будет не доступна история игр с
                    другого компьютера.</p>

                <div class="constantWidthBtn" id="guestContinue">Продолжить</div>
                <br>
            </div>

            <div style="padding-top: 10px;" class="lrSection" id="restorePassPanel">
                <h4>Восстановление пароля</h4>
                <span class="lrHeaderHint">На почту, указанную в профиле, будет отправлен новый пароль</span>

                <form id="rpForm" method="POST" action="http://logic-games.spb.ru/example/#">
                    <input type="hidden" name="action" value="login">
                    <table style="margin-top: 5px;" width="100%">
                        <tbody>
                        <tr>
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
                        </tbody>
                    </table>
                    <br>

                    <div style="margin-bottom: 32px;">
                        <div class="constantWidthBtn" id="rpCommit">
                            Отправить
                            <!--<input type="submit" style="display: none;"/>-->
                        </div>
                        <div class="constantWidthBtn" id="rpCancel">
                            Отмена
                        </div>
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
    <img id="lrCloseIcon" class="closePanelIcon iconPadding" alt="Закрыть форму входа / ввода нового имени"
         src="./Example_files/icon_close.png">

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
    <img id="cpCloseIcon" class="closePanelIcon iconPadding" alt="Закрыть форму входа / ввода нового имени"
         src="./Example_files/icon_close.png">

    <div class="overFieldInnerPanel">
        <h2 class="lrCommonHeader">Смена пароля</h2>

        <div id="cpLoginRegisterContainer">

            <div style="padding-top: 10px;" id="cpSection" class="lrSection">
                <form id="cpForm" method="POST" action="http://logic-games.spb.ru/example/#">
                    <input type="hidden" name="action" value="login">
                    <table style="margin-top: 5px;" width="100%">
                        <tbody>
                        <tr>
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
                        </tbody>
                    </table>
                    <br>

                    <div style="margin-bottom: 32px;">
                        <div class="constantWidthBtn" id="cpCommit">
                            Ок
                        </div>
                        <div class="constantWidthBtn" id="cpCancel">
                            Отмена
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<!-- end of change password panel -->